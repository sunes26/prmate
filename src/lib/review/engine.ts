import { anthropic, MODEL, MAX_TOKENS, TIMEOUT_MS } from '../claude';
import { KorReviewConfig } from '../config/schema';
import { PRContext, formatDiffForReview } from '../github/diff';
import { getConventionRuleset, formatConventionForPrompt } from './conventions';

function buildSystemPrompt(config: KorReviewConfig): string {
  const convention = getConventionRuleset(config.convention);
  const conventionText = formatConventionForPrompt(convention);
  const strictness =
    config.review_level === 'strict'
      ? '엄격한 기준으로 모든 문제를 상세히 지적하세요.'
      : config.review_level === 'relaxed'
        ? '주요 문제에만 집중하고 사소한 스타일 이슈는 생략하세요.'
        : '표준적인 기준으로 중요한 문제를 중심으로 리뷰하세요.';

  return `당신은 경험 많은 한국 시니어 개발자입니다. GitHub PR 코드를 한국어로 리뷰합니다.

## 리뷰 원칙

1. **자연스러운 한국어** — 번역체나 어색한 표현을 절대 사용하지 않습니다.
2. **우선순위** — 버그/보안 → 성능 → 가독성/유지보수 순으로 다룹니다.
3. **심각도 분류**:
   - \`[위험]\` — 즉시 수정해야 하는 버그, 보안 취약점
   - \`[권장]\` — 수정을 강력히 권장하는 문제
   - \`[제안]\` — 개선 가능한 부분 (선택적)
4. **수정 예시 필수** — 문제를 지적할 때는 반드시 수정된 코드 예시를 포함합니다.
5. **긍정 피드백** — 잘 작성된 코드는 반드시 언급합니다.
6. **리뷰 수준** — ${strictness}

## 적용 컨벤션

${conventionText}

## 출력 형식

\`\`\`
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

export interface ReviewResult {
  body: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
}

export async function generateKoreanReview(
  context: PRContext,
  config: KorReviewConfig
): Promise<ReviewResult> {
  const systemPrompt = buildSystemPrompt(config);
  const diffText = formatDiffForReview(context);

  const userMessage = `다음 Pull Request를 한국어로 리뷰해 주세요.

${diffText}`;

  // 타임아웃 + 재시도 래퍼
  async function callWithRetry(attempt: number): Promise<ReviewResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await anthropic.messages.create(
        {
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: 'text',
              text: systemPrompt,
              // Prompt Caching: 시스템 프롬프트(컨벤션 룰셋 포함) 캐싱
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

      return {
        body: text,
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
        cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      };
    } catch (err) {
      if (attempt < 2 && (err instanceof Error && (err.name === 'AbortError' || err.message.includes('timeout')))) {
        console.log(`[KorReview] 타임아웃 발생, 재시도 ${attempt + 1}/2...`);
        return callWithRetry(attempt + 1);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  return callWithRetry(1);
}

export function formatReviewComment(result: ReviewResult, config: KorReviewConfig): string {
  const conventionName = getConventionRuleset(config.convention).name;
  const cacheInfo =
    result.cacheReadTokens > 0
      ? `캐시 적중: ${result.cacheReadTokens.toLocaleString()} 토큰`
      : `캐시 생성: ${result.cacheCreationTokens.toLocaleString()} 토큰`;

  return `${result.body}

---
<details>
<summary>🤖 KorReview 메타 정보</summary>

- **컨벤션:** ${conventionName}
- **리뷰 레벨:** ${config.review_level}
- **사용 토큰:** 입력 ${result.inputTokens.toLocaleString()} / 출력 ${result.outputTokens.toLocaleString()}
- **${cacheInfo}**
- **모델:** ${MODEL}

</details>`;
}
