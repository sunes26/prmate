import {
  anthropic,
  MAX_TOKENS,
  TIMEOUT_MS,
  resolveModelId,
  calculateCost,
} from '../claude';
import { PRmateConfig } from '../config/schema';
import { PRContext, ParsedFile, formatDiffForReview } from '../github/diff';
import { getConventionRuleset, formatConventionForPrompt } from './conventions';
import { InlineComment, ReviewState } from '../github/comment';
import { loadTeamLearning, formatLearningForPrompt } from './learning';

// 총 시도 횟수 (초기 1회 + 타임아웃 재시도 1회)
const MAX_ATTEMPTS = 2;
const CHUNK_SIZE = 8; // 대형 PR 청킹 임계값 (파일 수)

// ═══════════════════════════════════════════════════════════════
// 시스템 프롬프트 빌더
// ═══════════════════════════════════════════════════════════════

function buildSystemPrompt(config: PRmateConfig): string {
  const convention = getConventionRuleset(config.convention, config.convention_file);
  const conventionText = formatConventionForPrompt(convention);

  const strictness =
    config.review_level === 'strict'
      ? '엄격한 기준으로 모든 문제를 상세히 지적하세요.'
      : config.review_level === 'relaxed'
        ? '주요 문제에만 집중하고 사소한 스타일 이슈는 생략하세요.'
        : '표준적인 기준으로 중요한 문제를 중심으로 리뷰하세요.';

  const languageInstruction =
    config.language === 'en'
      ? 'Write the review in natural, professional English.'
      : config.mixed_language
        ? '리뷰 설명은 한국어로, 코드와 기술 용어는 영어로 유지하세요. 자연스러운 국내 개발 문화의 "한영 혼용" 스타일을 따르세요.'
        : '리뷰는 자연스럽고 전문적인 한국어로 작성하세요. 번역체나 어색한 표현을 사용하지 마세요.';

  const modeInstruction = buildModeInstruction(config);
  const inlineInstruction = config.inline_comments
    ? buildInlineInstruction()
    : '';
  const approvalInstruction = config.auto_approve ? buildApprovalInstruction() : '';
  const customPromptSection = config.custom_prompt
    ? `\n\n## 팀 커스텀 지침\n\n${config.custom_prompt}`
    : '';

  // 팀 학습 데이터 (Week 4-9)
  const learningSection = config.learning?.enabled
    ? formatLearningForPrompt(loadTeamLearning(config.learning))
    : '';

  return `당신은 경험 많은 한국 시니어 개발자입니다. GitHub PR 코드를 리뷰합니다.

## 리뷰 원칙

1. **언어** — ${languageInstruction}
2. **우선순위** — 버그/보안 → 성능 → 가독성/유지보수 순으로 다룹니다.
3. **심각도 분류**:
   - \`[위험]\` — 즉시 수정해야 하는 버그, 보안 취약점
   - \`[권장]\` — 수정을 강력히 권장하는 문제
   - \`[제안]\` — 개선 가능한 부분 (선택적)
4. **수정 예시 필수** — 문제 지적 시 반드시 수정된 코드 예시 포함.
5. **긍정 피드백** — 잘 작성된 코드는 반드시 언급.
6. **리뷰 수준** — ${strictness}

${modeInstruction}

## 적용 컨벤션

${conventionText}

${learningSection}

${inlineInstruction}

${approvalInstruction}

## 출력 형식

${buildOutputFormat(config)}

${customPromptSection}`;
}

function buildModeInstruction(config: PRmateConfig): string {
  switch (config.mode) {
    case 'security':
      return `## 🛡️ 보안 전용 모드

이 리뷰는 **보안 취약점만 집중 분석**합니다:
- SQL Injection, XSS, CSRF, SSRF
- 인증/인가 우회 가능성
- 하드코딩된 비밀 정보
- 의존성 취약점 (알려진 CVE)
- 입력 검증 미비
- 파일 업로드/다운로드 경로 공격

보안과 무관한 스타일/가독성 이슈는 **생략**하세요.`;

    case 'pipa':
      return `## 🇰🇷 PIPA (개인정보보호법) 전용 모드

이 리뷰는 **한국 개인정보보호법 위반 가능성만** 집중 분석합니다:
- 주민번호, 운전면허번호, 외국인등록번호 등 고유식별정보 평문 저장
- 이메일, 전화번호, 주소 등 개인정보 로깅
- 민감정보(건강·성생활·사상·신념) 처리 시 별도 동의 절차 누락
- 목적 외 사용 가능성
- 제3자 제공 시 암호화 미적용
- 개인정보 파기 기한 미준수
- 접근권한 관리 미흡

무관한 이슈는 **생략**하세요. 관련 PIPA 조항 명시 권장.`;

    case 'summary':
      return `## 📝 요약 모드

상세 리뷰 대신 **고수준 요약**만 제공하세요:
- PR의 의도와 구현 방향 평가
- 핵심 위험 요소 2~3개만 (상세 지적 ✕)
- 대체적인 품질 판단

개별 줄 지적이나 긴 예시는 생략하세요.`;

    default:
      return '';
  }
}

