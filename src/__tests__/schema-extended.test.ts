import { validateConfig, DEFAULT_CONFIG } from '../lib/config/schema';

describe('PRmateConfig 확장 스키마 (Week 2)', () => {
  test('Kill switch: enabled:false 설정', () => {
    const config = validateConfig({ enabled: false });
    expect(config.enabled).toBe(false);
  });

  test('model: haiku 선택', () => {
    const config = validateConfig({ model: 'haiku' });
    expect(config.model).toBe('haiku');
  });

  test('model: 무효한 값은 기본 sonnet으로 폴백', () => {
    const config = validateConfig({ model: 'gpt-4' });
    expect(config.model).toBe('sonnet');
  });

  test('mode: summary 선택', () => {
    const config = validateConfig({ mode: 'summary' });
    expect(config.mode).toBe('summary');
  });

  test('mode: security 선택', () => {
    const config = validateConfig({ mode: 'security' });
    expect(config.mode).toBe('security');
  });

  test('mode: pipa 선택', () => {
    const config = validateConfig({ mode: 'pipa' });
    expect(config.mode).toBe('pipa');
  });

  test('dry_run: true 설정', () => {
    const config = validateConfig({ dry_run: true });
    expect(config.dry_run).toBe(true);
  });

  test('mixed_language: true 설정', () => {
    const config = validateConfig({ mixed_language: true });
    expect(config.mixed_language).toBe(true);
  });

  test('custom_prompt 설정', () => {
    const config = validateConfig({
      custom_prompt: '우리 팀은 함수형을 중시합니다',
    });
    expect(config.custom_prompt).toBe('우리 팀은 함수형을 중시합니다');
  });

  test('rules 배열 파싱', () => {
    const config = validateConfig({
      rules: [
        { pattern: 'src/**/*.ts', review_level: 'strict' },
        { pattern: '*.test.ts', enabled: false },
      ],
    });
    expect(config.rules).toHaveLength(2);
    expect(config.rules[0].review_level).toBe('strict');
    expect(config.rules[1].enabled).toBe(false);
  });

  test('skip_labels 설정', () => {
    const config = validateConfig({ skip_labels: ['wip', 'draft'] });
    expect(config.skip_labels).toContain('wip');
    expect(config.skip_labels).toContain('draft');
  });

  test('inline_comments, auto_approve 설정', () => {
    const config = validateConfig({
      inline_comments: true,
      auto_approve: true,
    });
    expect(config.inline_comments).toBe(true);
    expect(config.auto_approve).toBe(true);
  });

  test('learning 설정 파싱', () => {
    const config = validateConfig({
      learning: {
        enabled: true,
        style_guide: '.prmate/style.md',
        examples_dir: '.prmate/examples/',
      },
    });
    expect(config.learning?.enabled).toBe(true);
    expect(config.learning?.style_guide).toBe('.prmate/style.md');
    expect(config.learning?.examples_dir).toBe('.prmate/examples/');
  });

  test('convention_file 설정', () => {
    const config = validateConfig({
      convention: 'custom',
      convention_file: '.prmate/our-style.md',
    });
    expect(config.convention).toBe('custom');
    expect(config.convention_file).toBe('.prmate/our-style.md');
  });

  test('새 컨벤션 (SK, LG, NHN, 쿠팡, LINE, 토스) 허용', () => {
    for (const c of ['sk', 'lg', 'nhn', 'coupang', 'line', 'toss']) {
      const config = validateConfig({ convention: c });
      expect(config.convention).toBe(c);
    }
  });

  test('기본값: enabled=true, model=sonnet, mode=full', () => {
    const config = validateConfig({});
    expect(config.enabled).toBe(true);
    expect(config.model).toBe('sonnet');
    expect(config.mode).toBe('full');
    expect(config.dry_run).toBe(false);
    expect(config.mixed_language).toBe(false);
  });
});
