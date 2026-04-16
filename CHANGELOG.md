# Changelog

All notable changes to PRmate will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-16

### 🚨 BREAKING CHANGES — 컨벤션 정리

v1.0.0에서 제공했던 11종 컨벤션 중 **공식 공개 문서가 없는 6종을 제거**했습니다.
정직성 원칙에 따라, 추정 기반 규칙을 회사명으로 제공하는 것을 중단합니다.

#### 제거된 컨벤션 (6종)
- `kakao` — 카카오 (공식 공개 문서 없음)
- `sk` — SK / SKT (공식 공개 문서 없음)
- `lg` — LG CNS (공식 공개 문서 없음)
- `nhn` — NHN Java (공식 공개 문서 없음 · FE는 deprecated)
- `coupang` — 쿠팡 (공식 공개 문서 없음)
- `line` — LINE (공식 공개 문서 없음)

#### 유지된 컨벤션 (5종, 모두 공식 출처 있음)
- `default` — 클린 코드 범용
- `woowa` — [우아한테크코스 스타일 가이드](https://github.com/woowacourse/woowacourse-docs/tree/main/styleguide) (Google Java Style 기반)
- `naver` — [네이버 Hackday Java 컨벤션](https://naver.github.io/hackday-conventions-java/) (Checkstyle XML 포함)
- `toss` — [토스 Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/) (4대 원칙)
- `custom` — 팀 자체 `.md` 파일

### Added
- 각 컨벤션 프리셋에 `source` 필드 추가 — 공식 출처 URL을 프롬프트에 노출
- Deprecated 컨벤션 값 사용 시 **친절한 마이그레이션 안내 메시지** 출력
- README에 "왜 5개만인가?" 섹션 + 마이그레이션 가이드
- 랜딩페이지 컨벤션 테이블에 **출처 링크 컬럼** 추가

### Changed
- `woowa` 규칙 재작성: Google Java Style 기반 + 4개 차이점 (공식 문서 반영)
- `naver` 규칙 재작성: Hackday 사이트 + Checkstyle XML 실제 규칙 반영
- `toss` 규칙 재작성: frontend-fundamentals 4대 원칙(가독성/예측가능성/응집도/결합도)
- Convention 타입: 11개 값 → 5개 값

### Migration Guide

**v1.0.0에서 `.prmate.yml`에 아래와 같이 쓰고 있었다면:**
```yaml
convention: kakao   # 또는 sk, lg, nhn, coupang, line
```

**조치:**
1. **팀 내부 규칙이 있다면** → `custom` 사용
   ```yaml
   convention: custom
   convention_file: .prmate/our-style.md
   ```
2. **공식 컨벤션 중 선택** → `default`, `woowa`, `naver`, `toss` 중 적절한 것
3. **조치 없이 유지** → 자동으로 `default`로 폴백 + 워크플로우 로그에 경고 출력

## [1.0.0] - 2026-04-16

### Added (Week 1-4 풀스펙)
- `action.yml` — 재사용 가능한 composite GitHub Action
- esbuild 번들링 (`dist/review.js` 단일 파일, 542KB)
- 릴리스 자동화 워크플로우 (태그 푸시 → 자동 빌드 + 릴리스)
- Kill switch (`enabled: false`)
- 에러 타입 10개 분류 + 한국어 메시지
- 비용 표시 (USD + KRW, 모델별 가격표)
- 모델 티어 선택 (sonnet/haiku/opus)
- 파일별 규칙 (glob + review_level override)
- PR 라벨 스킵 (skip_labels)
- 영어 혼용 모드 (mixed_language)
- Custom 프롬프트
- Dry-run 모드
- Inline 라인별 코멘트
- Review Approval/Request Changes 자동 판정
- Summary-only / Security / PIPA 모드
- 대형 PR 자동 청킹 (8+ 파일)
- `[re-review]` 태그 트리거
- 팀 스타일 가이드 유사 학습 모드
- README + CHANGELOG + CONTRIBUTING 정비
- 랜딩페이지 v1.0.0 리뉴얼

### Known Issues (v1.1.0에서 해결됨)
- 일부 컨벤션 규칙이 공식 공개 자료가 아닌 추정 기반

## [0.1.0] - 2026-04-15

### Added
- GitHub Actions 기반 한국어 자동 코드 리뷰 MVP
- 우아한형제들 / 카카오 / 네이버 컨벤션 프리셋
- `.prmate.yml` 설정 파일 지원
- 비밀 정보 자동 마스킹 (API 키, 토큰, 비밀번호)
- Claude API Prompt Caching 비용 최적화
- Zero Data Retention

[1.1.0]: https://github.com/prmate/prmate/releases/tag/v1.1.0
[1.0.0]: https://github.com/prmate/prmate/releases/tag/v1.0.0
[0.1.0]: https://github.com/prmate/prmate/releases/tag/v0.1.0
