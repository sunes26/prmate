import * as yaml from 'js-yaml';
import { DEFAULT_CONFIG, KorReviewConfig, validateConfig } from './schema';

export function parseConfig(yamlContent: string): KorReviewConfig {
  try {
    const raw = yaml.load(yamlContent);
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
      return DEFAULT_CONFIG;
    }
    return validateConfig(raw as Record<string, unknown>);
  } catch {
    // YAML 파싱 실패 시 기본값으로 폴백
    return DEFAULT_CONFIG;
  }
}
