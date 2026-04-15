/**
 * KorReview GitHub Actions 메인 스크립트
 * 실행: tsx scripts/review.mts
 */
import { Octokit } from '@octokit/rest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parseConfig } from '../src/lib/config/loader.js';
import { DEFAULT_CONFIG } from '../src/lib/config/schema.js';
import { extractPRContext } from '../src/lib/github/diff.js';
import { generateKoreanReview, formatReviewComment } from '../src/lib/review/engine.js';
import {
  postPendingComment,
  updateComment,
  postErrorComment,
  postSkipComment,
} from '../src/lib/github/comment.js';

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

// ─── 메인 함수 ────────────────────────────────────────────────
async function main() {
  console.log(`[KorReview] 시작: ${GITHUB_REPOSITORY}#${pullNumber}`);

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  // .korreview.yml 로드 (없으면 기본값)
  const configPath = resolve(process.cwd(), '.korreview.yml');
  const config = existsSync(configPath)
    ? (() => {
        console.log('[KorReview] .korreview.yml 발견, 설정 로드 중...');
        return parseConfig(readFileSync(configPath, 'utf-8'));
      })()
    : DEFAULT_CONFIG;

  console.log(`[KorReview] 컨벤션: ${config.convention}, 레벨: ${config.review_level}`);

  let commentId: number | undefined;

  try {
    // 1. PR diff 추출
    console.log('[KorReview] PR diff 추출 중...');
    const context = await extractPRContext(octokit, owner, repo, pullNumber, config);

    // 변경 파일 없으면 스킵
    if (context.files.length === 0) {
      await postSkipComment(
        octokit, owner, repo, pullNumber,
        '리뷰할 변경 파일이 없습니다. (제외 패턴에 의해 모두 필터링됨)'
      );
      console.log('[KorReview] 리뷰할 파일 없음 — 스킵');
      return;
    }

    console.log(`[KorReview] ${context.files.length}개 파일 분석 예정`);

    // 2. "분석 중..." 코멘트 게시
    commentId = await postPendingComment(octokit, owner, repo, pullNumber);

    // 3. Claude API로 한국어 리뷰 생성
    console.log('[KorReview] Claude API 호출 중...');
    const result = await generateKoreanReview(context, config);

    console.log(
      `[KorReview] 리뷰 완료 — 입력: ${result.inputTokens}, 출력: ${result.outputTokens}, 캐시 적중: ${result.cacheReadTokens}`
    );

    // 4. 리뷰 코멘트 업데이트
    const reviewBody = formatReviewComment(result, config);
    await updateComment(octokit, owner, repo, commentId, reviewBody);

    console.log('[KorReview] 완료 ✅');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[KorReview] 오류 발생: ${message}`);

    // 스택 트레이스는 로그에만 출력 (PR 코멘트에는 노출 금지)
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }

    await postErrorComment(octokit, owner, repo, pullNumber, commentId);
    process.exit(1);
  }
}

main();
