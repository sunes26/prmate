# PRmate — 한국어 AI 코드 리뷰

> GitHub PR이 열리면 자동으로 한국어로 코드 리뷰 코멘트를 게시합니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 설치 방법 (5분)

### 1단계: ANTHROPIC_API_KEY 등록

1. [console.anthropic.com](https://console.anthropic.com)에서 API 키 발급
2. GitHub 레포지토리 → **Settings** → **Secrets and variables** → **Actions**
3. `ANTHROPIC_API_KEY` 이름으로 시크릿 추가

### 2단계: 워크플로우 파일 추가

```yaml
# .github/workflows/prmate.yml
name: PRmate
on:
  pull_request:
    types: [opened, synchronize, reopened]
permissions:
  pull-requests: write
  contents: read
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: npx tsx scripts/review.mts
```

### 3단계: PR 오픈 → 자동 리뷰 확인

PR을 열면 2~3분 내 한국어 리뷰 코멘트가 자동으로 게시됩니다.

---

## 설정 파일 (.prmate.yml)

```yaml
language: ko                # ko | en
convention: kakao           # woowa | kakao | naver | default
review_level: standard      # strict | standard | relaxed
pipa_check: false           # 개인정보보호법 체크 (Growth 플랜)
exclude_paths:
  - "*.md"
  - "docs/**"
max_files_per_pr: 20
```

### 컨벤션 프리셋

| 값 | 설명 |
|----|------|
| `woowa` | 우아한형제들 Java/Kotlin 코딩 가이드 |
| `kakao` | 카카오 코딩 컨벤션 |
| `naver` | 네이버 Java 코딩 컨벤션 |
| `default` | 클린 코드 범용 원칙 |

---

## 가격

| 플랜 | 가격 | PR 한도 |
|------|------|---------|
| Free | ₩0/월 | 30개/월 |
| Starter | ₩9,900/월 | 100개/월 |
| Team | ₩29,000/월 | 300개/월 |
| Growth | ₩59,000/월 | 무제한 |

---

## 자주 묻는 질문

**Q: 코드가 서버에 저장되나요?**  
A: 아니요. Zero Data Retention 정책으로 메모리 처리 후 즉시 삭제됩니다.

**Q: CodeRabbit 대비 장점은?**  
A: 처음부터 한국어 리뷰를 위해 설계. 번역체 없이 자연스러운 한국어, 국내 컨벤션 프리셋 내장.

**Q: 어떤 프로그래밍 언어를 지원하나요?**  
A: JavaScript, TypeScript, Python, Java, Go, Kotlin, Rust, Ruby, Swift, C# 등 지원.

**Q: 설치가 복잡한가요?**  
A: YAML 파일 하나를 복사+붙여넣기. 5분 이내 완료.

**Q: 베타 기간 중 무료인가요?**  
A: 네, 현재 베타 기간 중 무료입니다. 피드백 주시면 유료 전환 시 혜택 드립니다.

---

## 피드백

- 버그 리포트: [Issues](https://github.com/sunes26/prmate/issues)
- 기능 제안: [Discussions](https://github.com/sunes26/prmate/discussions)

---

*PRmate — 한국 개발자를 위해, 한국 개발자가 만든 코드 리뷰 도구*
