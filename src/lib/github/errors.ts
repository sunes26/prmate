/**
 * 에러 분류 및 사용자 친화적 한국어 메시지 변환
 */

export type ErrorType =
  | 'credit_exhausted'   // Anthropic 크레딧 부족
  | 'model_not_found'    // 존재하지 않는 모델 ID
  | 'rate_limit'         // 초당 요청 한도 초과
  | 'timeout'            // 타임아웃
  | 'auth_failure'       // API 키 인증 실패
  | 'invalid_request'    // 잘못된 요청 (프롬프트 형식 등)
  | 'network'            // 네트워크 오류
  | 'github_api'         // GitHub API 오류
  | 'permission_denied'  // 권한 없음 (PR 코멘트 작성 불가 등)
  | 'config_invalid'     // 설정 파일 문제
  | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;          // 원본 에러 메시지 (로그용)
  statusCode?: number;
  remediation?: string;     // 수정 방법
}

/**
 * 에러를 분류합니다.
 */
export function classifyError(err: unknown): ErrorInfo {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  // ── Anthropic 400: 크레딧 부족 ──
  if (lower.includes('credit balance is too low') || lower.includes('insufficient credit')) {
    return {
      type: 'credit_exhausted',
      message,
      statusCode: 400,
      remediation: 'Anthropic Console (https://console.anthropic.com/settings/billing)에서 크레딧을 충전하세요.',
    };
  }

  // ── Anthropic 404: 모델 없음 ──
  if ((lower.includes('not_found') || lower.includes('404')) && lower.includes('model')) {
    return {
      type: 'model_not_found',
      message,
      statusCode: 404,
      remediation: '`.prmate.yml`의 `model` 값 또는 `CLAUDE_MODEL` 환경변수를 확인하세요. 유효한 값: `sonnet`, `haiku`, `opus`.',
    };
  }

  // ── Anthropic 429: Rate limit ──
  if (lower.includes('rate_limit') || lower.includes('rate limit') || lower.includes('429')) {
    return {
      type: 'rate_limit',
      message,
      statusCode: 429,
      remediation: '잠시 후 자동 재시도되거나, 동시 PR 수를 줄여주세요. Anthropic 플랜 업그레이드도 고려해볼 수 있습니다.',
    };
  }

  // ── 타임아웃 / Abort ──
  if (
    lower.includes('request was aborted') ||
    lower.includes('timeout') ||
    lower.includes('aborterror') ||
    (err instanceof Error && err.name === 'AbortError')
  ) {
    return {
      type: 'timeout',
      message,
      remediation: 'PR이 너무 크거나 네트워크가 느립니다. `.prmate.yml`에서 `max_files_per_pr`를 줄이거나 `timeout_ms`를 늘려보세요.',
    };
  }

  // ── 401: 인증 실패 ──
  if (lower.includes('401') || lower.includes('unauthorized') || lower.includes('invalid api key')) {
    return {
      type: 'auth_failure',
      message,
      statusCode: 401,
      remediation: 'ANTHROPIC_API_KEY 시크릿이 올바르게 등록되었는지 확인하세요. (https://console.anthropic.com에서 새 키 발급)',
    };
  }

  // ── 403: 권한 없음 ──
  if (lower.includes('403') || lower.includes('permission') || lower.includes('forbidden')) {
    return {
      type: 'permission_denied',
      message,
      statusCode: 403,
      remediation: '워크플로우에 `permissions: pull-requests: write` 설정이 있는지 확인하세요.',
    };
  }

  // ── Anthropic 400: Invalid request ──
  if (lower.includes('invalid_request') || lower.includes('invalid request')) {
    return {
      type: 'invalid_request',
      message,
      statusCode: 400,
      remediation: '프롬프트 또는 설정에 문제가 있습니다. `custom_prompt` 길이가 과도하지 않은지 확인하세요.',
    };
  }

  // ── GitHub API 에러 ──
  if (lower.includes('octokit') || lower.includes('github api')) {
    return {
      type: 'github_api',
      message,
      remediation: 'GitHub API 호출에 실패했습니다. 잠시 후 다시 시도하세요.',
    };
  }

  // ── 네트워크 에러 ──
  if (
    lower.includes('fetch') ||
    lower.includes('econnrefused') ||
    lower.includes('enotfound') ||
    lower.includes('network')
  ) {
    return {
      type: 'network',
      message,
      remediation: '네트워크 연결 문제. GitHub Actions runner의 외부 접근이 차단되지 않았는지 확인하세요.',
    };
  }

  // ── 설정 파일 오류 ──
  if (lower.includes('.prmate.yml') || lower.includes('yaml')) {
    return {
      type: 'config_invalid',
      message,
      remediation: '`.prmate.yml` 파일 문법을 확인하세요.',
    };
  }

  // ── 기타 ──
  return {
    type: 'unknown',
    message,
    remediation: '문제가 지속되면 이슈를 등록해 주세요 (https://github.com/sunes26/prmate/issues).',
  };
}

/**
 * 에러 타입에 따른 사용자 친화적 한국어 메시지를 생성합니다.
 */
export function formatErrorMessage(info: ErrorInfo): string {
  const titles: Record<ErrorType, string> = {
    credit_exhausted: '💳 Anthropic API 크레딧 부족',
    model_not_found: '❓ 존재하지 않는 Claude 모델',
    rate_limit: '⏱️ Rate Limit 초과',
    timeout: '⌛ 요청 타임아웃',
    auth_failure: '🔑 API 키 인증 실패',
    invalid_request: '⚠️ 잘못된 요청',
    network: '🌐 네트워크 오류',
    github_api: '🐙 GitHub API 오류',
    permission_denied: '🚫 권한 부족',
    config_invalid: '📝 설정 파일 오류',
    unknown: '❗ 알 수 없는 오류',
  };

  const title = titles[info.type];
  const statusBadge = info.statusCode ? ` (HTTP ${info.statusCode})` : '';

  return `## ⚠️ PRmate 리뷰 실패 — ${title}${statusBadge}

${info.remediation ?? '일시적 문제일 수 있습니다. 잠시 후 다시 시도해주세요.'}

---

<details>
<summary>📋 기술 정보 (디버깅용)</summary>

- **에러 타입:** \`${info.type}\`
${info.statusCode ? `- **HTTP 상태:** \`${info.statusCode}\`\n` : ''}- **메시지:** \`${info.message.substring(0, 200)}${info.message.length > 200 ? '...' : ''}\`

문제가 지속되면 [이슈를 등록](https://github.com/sunes26/prmate/issues)해 주세요.

</details>`;
}
