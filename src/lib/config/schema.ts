// ═══════════════════════════════════════════════════════════════
// PRmate 설정 스키마
// ═══════════════════════════════════════════════════════════════

export type Language = 'ko' | 'en';

export type Convention =
  | 'default'
  | 'woowa'   // 우아한테크코스 — 공식 (Google Java Style 기반)
  | 'naver'   // 네이버 Hackday — 공식 (Checkstyle XML 포함)
  | 'toss'    // 토스 Frontend Fundamentals — 공식
  | 'custom'; // 팀 자체 파일

/**
 * v1.0.0에서 제공했던 컨벤션 값들 (추정 기반, 공식 자료 없음).
 * v1.1.0에서 제거됨. `default` 또는 `custom`으로 대체 권장.
 *
 * 마이그레이션 시 "추정 → 실제 공식" 매핑을 의도적으로 하지 않고
 * default로 폴백 + 경고 출력 (사용자에게 정확한 선택을 요구).
 */
const DEPRECATED_CONVENTIONS = [
  'kakao',
  'sk',
  'lg',
  'nhn',
  'coupang',
  'line',
] as const;
type DeprecatedConvention = (typeof DEPRECATED_CONVENTIONS)[number];

export type ReviewLevel = 'strict' | 'standard' | 'relaxed';
export type ModelTier = 'sonnet' | 'haiku' | 'opus';
export type ReviewMode = 'full' | 'summary' | 'security' | 'pipa'; 

// 파일 타입별 규칙
export interface FileRule {
  pattern: string;              // glob 패턴 (e.g., "src/**/*.ts")
  enabled?: boolean;            // 이 패턴만 스킵
  review_level?: ReviewLevel;   // 이 패턴에 대한 review_level 오버라이드
}

// 팀 스타일 가이드
export interface LearningConfig {
  enabled: boolean;
  style_guide?: string;         // .prmate/style-guide.md
  examples_dir?: string;        // .prmate/examples/
}

// 알림 설정
export interface SlackNotification {
  webhook_url_secret?: string;
  on_events?: ('review_completed' | 'review_failed')[];
  mention?: string;
}

export interface DiscordNotification {
  webhook_url_secret?: string;
  on_events?: ('review_completed' | 'review_failed')[];
}

export interface NotificationConfig {
  slack?: SlackNotification;
  discord?: DiscordNotification;
}

// ═══════════════════════════════════════════════════════════════
// 메인 Config 인터페이스
// ═══════════════════════════════════════════════════════════════

export interface PRmateConfig {
  // ── 기본 동작 ──────────────────────────
  enabled: boolean;                   Kill switch
  language: Language;
  convention: Convention;
  review_level: ReviewLevel;

  // ── 모델 & 성능 ────────────────────────
  model: ModelTier;                  
  dry_run: boolean;                  
  mixed_language: boolean;            (코드=영어, 설명=한국어)

  // ── 리뷰 모드 ──────────────────────────
  mode: ReviewMode;                  ,5,6 (full | summary | security | pipa)
  pipa_check: boolean;                (추가 검사)
  inline_comments: boolean;          
  auto_approve: boolean;             

  // ── 파일 필터 ──────────────────────────
  exclude_paths: string[];
  max_files_per_pr: number;
  rules: FileRule[];                 

  // ── 커스터마이즈 ──────────────────────
  convention_file?: string;           커스텀 컨벤션 경로
  custom_prompt?: string;            
  learning?: LearningConfig;         

  // ── 알림 ───────────────────────────────
  notifications?: NotificationConfig; 

  // ── PR 라벨 ────────────────────────────
  skip_labels: string[];             
  priority_labels: string[];         
}

