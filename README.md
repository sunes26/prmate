# PRmate 🤖 — 한국어 AI 코드 리뷰

> **GitHub PR이 열리면 자동으로 한국어로 코드 리뷰 코멘트를 게시합니다.**
> 우아한형제들, 카카오, 네이버 등 국내 대기업 코딩 컨벤션 프리셋 11종 내장.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-PRmate-blue?logo=github)](https://github.com/marketplace/actions/prmate)
[![Tests](https://img.shields.io/badge/tests-14%20passed-brightgreen)](#테스트)
[![Claude Sonnet 4.6](https://img.shields.io/badge/Claude-Sonnet%204.6-purple)](https://www.anthropic.com)

---

## 🎯 왜 PRmate인가?

| 특징 | 설명 |
|------|------|
| 🇰🇷 **처음부터 한국어 설계** | 번역체 없는 자연스러운 한국어 리뷰 |
| 🏢 **국내 대기업 컨벤션** | 우아한형제들 · 카카오 · 네이버 · SK · LG · NHN · 쿠팡 · LINE · 토스 |
| ⚡ **5분 설치** | YAML 한 줄이면 끝 |
| 🔒 **Zero Data Retention** | 코드 서버 미저장, 메모리 처리 후 즉시 삭제 |
| 💰 **비용 최적화** | Prompt Caching으로 토큰 비용 50~90% 절감 |
| 🛡️ **비밀 자동 마스킹** | API 키 / 토큰 / 비밀번호 자동 [REDACTED] |

---

## 🚀 5분 설치

### 1단계: API 키 등록

1. [console.anthropic.com](https://console.anthropic.com)에서 API 키 발급
2. 자기 레포 → **Settings** → **Secrets and variables** → **Actions**
3. Name: `ANTHROPIC_API_KEY`, Value: 발급받은 키

### 2단계: 워크플로우 파일 추가

`.github/workflows/review.yml` 파일 생성:

```yaml
name: PR 코드 리뷰

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  pull-requests: write
  contents: read

jobs:
  review:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      - uses: sunes26/prmate@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 3단계: PR 열기 → 자동 리뷰 확인

PR을 열면 2~3분 내 한국어 리뷰 코멘트가 자동으로 게시됩니다.

---

## ⚙️ 상세 설정 (`.prmate.yml`)

레포 루트에 `.prmate.yml` 파일을 만들어 세부 설정:

```yaml
enabled: true                 # 전체 On/Off (Kill switch)

language: ko                  # ko | en
convention: kakao             # default | woowa | kakao | naver | sk | lg | nhn | coupang | line | toss | custom
review_level: standard        # strict | standard | relaxed

model: sonnet                 # sonnet (권장) | haiku (빠름, 저렴)
mixed_language: false         # 코드는 영어, 설명은 한국어
dry_run: false                # 실제 게시 없이 로그만

pipa_check: false             # 개인정보보호법 위반 체크 (Growth 플랜)
max_files_per_pr: 20          # PR당 최대 리뷰 파일 수

exclude_paths:
  - "*.md"
  - "docs/**"
  - "*.lock"
  - "*.test.ts"

# 파일 타입별 세부 규칙 (Week 2 신규)
rules:
  - pattern: "src/**/*.ts"
    review_level: strict
  - pattern: "*.spec.ts"
    enabled: false

# 커스텀 프롬프트 주입 (Week 2 신규)
custom_prompt: |
  우리 팀은 함수형 프로그래밍 원칙을 중시합니다.
  가변 상태(mutation) 사용을 강하게 지적해주세요.

# 팀 스타일 가이드 (Week 4 신규)
learning:
  enabled: true
  style_guide: .prmate/style-guide.md
  examples_dir: .prmate/examples/
```

---

## 🇰🇷 컨벤션 프리셋 (11종)

| 값 | 대상 기업 | 주요 언어 |
|----|---------|----------|
| `default` | 클린 코드 범용 원칙 | 모든 언어 |
| `woowa` | 우아한형제들 | Java/Kotlin |
| `kakao` | 카카오 | Java/Kotlin |
| `naver` | 네이버 | Java |
| `sk` | SK/SKT | Java |
| `lg` | LG CNS | Java |
| `nhn` | NHN | Java |
| `coupang` | 쿠팡 | Java |
| `line` | LINE | 멀티언어 |
| `toss` | 토스 | TypeScript |
| `custom` | 팀 자체 파일 | - |

### 커스텀 컨벤션 사용
```yaml
# .prmate.yml
convention: custom
custom_convention_file: .prmate/our-style.md
```

---

## 🔌 Action Inputs

| Input | 설명 | 필수 | 기본값 |
|-------|------|------|--------|
| `anthropic_api_key` | Anthropic API 키 | ✅ | - |
| `github_token` | GitHub 토큰 | ❌ | `github.token` |
| `config_path` | 설정 파일 경로 | ❌ | `.prmate.yml` |
| `claude_model` | Claude 모델 | ❌ | `claude-sonnet-4-6` |
| `timeout_ms` | 타임아웃 (ms) | ❌ | `90000` |

## 📤 Action Outputs

| Output | 설명 |
|--------|------|
| `review_url` | 게시된 리뷰 코멘트 URL |
| `tokens_used` | 사용 토큰 수 (입력+출력) |

---

## 🛑 리뷰 건너뛰기

### PR 제목에 `[skip review]` 포함
```
fix(wip): [skip review] 아직 미완성
```

### PR을 Draft로 전환
GitHub PR 페이지 → Convert to draft

### `.prmate.yml`로 비활성화
```yaml
enabled: false
```

### 특정 파일 제외
```yaml
exclude_paths:
  - "vendor/**"
  - "experimental/**"
```

---

## 💰 가격

| 플랜 | 가격 | PR 한도 | 특전 |
|------|------|---------|------|
| **Free** | ₩0/월 | 월 30개 | 기본 컨벤션 3개 |
| **Starter** | ₩9,900/월 | 월 100개 | 전체 컨벤션, 커스텀 프롬프트 |
| **Team** | ₩29,000/월 | 월 300개 | + Slack/Discord 알림, 학습 모드 |
| **Growth** | ₩59,000/월 | 무제한 | + PIPA 체크, 보안 모드 |
| **Enterprise** | 문의 | 무제한 | + SLA, 전담 지원, 커스텀 컨벤션 제작 |

> 💡 **베타 기간 중 모든 기능 무료** — [베타 신청](https://prmate.dev/beta)

---

## ❓ 자주 묻는 질문

<details>
<summary><b>Q: 코드가 서버에 저장되나요?</b></summary>

아니요. Zero Data Retention 정책으로 코드는 메모리에서 처리 후 즉시 삭제됩니다. PR diff만 추출하여 분석하며, 전체 레포지토리에 접근하지 않습니다.
</details>

<details>
<summary><b>Q: CodeRabbit과 무엇이 다른가요?</b></summary>

CodeRabbit은 `language: ko` 설정이 있지만 실제로는 영어 리뷰가 많이 나온다는 불만이 있습니다. PRmate는 처음부터 한국어 리뷰를 위해 설계되었으며, 우아한/카카오/네이버 등 국내 IT사 컨벤션 11종을 기본 제공합니다.
</details>

<details>
<summary><b>Q: 어떤 언어를 지원하나요?</b></summary>

JavaScript, TypeScript, Python, Java, Go, Kotlin, Rust, Ruby, Swift, C# 등 주요 언어 전부 지원.
</details>

<details>
<summary><b>Q: 리뷰 비용이 얼마나 드나요?</b></summary>

PR 1건당 평균 **$0.01 ~ $0.05** (≈ ₩15~70). Prompt Caching 활용 시 50~90% 절감.
</details>

<details>
<summary><b>Q: 리뷰 건너뛰기 가능한가요?</b></summary>

3가지 방법:
1. PR 제목에 `[skip review]` 포함
2. PR을 Draft로 전환
3. `.prmate.yml`에 `enabled: false`
</details>

<details>
<summary><b>Q: 대기업/엔터프라이즈 지원은?</b></summary>

네이버, 카카오, 쿠팡 등 엔터프라이즈 전담 지원 + 커스텀 컨벤션 제작 가능. [문의하기](mailto:contact@prmate.dev)
</details>

---

## 🔗 링크

- 🌐 **공식 사이트**: [prmate.dev](https://prmate.dev)
- 📦 **Marketplace**: [github.com/marketplace/actions/prmate](https://github.com/marketplace/actions/prmate)
- 💬 **Discord**: [discord.gg/prmate](https://discord.gg/prmate)
- 🐛 **버그 리포트**: [Issues](https://github.com/sunes26/prmate/issues)
- 💡 **기능 제안**: [Discussions](https://github.com/sunes26/prmate/discussions)
- 📝 **블로그**: [prmate.dev/blog](https://prmate.dev/blog)

---

## 🤝 기여

PRmate는 오픈소스입니다. PR 환영합니다!
[CONTRIBUTING.md](./CONTRIBUTING.md)를 읽어보세요.

---

## 📄 라이선스

MIT License — 자유롭게 사용하되 저작권 표시 필수.

---

*PRmate — 한국 개발자를 위해, 한국 개발자가 만든 코드 리뷰 도구* 🇰🇷