function buildInlineInstruction(): string {
  return `## 📍 Inline 코멘트 출력

일반 리뷰에 더해, **특정 라인에 대한 짧은 코멘트**도 함께 출력하세요.
형식:

\`\`\`inline-comments
<file>path/to/file.ts</file>
<line>42</line>
<body>이 함수는 에러 처리가 빠졌습니다. res.ok 체크 추가 권장.</body>

<file>src/api.ts</file>
<line>15</line>
<body>하드코딩된 URL을 환경변수로 이동하세요.</body>
\`\`\`

- 위험/권장 수준의 이슈만 inline으로 (제안은 일반 리뷰에만)
- 최대 10개까지만
- 각 코멘트는 1~3줄로 간결하게`;
}

function buildApprovalInstruction(): string {
  return `## ✅ 리뷰 상태 판정

리뷰 종료 시 다음 중 하나를 명시하세요:

\`\`\`review-state
APPROVE | REQUEST_CHANGES | COMMENT
\`\`\`

기준:
- \`APPROVE\`: [위험] 0건, [권장] 2건 이하
- \`REQUEST_CHANGES\`: [위험] 1건 이상
- \`COMMENT\`: 그 외 (기본값)`;
}

function buildOutputFormat(config: PRmateConfig): string {
  if (config.mode === 'summary') {
    return `\`\`\`
## 📋 PR 요약
(2~3문장)

## 🎯 핵심 위험 요소
(2~3개만, 각 1줄)

## 📊 전체 평가
(한 문단)
\`\`\``;
  }

  return `\`\`\`
## 📋 PR 요약
(PR이 무엇을 하는지 2~3문장으로 요약)

## ✅ 잘된 점
(잘 작성된 코드나 접근 방식)

## 🔍 리뷰 코멘트
(심각도별로 그룹화하여 작성)

### [위험] 치명적 문제
...

### [권장] 개선 필요
...

### [제안] 개선 가능
...

## 📊 전체 평가
(간단한 종합 의견)
\`\`\``;
}

// ═══════════════════════════════════════════════════════════════
// 결과 타입
// ═══════════════════════════════════════════════════════════════

export interface ReviewResult {
  body: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  costUSD: number;
  costKRW: number;
  inlineComments?: InlineComment[];
  reviewState?: ReviewState;
}

// ═══════════════════════════════════════════════════════════════
// 단일 호출 리뷰 생성
// ═══════════════════════════════════════════════════════════════

export async function generateKoreanReview(
  context: PRContext,
  config: PRmateConfig
): Promise<ReviewResult> {
  const systemPrompt = buildSystemPrompt(config);
  const diffText = formatDiffForReview(context);

  const userMessage = `다음 Pull Request를 리뷰해 주세요.\n\n${diffText}`;

  return callClaude(systemPrompt, userMessage, config);
}

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  config: PRmateConfig
): Promise<ReviewResult> {
  async function callWithRetry(attempt: number): Promise<ReviewResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const modelId = resolveModelId(config.model);
      const response = await anthropic.messages.create(
        {
          model: modelId,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: userMessage }],
        },
        { signal: controller.signal }
      );

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      const usage = response.usage as {
        input_tokens: number;
        output_tokens: number;
        cache_creation_input_tokens?: number;
        cache_read_input_tokens?: number;
      };

      const tokenUsage = {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
        cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      };
      const cost = calculateCost(config.model, tokenUsage);

      const inlineComments = config.inline_comments
        ? parseInlineComments(text)
        : undefined;
      const reviewState = config.auto_approve ? parseReviewState(text) : undefined;
      const cleanBody = stripMetadataBlocks(text);

      return {
        body: cleanBody,
        ...tokenUsage,
        costUSD: cost.usd,
        costKRW: cost.krw,
        inlineComments,
        reviewState,
      };
    } catch (err) {
      if (
        attempt < MAX_ATTEMPTS &&
        err instanceof Error &&
        (err.name === 'AbortError' || err.message.includes('timeout'))
      ) {
        console.log(`[PRmate] 타임아웃 발생, 재시도 ${attempt + 1}/${MAX_ATTEMPTS}...`);
        return callWithRetry(attempt + 1);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  return callWithRetry(1);
}

// ═══════════════════════════════════════════════════════════════
// 대형 PR 청킹 (Week 4-4)
// ═══════════════════════════════════════════════════════════════

export function shouldChunk(context: PRContext, config: PRmateConfig): boolean {
  return context.files.length > CHUNK_SIZE;
}

/**
 * 파일을 청크로 나눠 여러 번 호출 후 결과 병합
 */
export async function generateChunkedReview(
  context: PRContext,
  config: PRmateConfig
): Promise<ReviewResult> {
  const chunks = chunkFiles(context.files, CHUNK_SIZE);
  console.log(`[PRmate] 대형 PR 청킹: ${chunks.length}개 청크로 분할 처리`);

  const results: ReviewResult[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`[PRmate] 청크 ${i + 1}/${chunks.length} 처리 중...`);
    const chunkContext: PRContext = { ...context, files: chunks[i] };
    const result = await generateKoreanReview(chunkContext, config);
    results.push(result);
  }

  // 청크 결과 병합
  return mergeResults(results, chunks.length);
}