// ═══════════════════════════════════════════════════════════════
// 기본값
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_CONFIG: PRmateConfig = {
  enabled: true,
  language: 'ko',
  convention: 'default',
  review_level: 'standard',

  model: 'sonnet',
  dry_run: false,
  mixed_language: false,

  mode: 'full',
  pipa_check: false,
  inline_comments: false,
  auto_approve: false,

  exclude_paths: [
    '*.md',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '*.lock',
  ],
  max_files_per_pr: 20,
  rules: [],

  skip_labels: ['skip-review', 'no-review'],
  priority_labels: ['priority-review', 'urgent-review'],
};

// ═══════════════════════════════════════════════════════════════
// Validation
// ═══════════════════════════════════════════════════════════════

const VALID_LANGUAGES: Language[] = ['ko', 'en'];
const VALID_CONVENTIONS: Convention[] = [
  'default', 'woowa', 'naver', 'toss', 'custom',
];
const VALID_REVIEW_LEVELS: ReviewLevel[] = ['strict', 'standard', 'relaxed'];
const VALID_MODELS: ModelTier[] = ['sonnet', 'haiku', 'opus'];
const VALID_MODES: ReviewMode[] = ['full', 'summary', 'security', 'pipa'];

export class ConfigValidationError extends Error {
  constructor(public readonly field: string, public readonly received: unknown, public readonly expected: string) {
    super(`[.prmate.yml] '${field}' 설정이 올바르지 않습니다. 받은 값: ${JSON.stringify(received)}, 기대: ${expected}`);
    this.name = 'ConfigValidationError';
  }
}

/**
 * 알려진 설정 키 목록 — unknown 키 경고용
 */
const KNOWN_KEYS = new Set([
  'enabled', 'language', 'convention', 'review_level',
  'model', 'dry_run', 'mixed_language',
  'mode', 'pipa_check', 'inline_comments', 'auto_approve',
  'exclude_paths', 'max_files_per_pr', 'rules',
  'convention_file', 'custom_prompt', 'learning',
  'notifications',
  'skip_labels', 'priority_labels',
]);

