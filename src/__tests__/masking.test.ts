import { maskSecrets, hasSensitiveContent } from '../lib/masking';

describe('maskSecrets', () => {
  test('AWS 액세스 키를 마스킹한다', () => {
    const input = 'key = AKIAIOSFODNN7EXAMPLE';
    const result = maskSecrets(input);
    expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result).toContain('[REDACTED]');
  });

  test('GitHub 토큰을 마스킹한다', () => {
    const input = 'token: ghp_abcdefghijklmnopqrstuvwxyz123456789';
    const result = maskSecrets(input);
    expect(result).not.toContain('ghp_abcdefghijklmnopqrstuvwxyz123456789');
    expect(result).toContain('[REDACTED]');
  });

  test('Bearer 토큰을 마스킹한다', () => {
    const input = 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9xyz';
    const result = maskSecrets(input);
    expect(result).not.toContain('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9xyz');
    expect(result).toContain('[REDACTED]');
  });

  test('API_KEY 패턴을 마스킹한다', () => {
    const input = 'const apiKey = "sk-ant-api03-abcdef1234567890abcdef"';
    const result = maskSecrets(input);
    expect(result).not.toContain('sk-ant-api03-abcdef1234567890abcdef');
  });

  test('민감하지 않은 코드는 그대로 유지한다', () => {
    const input = 'const greeting = "Hello, World!";\nconsole.log(greeting);';
    const result = maskSecrets(input);
    expect(result).toBe(input);
  });

  test('여러 패턴이 동시에 존재하면 모두 마스킹한다', () => {
    const input = [
      'AWS_KEY=AKIAIOSFODNN7EXAMPLE',
      'GITHUB_TOKEN=ghp_abcdefghijklmnopqrstuvwxyz12345678',
    ].join('\n');
    const result = maskSecrets(input);
    expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result).not.toContain('ghp_abcdefghijklmnopqrstuvwxyz12345678');
  });
});

describe('hasSensitiveContent', () => {
  test('AWS 키가 있으면 true를 반환한다', () => {
    expect(hasSensitiveContent('AKIAIOSFODNN7EXAMPLE')).toBe(true);
  });

  test('민감 정보가 없으면 false를 반환한다', () => {
    expect(hasSensitiveContent('const x = 42;')).toBe(false);
  });
});