function chunkFiles(files: ParsedFile[], size: number): ParsedFile[][] {
  const chunks: ParsedFile[][] = [];
  for (let i = 0; i < files.length; i += size) {
    chunks.push(files.slice(i, i + size));
  }
  return chunks;
}

function mergeResults(results: ReviewResult[], chunkCount: number): ReviewResult {
  const inputTokens = results.reduce((s, r) => s + r.inputTokens, 0);
  const outputTokens = results.reduce((s, r) => s + r.outputTokens, 0);
  const cacheCreationTokens = results.reduce((s, r) => s + r.cacheCreationTokens, 0);
  const cacheReadTokens = results.reduce((s, r) => s + r.cacheReadTokens, 0);
  const costUSD = results.reduce((s, r) => s + r.costUSD, 0);
  const costKRW = Math.round(costUSD * 1350);

  const combinedBody = [
    `> 📦 **대형 PR 청킹 리뷰** — ${chunkCount}개 청크로 분할 처리됨`,
    '',
    ...results.map((r, i) => `## 청크 ${i + 1}\n\n${r.body}`),
  ].join('\n\n');

  return {
    body: combinedBody,
    inputTokens,
    outputTokens,
    cacheCreationTokens,
    cacheReadTokens,
    costUSD,
    costKRW,
    inlineComments: results.flatMap((r) => r.inlineComments ?? []),
    // 청크 중 하나라도 REQUEST_CHANGES면 전체 REQUEST_CHANGES
    reviewState: results.some((r) => r.reviewState === 'REQUEST_CHANGES')
      ? 'REQUEST_CHANGES'
      : results.every((r) => r.reviewState === 'APPROVE')
        ? 'APPROVE'
        : 'COMMENT',
  };
}

// ═══════════════════════════════════════════════════════════════
// Inline 코멘트 파싱 (Week 4-1)
// ═══════════════════════════════════════════════════════════════

function parseInlineComments(text: string): InlineComment[] {
  const comments: InlineComment[] = [];
  const blockMatch = text.match(/```inline-comments\n([\s\S]*?)\n```/);
  if (!blockMatch) return comments;

  const block = blockMatch[1];
  const entryRegex = /<file>([^<]+)<\/file>\s*<line>(\d+)<\/line>\s*<body>([\s\S]*?)<\/body>/g;

  let match;
  while ((match = entryRegex.exec(block)) !== null) {
    const [, path, lineStr, body] = match;
    const line = parseInt(lineStr, 10);
    if (!isNaN(line) && path && body) {
      comments.push({ path: path.trim(), line, body: body.trim() });
    }
  }

  return comments.slice(0, 10); // 안전 상한
}

// ═══════════════════════════════════════════════════════════════
// Review State 파싱 (Week 4-2)
// ═══════════════════════════════════════════════════════════════

function parseReviewState(text: string): ReviewState | undefined {
  const match = text.match(/```review-state\n(APPROVE|REQUEST_CHANGES|COMMENT)\n```/);
  return match ? (match[1] as ReviewState) : undefined;
}

function stripMetadataBlocks(text: string): string {
  return text
    .replace(/```inline-comments\n[\s\S]*?\n```/g, '')
    .replace(/```review-state\n[\s\S]*?\n```/g, '')
    .trim();
}

// ═══════════════════════════════════════════════════════════════
// 리뷰 코멘트 포맷 (Week 2-3 비용 표시 포함)
// ═══════════════════════════════════════════════════════════════

export function formatReviewComment(
  result: ReviewResult,
  config: PRmateConfig
): string {
  const conventionName = getConventionRuleset(config.convention, config.convention_file).name;
  const cacheInfo =
    result.cacheReadTokens > 0
      ? `캐시 적중: ${result.cacheReadTokens.toLocaleString()} 토큰`
      : `캐시 생성: ${result.cacheCreationTokens.toLocaleString()} 토큰`;

  const costDisplay =
    result.costUSD < 0.01
      ? `$${result.costUSD.toFixed(4)} / ₩${result.costKRW}`
      : `$${result.costUSD.toFixed(3)} / ₩${result.costKRW.toLocaleString()}`;

  const modelId = resolveModelId(config.model);
  const modeLabel = config.mode !== 'full' ? ` (${config.mode} 모드)` : '';

  return `${result.body}

---
<details>
<summary>🤖 PRmate 메타 정보${modeLabel}</summary>

- **컨벤션:** ${conventionName}
- **리뷰 레벨:** ${config.review_level}
- **모델:** \`${modelId}\` (티어: \`${config.model}\`)
- **사용 토큰:** 입력 ${result.inputTokens.toLocaleString()} / 출력 ${result.outputTokens.toLocaleString()}
- **${cacheInfo}**
- **💰 비용:** ${costDisplay}

</details>`;
}
