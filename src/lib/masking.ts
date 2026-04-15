const REDACTED = '[REDACTED]';

interface MaskingPattern {
  name: string;
  pattern: RegExp;
}

const PATTERNS: MaskingPattern[] = [
  // AWS 액세스 키
  { name: 'aws-access-key', pattern: /AKIA[0-9A-Z]{16}/g },
  // AWS 시크릿 키 (40자 Base64)
  { name: 'aws-secret-key', pattern: /(?<=[Ss]ecret[_\s]?[Aa]ccess[_\s]?[Kk]ey['":\s=]+)[A-Za-z0-9/+=]{40}/g },
  // GitHub 토큰
  { name: 'github-token', pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g },
  // 일반 API 키 패턴 (key=, api_key=, apikey= 뒤에 나오는 값)
  {
    name: 'generic-api-key',
    pattern: /(?<=[Aa][Pp][Ii][_\-]?[Kk][Ee][Yy]['"\s:=]+)[A-Za-z0-9_\-]{20,}/g,
  },
  // 비밀번호 패턴
  {
    name: 'password',
    pattern: /(?<=[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]['"\s:=]+)[^\s'"]{8,}/g,
  },
  // 시크릿 패턴
  {
    name: 'secret',
    pattern: /(?<=[Ss][Ee][Cc][Rr][Ee][Tt]['"\s:=]+)[A-Za-z0-9_\-]{16,}/g,
  },
  // 토큰 패턴
  {
    name: 'token',
    pattern: /(?<=[Tt][Oo][Kk][Ee][Nn]['"\s:=]+)[A-Za-z0-9_\-\.]{20,}/g,
  },
  // .env 파일 내 KEY=VALUE (긴 값)
  {
    name: 'env-value',
    pattern: /(?<=[A-Z_]{4,}=['"]?)[A-Za-z0-9+/=_\-]{30,}(?=['"]?$)/gm,
  },
  // Bearer 토큰
  {
    name: 'bearer-token',
    pattern: /(?<=Bearer\s+)[A-Za-z0-9_\-\.]{20,}/g,
  },
];

export function maskSecrets(text: string): string {
  let masked = text;
  for (const { pattern } of PATTERNS) {
    // 패턴 재사용을 위해 lastIndex 초기화
    pattern.lastIndex = 0;
    masked = masked.replace(pattern, REDACTED);
  }
  return masked;
}

export function hasSensitiveContent(text: string): boolean {
  return PATTERNS.some(({ pattern }) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}
