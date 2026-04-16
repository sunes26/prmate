import { classifyError, formatErrorMessage } from '../lib/github/errors';

describe('classifyError', () => {
  test('크레딧 부족 에러 감지', () => {
    const info = classifyError(
      new Error(
        '400 {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low"}}'
      )
    );
    expect(info.type).toBe('credit_exhausted');
    expect(info.remediation).toContain('console.anthropic.com');
  });

  test('모델 없음 에러 감지', () => {
    const info = classifyError(
      new Error(
        '404 {"type":"error","error":{"type":"not_found_error","message":"model: claude-xxx"}}'
      )
    );
    expect(info.type).toBe('model_not_found');
    expect(info.remediation).toContain('sonnet');
  });

  test('Rate limit 감지', () => {
    const info = classifyError(new Error('429 rate_limit_error'));
    expect(info.type).toBe('rate_limit');
  });

  test('타임아웃 감지', () => {
    const err = new Error('Request was aborted.');
    err.name = 'AbortError';
    const info = classifyError(err);
    expect(info.type).toBe('timeout');
  });

  test('401 인증 실패 감지', () => {
    const info = classifyError(new Error('401 Unauthorized: Invalid API Key'));
    expect(info.type).toBe('auth_failure');
  });

  test('403 권한 감지', () => {
    const info = classifyError(new Error('403 Forbidden'));
    expect(info.type).toBe('permission_denied');
  });

  test('네트워크 에러 감지', () => {
    const info = classifyError(new Error('fetch failed: ENOTFOUND'));
    expect(info.type).toBe('network');
  });

  test('알 수 없는 에러는 unknown으로', () => {
    const info = classifyError(new Error('Something weird happened'));
    expect(info.type).toBe('unknown');
  });
});

describe('formatErrorMessage', () => {
  test('에러 타입별로 적절한 한국어 제목 생성', () => {
    const info = classifyError(
      new Error('Your credit balance is too low')
    );
    const formatted = formatErrorMessage(info);
    expect(formatted).toContain('💳 Anthropic API 크레딧 부족');
    expect(formatted).toContain('충전');
  });

  test('디버깅 정보 섹션 포함', () => {
    const info = classifyError(new Error('429 rate limit'));
    const formatted = formatErrorMessage(info);
    expect(formatted).toContain('기술 정보');
    expect(formatted).toContain('rate_limit');
  });

  test('이슈 링크 포함', () => {
    const info = classifyError(new Error('unknown error'));
    const formatted = formatErrorMessage(info);
    expect(formatted).toContain('github.com/sunes26/prmate/issues');
  });
});
