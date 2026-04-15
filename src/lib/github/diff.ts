import { Octokit } from '@octokit/rest';
import { maskSecrets } from '../masking';
import { KorReviewConfig } from '../config/schema';
import { minimatch } from 'minimatch';

export interface ParsedFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  patch?: string;
}

export interface PRContext {
  title: string;
  body: string;
  author: string;
  files: ParsedFile[];
  baseBranch: string;
  headBranch: string;
}

// 리뷰 제외 대상 파일 패턴
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
  return allPatterns.some((pattern) => minimatch(filename, pattern, { matchBase: true }));
}

function truncatePatch(patch: string, maxLines = 500): string {
  const lines = patch.split('\n');
  if (lines.length <= maxLines) return patch;
  return lines.slice(0, maxLines).join('\n') + `\n... (${lines.length - maxLines}줄 생략됨)`;
}

export async function extractPRContext(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  config: KorReviewConfig
): Promise<PRContext> {
  const [prData, filesData] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number: pullNumber }),
    octokit.pulls.listFiles({ owner, repo, pull_number: pullNumber, per_page: 100 }),
  ]);

  const pr = prData.data;
  const allFiles = filesData.data;

  // 제외 대상 필터링 후 최대 파일 수 제한
  const reviewableFiles = allFiles
    .filter((f) => !isExcluded(f.filename, config.exclude_paths))
    .slice(0, config.max_files_per_pr);

  const files: ParsedFile[] = reviewableFiles.map((f) => ({
    filename: f.filename,
    status: f.status as ParsedFile['status'],
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch ? maskSecrets(truncatePatch(f.patch)) : undefined,
  }));

  return {
    title: pr.title,
    body: maskSecrets(pr.body ?? ''),
    author: pr.user?.login ?? 'unknown',
    files,
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
  };
}

export function formatDiffForReview(context: PRContext): string {
  const fileSummaries = context.files
    .map((f) => {
      const header = `### ${f.filename} (+${f.additions}/-${f.deletions})`;
      const patch = f.patch ? `\`\`\`diff\n${f.patch}\n\`\`\`` : '_(바이너리 또는 변경 내용 없음)_';
      return `${header}\n${patch}`;
    })
    .join('\n\n');

  return `## PR 정보
- **제목:** ${context.title}
- **작성자:** ${context.author}
- **브랜치:** ${context.headBranch} → ${context.baseBranch}
- **설명:** ${context.body || '(설명 없음)'}
- **변경 파일 수:** ${context.files.length}

## 변경 파일 상세

${fileSummaries}`;
}
