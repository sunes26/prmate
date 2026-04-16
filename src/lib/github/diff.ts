import { Octokit } from '@octokit/rest';
import { maskSecrets } from '../masking';
import { PRmateConfig, FileRule, ReviewLevel } from '../config/schema';
import { minimatch } from 'minimatch';

export interface ParsedFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  patch?: string;
  // Week 2-5: 파일별 오버라이드
  overrideLevel?: ReviewLevel;
}

export interface PRContext {
  title: string;
  body: string;
  author: string;
  labels: string[];   // Week 2-6
  files: ParsedFile[];
  baseBranch: string;
  headBranch: string;
}

// 리뷰 제외 대상 파일 패턴 (하드코딩)
const ALWAYS_EXCLUDE: string[] = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '*.lock',
  '*.min.js',
  '*.min.css',
  'dist/**',
  'build/**',
  '.next/**',
];

function isExcluded(filename: string, userExcludes: string[]): boolean {
  const allPatterns = [...ALWAYS_EXCLUDE, ...userExcludes];
  return allPatterns.some((pattern) =>
    minimatch(filename, pattern, { matchBase: true })
  );
}

/**
 * Week 2-5: 파일별 규칙 평가
 * rules 배열에서 매칭되는 패턴 찾아 disabled/review_level 오버라이드 반환
 */
function evaluateFileRules(
  filename: string,
  rules: FileRule[]
): { skip: boolean; overrideLevel?: ReviewLevel } {
  for (const rule of rules) {
    if (minimatch(filename, rule.pattern, { matchBase: true })) {
      if (rule.enabled === false) {
        return { skip: true };
      }
      if (rule.review_level) {
        return { skip: false, overrideLevel: rule.review_level };
      }
    }
  }
  return { skip: false };
}

function truncatePatch(patch: string, maxLines = 500): string {
  const lines = patch.split('\n');
  if (lines.length <= maxLines) return patch;
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n... (${lines.length - maxLines}줄 생략됨)`
  );
}

export async function extractPRContext(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  config: PRmateConfig
): Promise<PRContext> {
  const [prData, filesData] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number: pullNumber }),
    octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
    }),
  ]);

  const pr = prData.data;
  const allFiles = filesData.data;

  // 1차 필터: exclude_paths
  const stage1 = allFiles.filter(
    (f) => !isExcluded(f.filename, config.exclude_paths)
  );

  // 2차 필터: 파일별 규칙 (Week 2-5)
  const stage2 = stage1
    .map((f) => ({
      file: f,
      rule: evaluateFileRules(f.filename, config.rules),
    }))
    .filter(({ rule }) => !rule.skip);

  // 3차: 최대 파일 수 제한
  const reviewableFiles = stage2.slice(0, config.max_files_per_pr);

  const files: ParsedFile[] = reviewableFiles.map(({ file, rule }) => ({
    filename: file.filename,
    status: file.status as ParsedFile['status'],
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch ? maskSecrets(truncatePatch(file.patch)) : undefined,
    overrideLevel: rule.overrideLevel,
  }));

  const labels = pr.labels.map((l) =>
    typeof l === 'string' ? l : l.name ?? ''
  );

  return {
    title: pr.title,
    body: maskSecrets(pr.body ?? ''),
    author: pr.user?.login ?? 'unknown',
    labels,
    files,
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
  };
}

export function formatDiffForReview(context: PRContext): string {
  const fileSummaries = context.files
    .map((f) => {
      const levelTag = f.overrideLevel
        ? ` [review_level=${f.overrideLevel}]`
        : '';
      const header = `### ${f.filename} (+${f.additions}/-${f.deletions})${levelTag}`;
      const patch = f.patch
        ? `\`\`\`diff\n${f.patch}\n\`\`\``
        : '_(바이너리 또는 변경 내용 없음)_';
      return `${header}\n${patch}`;
    })
    .join('\n\n');

  const labelsLine =
    context.labels.length > 0
      ? `- **라벨:** ${context.labels.join(', ')}\n`
      : '';

  return `## PR 정보
- **제목:** ${context.title}
- **작성자:** ${context.author}
- **브랜치:** ${context.headBranch} → ${context.baseBranch}
${labelsLine}- **설명:** ${context.body || '(설명 없음)'}
- **변경 파일 수:** ${context.files.length}

## 변경 파일 상세

${fileSummaries}`;
}
