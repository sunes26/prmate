/**
 * PRmate 컨벤션 프리셋
 *
 * ⚠️ 정직성 원칙
 * ────────────────────────────────────────────────────────────────
 * 이 파일의 컨벤션은 모두 **공개된 공식 자료**에 기반합니다.
 * 내부 문서로만 존재하는 기업(카카오, SK, LG, 쿠팡, LINE 등)의
 * "추정 규칙"은 포함하지 않습니다. 팀 자체 규칙은 `custom` 프리셋과
 * `custom_convention_file`을 활용하세요.
 * ────────────────────────────────────────────────────────────────
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Convention } from '../config/schema';

export interface ConventionRuleset {
  name: string;
  description: string;
  source?: string; // 공식 출처 URL
  rules: string[];
}

// ═══════════════════════════════════════════════════════════════
// default — 클린 코드 범용
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONVENTION: ConventionRuleset = {
  name: '기본',
  description: '클린 코드 범용 원칙 (Robert C. Martin 기반)',
  rules: [
    '함수는 한 가지 일만 해야 한다 (단일 책임 원칙).',
    '함수 길이는 50줄 이하를 권장한다.',
    '변수명은 의도를 명확히 드러내야 한다.',
    '매직 넘버 사용을 금지하고 상수로 추출한다.',
    '중복 코드를 제거하고 재사용을 추구한다 (DRY 원칙).',
    '깊은 중첩(4단계 이상)을 피한다.',
    '함수 인자는 3개 이하를 권장한다.',
    '사이드 이펙트를 최소화하고 순수 함수를 지향한다.',
    '예외 처리를 명시적으로 구현한다.',
    '테스트 가능한 코드를 작성한다.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// woowa — 우아한테크코스 스타일 가이드
// 출처: https://github.com/woowacourse/woowacourse-docs/tree/main/styleguide
// 기반: Google Java Style Guide + 4개 차이점 (공식 문서 명시)
// ═══════════════════════════════════════════════════════════════

const WOOWA_CONVENTION: ConventionRuleset = {
  name: '우아한테크코스',
  description: '우아한테크코스 Java 스타일 가이드 (Google Java Style 기반)',
  source: 'https://github.com/woowacourse/woowacourse-docs/tree/main/styleguide/java',
  rules: [
    '기반: Google Java Style Guide를 따른다.',
    '블록 들여쓰기는 4 spaces (Google 기본 2와 다름).',
    '한 줄 최대 120자 (Google 기본 100자와 다름).',
    '줄 바꿈 시 그 다음 줄은 원래 줄에서 +8 이상 들여쓴다 (Google의 +4와 다름).',
    '클래스의 첫 번째 멤버나 초기화 앞의 빈 줄을 강제하지 않는다.',
    '그 외 네이밍/중괄호/import 규칙은 Google Java Style과 동일.',
    '패키지명: 소문자 + 점 구분 (e.g., domain.store.order).',
    '클래스: UpperCamelCase (명사/명사구).',
    '메서드/변수: lowerCamelCase (동사로 시작).',
    '상수: UPPER_SNAKE_CASE.',
    '중괄호는 K&R 스타일 (같은 줄에서 열기).',
    '파일 인코딩 UTF-8, LF 줄 끝.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// naver — 네이버 Hackday Java 컨벤션 (공식 + Checkstyle XML)
// 출처: https://naver.github.io/hackday-conventions-java/
// Checkstyle: https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-checkstyle-rules.xml
// ═══════════════════════════════════════════════════════════════

const NAVER_CONVENTION: ConventionRuleset = {
  name: '네이버 Hackday',
  description: '네이버 Hackday Java 코딩 컨벤션 (Checkstyle XML 포함 공식 문서)',
  source: 'https://naver.github.io/hackday-conventions-java/',
  rules: [
    '들여쓰기: 하드탭 사용 (1탭 = 4 spaces 시각적 크기).',
    '한 줄 최대 120자 (package/import는 예외).',
    '중괄호: K&R 스타일 — 여는 중괄호는 줄 끝, else/catch/finally는 닫는 중괄호와 같은 줄.',
    '한 줄에 하나의 선언문만 (`;` 뒤 새 줄 필수).',
    '조건/반복문이 한 줄이어도 중괄호 필수.',
    '네이밍: 클래스 UpperCamelCase (명사), 메서드 lowerCamelCase (동사 시작), 상수 UPPER_SNAKE_CASE.',
    '패키지명: 소문자만 (e.g., com.navercorp.apigateway).',
    '배열 선언은 타입 뒤에 대괄호: `String[] names` (O), `String names[]` (X).',
    'Import 순서: static → java.* → javax.* → org.* → net.* → com.* → com.nhncorp.* → com.navercorp.* → com.naver.* (그룹 사이 빈 줄).',
    '공백: 제어문과 `(` 사이 공백, 메서드명과 `(` 사이 공백 없음, 이항/삼항 연산자 전후 공백.',
    '파일 인코딩: UTF-8, 줄 끝: LF, 파일 끝 새 줄 문자로 종료, 줄 끝 공백 금지.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// toss — 토스 Frontend Fundamentals (공식)
// 출처: https://frontend-fundamentals.com/code-quality/
// 레포: https://github.com/toss/frontend-fundamentals
// ═══════════════════════════════════════════════════════════════

const TOSS_CONVENTION: ConventionRuleset = {
  name: '토스 Frontend Fundamentals',
  description: '토스 Frontend Fundamentals — 변경하기 쉬운 코드의 4대 원칙',
  source: 'https://frontend-fundamentals.com/code-quality/',
  rules: [
    '[가독성] 맥락 줄이기: 함께 실행되지 않는 코드 분리, 구현 세부사항 추상화, 로직 유형별 함수 분할.',
    '[가독성] 이름 붙이기: 복잡한 조건과 매직 넘버에 명확한 이름 부여.',
    '[가독성] 흐름 개선: 위에서 아래로 자연스럽게 읽히도록, 시점 이동 줄이기, 삼항 연산자 단순화.',
    '[예측가능성] 이름 충돌 방지 — 같은 스코프 내 유사한 이름 지양.',
    '[예측가능성] 유사 함수의 반환 타입 통일.',
    '[예측가능성] 숨겨진 로직을 명시적으로 드러내기.',
    '[응집도] 함께 수정되는 파일들을 같은 디렉토리에 배치.',
    '[응집도] 매직 넘버 제거 — 의미 있는 상수로.',
    '[응집도] 폼 요소의 응집도 고려 — 관련 필드 한 곳에.',
    '[결합도] 책임 분산 — 한 곳이 모든 걸 알지 않도록.',
    '[결합도] 필요시 코드 중복 허용 — 억지 추상화보다 낫다.',
    '[결합도] Props Drilling 제거 — Context나 상태 관리로 분리.',
  ],
};

// ═══════════════════════════════════════════════════════════════
// 프리셋 맵
// ═══════════════════════════════════════════════════════════════

const PRESETS: Record<Exclude<Convention, 'custom'>, ConventionRuleset> = {
  default: DEFAULT_CONVENTION,
  woowa: WOOWA_CONVENTION,
  naver: NAVER_CONVENTION,
  toss: TOSS_CONVENTION,
};

// ═══════════════════════════════════════════════════════════════
// 커스텀 컨벤션 로더
// ═══════════════════════════════════════════════════════════════

export function loadCustomConvention(filePath: string): ConventionRuleset {
  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const fullPath = resolve(workspace, filePath);

  if (!existsSync(fullPath)) {
    console.warn(`[PRmate] 커스텀 컨벤션 파일 없음: ${fullPath} → 기본 사용`);
    return DEFAULT_CONVENTION;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    return {
      name: '팀 커스텀',
      description: `팀 자체 컨벤션 (${filePath})`,
      rules: [content],
    };
  } catch (err) {
    console.warn(
      `[PRmate] 커스텀 컨벤션 로드 실패: ${
        err instanceof Error ? err.message : err
      } → 기본 사용`
    );
    return DEFAULT_CONVENTION;
  }
}

// ═══════════════════════════════════════════════════════════════
// 공개 API
// ═══════════════════════════════════════════════════════════════

export function getConventionRuleset(
  convention: Convention,
  customFile?: string
): ConventionRuleset {
  if (convention === 'custom') {
    if (!customFile) {
      console.warn(
        '[PRmate] convention: custom 선택되었으나 convention_file 미지정 → 기본 사용'
      );
      return DEFAULT_CONVENTION;
    }
    return loadCustomConvention(customFile);
  }
  return PRESETS[convention] ?? DEFAULT_CONVENTION;
}

export function formatConventionForPrompt(ruleset: ConventionRuleset): string {
  if (ruleset.name === '팀 커스텀') {
    return `### ${ruleset.name} 컨벤션\n\n${ruleset.rules[0]}`;
  }
  const rules = ruleset.rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
  const sourceLine = ruleset.source ? `\n\n**공식 출처:** ${ruleset.source}` : '';
  return `### ${ruleset.name} 코딩 컨벤션\n\n${rules}${sourceLine}`;
}

export function listConventions(): string[] {
  return Object.keys(PRESETS).concat(['custom']);
}
