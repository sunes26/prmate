export type Language = 'ko' | 'en';
export type Convention = 'woowa' | 'kakao' | 'naver' | 'default' | 'custom';
export type ReviewLevel = 'strict' | 'standard' | 'relaxed';

export interface KorReviewConfig {
  language: Language;
  convention: Convention;
  review_level: ReviewLevel;
  pipa_check: boolean;
  exclude_paths: string[];
  max_files_per_pr: number;
}

export const DEFAULT_CONFIG: KorReviewConfig = {
  language: 'ko',
  convention: 'default',
  review_level: 'standard',
  pipa_check: false,
  exclude_paths: ['*.md', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '*.lock'],
  max_files_per_pr: 20,
};

const VALID_LANGUAGES: Language[] = ['ko', 'en'];
const VALID_CONVENTIONS: Convention[] = ['woowa', 'kakao', 'naver', 'default', 'custom'];
const VALID_REVIEW_LEVELS: ReviewLevel[] = ['strict', 'standard', 'relaxed'];

export function validateConfig(raw: Record<string, unknown>): KorReviewConfig {
  const config = { ...DEFAULT_CONFIG };

  if (raw.language && VALID_LANGUAGES.includes(raw.language as Language)) {
    config.language = raw.language as Language;
  }
  if (raw.convention && VALID_CONVENTIONS.includes(raw.convention as Convention)) {
    config.convention = raw.convention as Convention;
  }
  if (raw.review_level && VALID_REVIEW_LEVELS.includes(raw.review_level as ReviewLevel)) {
    config.review_level = raw.review_level as ReviewLevel;
  }
  if (typeof raw.pipa_check === 'boolean') {
    config.pipa_check = raw.pipa_check;
  }
  if (Array.isArray(raw.exclude_paths)) {
    config.exclude_paths = raw.exclude_paths.filter((p): p is string => typeof p === 'string');
  }
  if (typeof raw.max_files_per_pr === 'number' && raw.max_files_per_pr > 0) {
    config.max_files_per_pr = Math.min(raw.max_files_per_pr, 50);
  }

  return config;
}
