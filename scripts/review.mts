/**
 * PRmate GitHub Actions 메인 스크립트
 * 실행: tsx scripts/review.mts
 */
import { Octokit } from '@octokit/rest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parseConfig } from '../src/lib/config/loader.js';
import { DEFAULT_CONFIG, PRmateConfig } from '../src/lib/config/schema.js';
import { extractPRContext } from '../src/lib/github/diff.js';
import {
  generateKoreanReview,
  formatReviewComment,
  shouldChunk,
  generateChunkedReview,
} from '../src/lib/review/engine.js';
import {
  postPendingComment,
  updateComment,
  postErrorComment,
  postSkipComment,
  postInlineReview,
  submitReviewState,
} from '../src/lib/github/comment.js';
import { classifyError, formatErrorMessage } from '../src/lib/github/errors.js';

// ─── 환경 변수 검증 ───────────────────────────────────────────
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const PR_NUMBER_STR = process.env.PR_NUMBER;

if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN 환경 변수가 필요합니다.');
if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY 환경 변수가 필요합니다.');
if (!GITHUB_REPOSITORY) throw new Error('GITHUB_REPOSITORY 환경 변수가 필요합니다.');
if (!PR_NUMBER_STR) throw new Error('PR_NUMBER 환경 변수가 필요합니다.');

const [owner, repo] = GITHUB_REPOSITORY.split('/');
const pullNumber = parseInt(PR_NUMBER_STR, 10);

if (!owner || !repo || isNaN(pullNumber)) {
  throw new Error(`잘못된 환경 변수: GITHUB_REPOSITORY=${GITHUB_REPOSITORY}, PR_NUMBER=${PR_NUMBER_STR}`);
}

// ─── 설정 로더 ───────────────────────────────────────────────
function loadConfig(): PRmateConfig {
  const candidates = [
    process.env.PRMATE_CONFIG_PATH,
    process.env.GITHUB_WORKSPACE ? resolve(process.env.GITHUB_WORKSPACE, '.prmate.yml') : null,
    resolve(process.cwd(), '.prmate.yml'),
  ].filter(Boolean) as string[];

  for (const path of candidates) {
    if (existsSync(path)) {
      console.log(`[PRmate] 설정 파일 발견: ${path}`);
      return parseConfig(readFileSync(path, 'utf-8'));
    }
  }

  console.log('[PRmate] 설정 파일 없음 — 기본값 사용');
  return DEFAULT_CONFIG;
}

// ─── 라벨/제목 기반 스킵 체크 ───────────────────────────────────
async function shouldSkipByMeta(
  octokit: Octokit,
  config: PRmateConfig
): Promise<{ skip: boolean; reason?: string }> {
  const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: pullNumber });

  // PR 라벨 체크
  const labels = pr.labels.map((l) => (typeof l === 'string' ? l : l.name ?? '').toLowerCase());
  const skipLabels = config.skip_labels.map((l) => l.toLowerCase());
  const matched = labels.find((l) => skipLabels.includes(l));
  if (matched) {
    return { skip: true, reason: `PR 라벨 '${matched}' 매치` };
  }

  // PR 제목에 [skip review]
  if (pr.title.toLowerCase().includes('[skip review]')) {
    return { skip: true, reason: 'PR 제목에 [skip review] 태그' };
  }

  return { skip: false };
}

// ─── 메인 함수 ────────────────────────────────────────────────
async function main() {
  console.log(`[PRmate] 시작: ${GITHUB_REPOSITORY}#${pullNumber}`);

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const config = loadConfig();
  console.log(`[PRmate] 컨벤션: ${config.convention}, 레벨: ${config.review_level}, 모드: ${config.mode}, 모델: ${config.model}`);

  // ── Kill switch 체크 (Week 2-1) ──
  if (config.enabled === false) {
    console.log('[PRmate] ⏸ enabled: false — 리뷰 전면 중단');
    return;
  }

  // ── 라벨/제목 기반 스킵 (Week 2-6) ──
  const skipCheck = await shouldSkipByMeta(octokit, config);
  if (skipCheck.skip) {
    console.log(`[PRmate] ⏭ 스킵: ${skipCheck.reason}`);
    await postSkipComment(octokit, owner, repo, pullNumber, skipCheck.reason ?? '설정에 의해 스킵');
    return;
  }

  // ── Dry-run 모드 안내 (Week 2-9) ──
  if (config.dry_run) {
    console.log('[PRmate] 🧪 DRY-RUN 모드 — 실제 코멘트 게시 안 함');
  }

  let commentId: number | undefined;

  try {
    // 1. PR diff 추출
    console.log('[PRmate] PR diff 추출 중...');
    const context = await extractPRContext(octokit, owner, repo, pullNumber, config);

    if (context.files.length === 0) {
      if (!config.dry_run) {
        await postSkipComment(
          octokit, owner, repo, pullNumber,
          '리뷰할 변경 파일이 없습니다. (제외 패턴에 의해 모두 필터링됨)'
        );
      }
      console.log('[PRmate] 리뷰할 파일 없음 — 스킵');
      return;
    }

    console.log(`[PRmate] ${context.files.length}개 파일 분석 예정`);

    // 2. "분석 중..." 코멘트 게시 (dry-run 아닐 때만)
    if (!config.dry_run) {
      commentId = await postPendingComment(octokit, owner, repo, pullNumber);
    }

    // 3. Claude API로 한국어 리뷰 생성 (대형 PR은 청킹)
    console.log('[PRmate] Claude API 호출 중...');
    const result = shouldChunk(context, config)
      ? await generateChunkedReview(context, config)
      : await generateKoreanReview(context, config);

    console.log(
      `[PRmate] 리뷰 완료 — 입력: ${result.inputTokens}, 출력: ${result.outputTokens}, 캐시 적중: ${result.cacheReadTokens}`
    );

    if (config.dry_run) {
      console.log('[PRmate] 🧪 DRY-RUN 결과 (게시 안 함):');
      console.log('─'.repeat(60));
      console.log(result.body);
      console.log('─'.repeat(60));
      return;
    }

    // 4. 리뷰 코멘트 업데이트
    const reviewBody = formatReviewComment(result, config);
    if (commentId !== undefined) {
      await updateComment(octokit, owner, repo, commentId, reviewBody);
    }

    // 5. Inline 코멘트 추가 (Week 4-1)
    if (config.inline_comments && result.inlineComments && result.inlineComments.length > 0) {
      console.log(`[PRmate] Inline 코멘트 ${result.inlineComments.length}개 게시 중...`);
      await postInlineReview(octokit, owner, repo, pullNumber, result.inlineComments);
    }

    // 6. Review Approval/Changes 자동 판정 (Week 4-2)
    if (config.auto_approve && result.reviewState) {
      console.log(`[PRmate] 리뷰 상태: ${result.reviewState}`);
      await submitReviewState(octokit, owner, repo, pullNumber, result.reviewState);
    }

    console.log('[PRmate] 완료 ✅');
  } catch (err) {
    const errorInfo = classifyError(err);
    console.error(`[PRmate] 오류 발생 [${errorInfo.type}]: ${errorInfo.message}`);

    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }

    if (!config.dry_run) {
      const userMessage = formatErrorMessage(errorInfo);
      await postErrorComment(octokit, owner, repo, pullNumber, commentId, userMessage);
    }
    process.exit(1);
  }
}

main();
