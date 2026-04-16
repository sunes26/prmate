import {
  getConventionRuleset,
  formatConventionForPrompt,
  listConventions,
} from '../lib/review/conventions';

describe('getConventionRuleset', () => {
  test('기본(default) 컨벤션 반환', () => {
    const r = getConventionRuleset('default');
    expect(r.name).toBe('기본');
    expect(r.rules.length).toBeGreaterThan(5);
    expect(r.source).toBeUndefined();
  });

  test('우아한테크코스 컨벤션은 Google Java Style 기반 명시', () => {
    const r = getConventionRuleset('woowa');
    expect(r.name).toBe('우아한테크코스');
    expect(r.source).toContain('woowacourse');
    expect(r.rules.some((rule) => rule.includes('Google Java Style'))).toBe(true);
    expect(r.rules.some((rule) => rule.includes('120자'))).toBe(true);
  });

  test('네이버 Hackday 컨벤션은 공식 출처 포함', () => {
    const r = getConventionRuleset('naver');
    expect(r.name).toBe('네이버 Hackday');
    expect(r.source).toBe('https://naver.github.io/hackday-conventions-java/');
    expect(r.rules.some((rule) => rule.includes('K&R'))).toBe(true);
    expect(r.rules.some((rule) => rule.includes('UTF-8'))).toBe(true);
  });

  test('토스 Frontend Fundamentals는 4대 원칙 포함', () => {
    const r = getConventionRuleset('toss');
    expect(r.name).toBe('토스 Frontend Fundamentals');
    expect(r.source).toContain('frontend-fundamentals');
    expect(r.rules.some((rule) => rule.startsWith('[가독성]'))).toBe(true);
    expect(r.rules.some((rule) => rule.startsWith('[예측가능성]'))).toBe(true);
    expect(r.rules.some((rule) => rule.startsWith('[응집도]'))).toBe(true);
    expect(r.rules.some((rule) => rule.startsWith('[결합도]'))).toBe(true);
  });

  test('custom 지정 시 파일 없으면 기본 컨벤션으로 폴백', () => {
    const r = getConventionRuleset('custom', '/nonexistent/file.md');
    expect(r.name).toBe('기본');
  });

  test('custom 지정했는데 custom_file 누락 시 기본 컨벤션으로 폴백', () => {
    const r = getConventionRuleset('custom');
    expect(r.name).toBe('기본');
  });
});

describe('formatConventionForPrompt', () => {
  test('일반 컨벤션은 번호 매긴 리스트로 포맷', () => {
    const r = getConventionRuleset('naver');
    const formatted = formatConventionForPrompt(r);
    expect(formatted).toContain('### 네이버 Hackday 코딩 컨벤션');
    expect(formatted).toMatch(/1\.[\s\S]*2\.[\s\S]*3\./);
  });

  test('공식 출처가 있으면 프롬프트에 URL 노출', () => {
    const r = getConventionRuleset('toss');
    const formatted = formatConventionForPrompt(r);
    expect(formatted).toContain('공식 출처');
    expect(formatted).toContain('frontend-fundamentals');
  });

  test('default 컨벤션은 출처 라인 없음', () => {
    const r = getConventionRuleset('default');
    const formatted = formatConventionForPrompt(r);
    expect(formatted).not.toContain('공식 출처');
  });
});

describe('listConventions', () => {
  test('5종 컨벤션 반환 (default, woowa, naver, toss, custom)', () => {
    const list = listConventions();
    expect(list).toHaveLength(5);
    expect(list).toContain('default');
    expect(list).toContain('woowa');
    expect(list).toContain('naver');
    expect(list).toContain('toss');
    expect(list).toContain('custom');
  });

  test('v1.0.0에서 있던 추정 컨벤션들은 제거됨', () => {
    const list = listConventions();
    expect(list).not.toContain('kakao');
    expect(list).not.toContain('sk');
    expect(list).not.toContain('lg');
    expect(list).not.toContain('nhn');
    expect(list).not.toContain('coupang');
    expect(list).not.toContain('line');
  });
});
