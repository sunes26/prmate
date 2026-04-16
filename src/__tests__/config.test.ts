import { parseConfig } from '../lib/config/loader';
import { DEFAULT_CONFIG } from '../lib/config/schema';

describe('parseConfig', () => {
  test('유효한 YAML을 파싱한다', () => {
    const yaml = `
language: ko
convention: naver
review_level: strict
pipa_check: true
`;
    const config = parseConfig(yaml);
    expect(config.language).toBe('ko');
    expect(config.convention).toBe('naver');
    expect(config.review_level).toBe('strict');
    expect(config.pipa_check).toBe(true);
  });

  test('잘못된 convention 값은 기본값으로 폴백한다', () => {
    const yaml = 'convention: invalid_convention';
    const config = parseConfig(yaml);
    expect(config.convention).toBe(DEFAULT_CONFIG.convention);
  });

  test('잘못된 YAML 형식은 기본값으로 폴백한다', () => {
    const yaml = '{ invalid yaml content: [';
    const config = parseConfig(yaml);
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  test('빈 YAML은 기본값을 반환한다', () => {
    const config = parseConfig('');
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  test('exclude_paths를 파싱한다', () => {
    const yaml = `
exclude_paths:
  - "*.md"
  - "docs/**"
`;
    const config = parseConfig(yaml);
    expect(config.exclude_paths).toContain('*.md');
    expect(config.exclude_paths).toContain('docs/**');
  });

  test('max_files_per_pr 상한선을 50으로 제한한다', () => {
    const yaml = 'max_files_per_pr: 999';
    const config = parseConfig(yaml);
    expect(config.max_files_per_pr).toBe(50);
  });
});
