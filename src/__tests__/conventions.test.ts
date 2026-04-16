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
  });

  test('우아한형제들 컨벤션 반환', () => {
    const r = getConventionRuleset('woowa');
    expect(r.name).toBe('우아한형제들');
    expect(r.rules.some((rule) => rule.includes('Lombok'))).toBe(true);
  });

  test('카카오 컨벤션 반환', () => {
    const r = getConventionRuleset('kakao');
    expect(r.name).toBe('카카오');
    expect(r.rules.some((rule) => rule.includes('120자'))).toBe(true);
  });

  test('네이버 컨벤션 반환', () => {
    const r = getConventionRuleset('naver');
    expect(r.name).toBe('네이버');
    expect(r.rules.some((rule) => rule.includes('@Override'))).toBe(true);
  });

  test('SK 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('sk');
    expect(r.name).toBe('SK');
    expect(r.rules.length).toBeGreaterThan(5);
  });

  test('LG 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('lg');
    expect(r.name).toBe('LG');
    expect(r.rules.some((rule) => rule.includes('equals/hashCode'))).toBe(true);
  });

  test('NHN 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('nhn');
    expect(r.name).toBe('NHN');
    expect(r.rules.some((rule) => rule.includes('SonarQube'))).toBe(true);
  });

  test('쿠팡 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('coupang');
    expect(r.name).toBe('쿠팡');
    expect(r.rules.some((rule) => rule.includes('Resilience4j'))).toBe(true);
  });

  test('LINE 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('line');
    expect(r.name).toBe('LINE');
    expect(r.rules.some((rule) => rule.includes('gRPC'))).toBe(true);
  });

  test('토스 컨벤션 반환 (Week 3 신규)', () => {
    const r = getConventionRuleset('toss');
    expect(r.name).toBe('토스');
    expect(r.rules.some((rule) => rule.includes('TypeScript'))).toBe(true);
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
    const r = getConventionRuleset('kakao');
    const formatted = formatConventionForPrompt(r);
    expect(formatted).toContain('### 카카오 코딩 컨벤션');
    expect(formatted).toMatch(/1\.[\s\S]*2\.[\s\S]*3\./);
  });
});

describe('listConventions', () => {
  test('11개 컨벤션 목록 반환 (10 프리셋 + custom)', () => {
    const list = listConventions();
    expect(list).toHaveLength(11);
    expect(list).toContain('default');
    expect(list).toContain('woowa');
    expect(list).toContain('kakao');
    expect(list).toContain('naver');
    expect(list).toContain('sk');
    expect(list).toContain('lg');
    expect(list).toContain('nhn');
    expect(list).toContain('coupang');
    expect(list).toContain('line');
    expect(list).toContain('toss');
    expect(list).toContain('custom');
  });
});
