import { Convention } from '../config/schema';

export interface ConventionRuleset {
  name: string;
  description: string;
  rules: string[];
}

const WOOWA_CONVENTION: ConventionRuleset = {
  name: '우아한형제들',
  description: '우아한형제들 Java/Kotlin 코딩 컨벤션',
  rules: [
    '클래스 이름은 PascalCase를 사용한다.',
    '메서드와 변수 이름은 camelCase를 사용한다.',
    '상수는 UPPER_SNAKE_CASE를 사용한다.',
    '패키지 구조는 계층형 아키텍처를 따른다 (controller, service, repository, domain).',
    'JavaDoc 주석을 public 메서드에 필수로 작성한다.',
    'Optional 반환형을 적극 활용한다.',
    '한국어 주석을 권장한다.',
    '메서드 길이는 15줄 이하를 권장한다.',
    '인터페이스는 구현체와 명확히 분리한다.',
    'Stream API 사용 시 가독성을 우선한다.',
  ],
};

const KAKAO_CONVENTION: ConventionRuleset = {
  name: '카카오',
  description: '카카오 Java/Kotlin 코딩 컨벤션',
  rules: [
    '들여쓰기는 4 spaces를 사용한다. 탭은 사용하지 않는다.',
    '중괄호는 K&R 스타일(같은 줄)을 사용한다.',
    '한 줄은 최대 120자를 넘지 않는다.',
    '인터페이스 이름에 I 접두사를 붙이지 않는다.',
    'var 사용을 지양하고 명시적 타입 선언을 사용한다.',
    '클래스는 단일 책임 원칙(SRP)을 따른다.',
    '불필요한 주석은 지양한다. 코드 자체가 문서가 되어야 한다.',
    '빈 줄은 관련 코드 블록을 구분하는 데 사용한다.',
    'null 반환을 피하고 Optional 또는 빈 컬렉션을 반환한다.',
    '예외는 명시적으로 처리한다.',
  ],
};

const NAVER_CONVENTION: ConventionRuleset = {
  name: '네이버',
  description: '네이버 Java 코딩 컨벤션',
  rules: [
    '들여쓰기는 4 spaces를 사용한다.',
    '한 줄은 최대 120자를 넘지 않는다.',
    '후행 공백(trailing whitespace)을 허용하지 않는다.',
    '@Override 어노테이션은 반드시 선언한다.',
    '블록 중첩은 최대 4단계까지만 허용한다.',
    '클래스는 PascalCase, 메서드/변수는 camelCase를 사용한다.',
    'import 구문은 와일드카드(*)를 사용하지 않는다.',
    '한 파일에 하나의 top-level 클래스만 선언한다.',
    '삼항 연산자는 단순한 경우에만 사용한다.',
    'switch 문에 default 절을 반드시 포함한다.',
  ],
};

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

export function getConventionRuleset(convention: Convention): ConventionRuleset {
  switch (convention) {
    case 'woowa':
      return WOOWA_CONVENTION;
    case 'kakao':
      return KAKAO_CONVENTION;
    case 'naver':
      return NAVER_CONVENTION;
    default:
      return DEFAULT_CONVENTION;
  }
}

export function formatConventionForPrompt(ruleset: ConventionRuleset): string {
  const rules = ruleset.rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
  return `### ${ruleset.name} 코딩 컨벤션\n${rules}`;
}