export function validateConfig(raw: Record<string, unknown>): PRmateConfig {
  const config = { ...DEFAULT_CONFIG };
  const warnings: string[] = [];

  // Unknown 키 탐지
  for (const key of Object.keys(raw)) {
    if (!KNOWN_KEYS.has(key)) {
      warnings.push(`  ⚠ 알 수 없는 설정 키: '${key}' (오타일 수 있음)`);
    }
  }

  // Kill switch
  if (typeof raw.enabled === 'boolean') config.enabled = raw.enabled;

  // Language
  if (raw.language !== undefined) {
    if (typeof raw.language === 'string' && VALID_LANGUAGES.includes(raw.language as Language)) {
      config.language = raw.language as Language;
    } else {
      warnings.push(`  ⚠ 'language' 값 무효: ${JSON.stringify(raw.language)} → ${config.language} 사용`);
    }
  }

  // Convention
  if (raw.convention !== undefined) {
    if (typeof raw.convention === 'string' && VALID_CONVENTIONS.includes(raw.convention as Convention)) {
      config.convention = raw.convention as Convention;
    } else if (
      typeof raw.convention === 'string' &&
      DEPRECATED_CONVENTIONS.includes(raw.convention as DeprecatedConvention)
    ) {
      // v1.0.0에서 제공했던 "추정 컨벤션" — 공식 자료 없어 v1.1.0에서 제거됨
      warnings.push(
        `  ⚠ 'convention: ${raw.convention}' 는 v1.1.0에서 제거되었습니다.\n` +
          `     (공식 공개 자료가 없어 v1.0.0의 규칙은 추정이었습니다)\n` +
          `     → 현재 'default'로 자동 폴백. 대체 선택지:\n` +
          `       - 'default' (클린 코드 범용)\n` +
          `       - 'custom' + convention_file 로 팀 자체 .md 파일 주입\n` +
          `       - 'woowa' / 'naver' / 'toss' (공식 공개 자료 있음)`
      );
    } else {
      warnings.push(`  ⚠ 'convention' 값 무효: ${JSON.stringify(raw.convention)} → ${config.convention} 사용`);
    }
  }

  // Review level
  if (raw.review_level !== undefined) {
    if (typeof raw.review_level === 'string' && VALID_REVIEW_LEVELS.includes(raw.review_level as ReviewLevel)) {
      config.review_level = raw.review_level as ReviewLevel;
    } else {
      warnings.push(`  ⚠ 'review_level' 값 무효: ${JSON.stringify(raw.review_level)} → ${config.review_level} 사용`);
    }
  }

  // Model
  if (raw.model !== undefined) {
    if (typeof raw.model === 'string' && VALID_MODELS.includes(raw.model as ModelTier)) {
      config.model = raw.model as ModelTier;
    } else {
      warnings.push(`  ⚠ 'model' 값 무효: ${JSON.stringify(raw.model)} → ${config.model} 사용`);
    }
  }

  // Mode
  if (raw.mode !== undefined) {
    if (typeof raw.mode === 'string' && VALID_MODES.includes(raw.mode as ReviewMode)) {
      config.mode = raw.mode as ReviewMode;
    } else {
      warnings.push(`  ⚠ 'mode' 값 무효: ${JSON.stringify(raw.mode)} → ${config.mode} 사용`);
    }
  }

  // Boolean 필드들
  if (typeof raw.dry_run === 'boolean') config.dry_run = raw.dry_run;
  if (typeof raw.mixed_language === 'boolean') config.mixed_language = raw.mixed_language;
  if (typeof raw.pipa_check === 'boolean') config.pipa_check = raw.pipa_check;
  if (typeof raw.inline_comments === 'boolean') config.inline_comments = raw.inline_comments;
  if (typeof raw.auto_approve === 'boolean') config.auto_approve = raw.auto_approve;

  // Exclude paths
  if (Array.isArray(raw.exclude_paths)) {
    config.exclude_paths = raw.exclude_paths.filter((p): p is string => typeof p === 'string');
  }

  // Max files
  if (typeof raw.max_files_per_pr === 'number' && raw.max_files_per_pr > 0) {
    config.max_files_per_pr = Math.min(raw.max_files_per_pr, 50);
  }

  // File rules
  if (Array.isArray(raw.rules)) {
    config.rules = raw.rules
      .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object')
      .map((r) => {
        const rule: FileRule = {
          pattern: typeof r.pattern === 'string' ? r.pattern : '',
        };
        if (typeof r.enabled === 'boolean') rule.enabled = r.enabled;
        if (typeof r.review_level === 'string' && VALID_REVIEW_LEVELS.includes(r.review_level as ReviewLevel)) {
          rule.review_level = r.review_level as ReviewLevel;
        }
        return rule;
      })
      .filter((r) => r.pattern.length > 0);
  }

  // Convention file
  if (typeof raw.convention_file === 'string') config.convention_file = raw.convention_file;

  // Custom prompt
  if (typeof raw.custom_prompt === 'string') config.custom_prompt = raw.custom_prompt;

  // Learning
  if (raw.learning !== null && typeof raw.learning === 'object') {
    const l = raw.learning as Record<string, unknown>;
    config.learning = {
      enabled: typeof l.enabled === 'boolean' ? l.enabled : false,
      style_guide: typeof l.style_guide === 'string' ? l.style_guide : undefined,
      examples_dir: typeof l.examples_dir === 'string' ? l.examples_dir : undefined,
    };
  }

  // Labels
  if (Array.isArray(raw.skip_labels)) {
    config.skip_labels = raw.skip_labels.filter((l): l is string => typeof l === 'string');
  }
  if (Array.isArray(raw.priority_labels)) {
    config.priority_labels = raw.priority_labels.filter((l): l is string => typeof l === 'string');
  }

  // Notifications — 단순 pass-through
  if (raw.notifications !== null && typeof raw.notifications === 'object') {
    config.notifications = raw.notifications as NotificationConfig;
  }

  // 경고 출력
  if (warnings.length > 0) {
    console.warn('[PRmate] 설정 파일 경고:\n' + warnings.join('\n'));
  }

  return config;
}
