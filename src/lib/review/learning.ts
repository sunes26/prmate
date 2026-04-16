/**
 * 팀 스타일 가이드 기반 "유사 학습 모드" (Week 4-9)
 *
 * GitHub Actions 환경에서는 영속 스토리지가 없으므로,
 * 팀이 직접 관리하는 파일 기반 가이드를 프롬프트에 주입합니다.
 *
 * 진정한 자동 학습 모드는 Phase 4 (GitHub App + 벡터 DB)에서 구현됩니다.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';
import { LearningConfig } from '../config/schema';

export interface TeamLearningData {
  styleGuide: string | null;
  examples: Array<{
    filename: string;
    content: string;
  }>;
}

const MAX_STYLE_GUIDE_CHARS = 4000;
const MAX_EXAMPLES = 5;
const MAX_EXAMPLE_CHARS = 1500;

/**
 * 팀 학습 데이터를 파일 시스템에서 로드합니다.
 * 파일 누락/읽기 실패 시 조용히 빈 데이터 반환 (리뷰는 계속 진행).
 */
export function loadTeamLearning(config: LearningConfig): TeamLearningData {
  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const data: TeamLearningData = {
    styleGuide: null,
    examples: [],
  };

  // 1. Style Guide 로드
  if (config.style_guide) {
    const guidePath = resolve(workspace, config.style_guide);
    try {
      if (existsSync(guidePath)) {
        const content = readFileSync(guidePath, 'utf-8');
        data.styleGuide = content.slice(0, MAX_STYLE_GUIDE_CHARS);
      } else {
        console.warn(`[PRmate] 학습 모드: style_guide 파일 없음 (${guidePath})`);
      }
    } catch (err) {
      console.warn(`[PRmate] 학습 모드: style_guide 읽기 실패 - ${err instanceof Error ? err.message : err}`);
    }
  }

  // 2. Examples 디렉토리 로드
  if (config.examples_dir) {
    const examplesPath = resolve(workspace, config.examples_dir);
    try {
      if (existsSync(examplesPath) && statSync(examplesPath).isDirectory()) {
        const files = readdirSync(examplesPath)
          .filter((name) => {
            const ext = extname(name);
            return ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.kt', '.md'].includes(ext);
          })
          .slice(0, MAX_EXAMPLES);

        for (const filename of files) {
          try {
            const full = join(examplesPath, filename);
            const content = readFileSync(full, 'utf-8').slice(0, MAX_EXAMPLE_CHARS);
            data.examples.push({ filename, content });
          } catch {
            // 개별 파일 실패 무시
          }
        }
      } else {
        console.warn(`[PRmate] 학습 모드: examples_dir 디렉토리 없음 (${examplesPath})`);
      }
    } catch (err) {
      console.warn(`[PRmate] 학습 모드: examples_dir 읽기 실패 - ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`[PRmate] 학습 모드 로드 완료: style_guide=${data.styleGuide ? '있음' : '없음'}, examples=${data.examples.length}개`);
  return data;
}

/**
 * 학습 데이터를 프롬프트 섹션으로 포맷합니다.
 */
export function formatLearningForPrompt(data: TeamLearningData): string {
  if (!data.styleGuide && data.examples.length === 0) {
    return '';
  }

  const sections: string[] = ['## 🎓 팀 스타일 가이드 (팀 직접 관리)'];

  if (data.styleGuide) {
    sections.push('### 공통 원칙\n\n' + data.styleGuide);
  }

  if (data.examples.length > 0) {
    sections.push('### 참고 예시 코드');
    for (const ex of data.examples) {
      sections.push(`**${ex.filename}:**\n\n\`\`\`\n${ex.content}\n\`\`\``);
    }
  }

  sections.push(
    '\n**위 가이드와 예시를 참고하여 이 팀의 스타일에 맞는 리뷰를 제공하세요.**'
  );

  return sections.join('\n\n');
}
