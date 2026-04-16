# Changelog

All notable changes to PRmate will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (Week 1)
- `action.yml` — 재사용 가능한 composite Action으로 배포
- esbuild 기반 번들링 (`dist/review.js` 단일 파일, 505KB)
- 릴리스 자동화 워크플로우 (태그 푸시 시 자동 빌드 + 릴리스 생성)
- README 전면 개편 + 배지 추가
- CONTRIBUTING.md 작성
- 다중 config 경로 지원 (`PRMATE_CONFIG_PATH` > `GITHUB_WORKSPACE/.prmate.yml` > cwd)

### Changed
- TIMEOUT_MS 기본값 30s → 90s (대형 PR 안정성)
- 모델 ID 환경변수 오버라이드 지원 (`CLAUDE_MODEL`)
- `MAX_ATTEMPTS` 상수 추출 (하드코딩 제거)

### Fixed
- Import 순서 오류 (const 선언이 import 사이에 위치)
- 크레딧 충전 후 구 모델 ID 에러

## [0.1.0] - 2026-04-15

### Added
- GitHub Actions 기반 한국어 자동 코드 리뷰 MVP
- 우아한형제들 / 카카오 / 네이버 컨벤션 프리셋
- `.prmate.yml` 설정 파일 지원
- 비밀 정보 자동 마스킹 (API 키, 토큰, 비밀번호)
- Claude API Prompt Caching으로 비용 최적화
- 에러 발생 시 한국어 안내 코멘트 자동 게시
- Zero Data Retention (코드 서버 미저장)

[Unreleased]: https://github.com/sunes26/prmate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sunes26/prmate/releases/tag/v0.1.0
