// PRmate 동작 테스트용 파일
// 의도적으로 리뷰 포인트를 포함했습니다.

// [권장] 타입 명시 없는 함수
function add(a, b) {
  return a + b;
}

// [위험] 에러 처리 없는 비동기 함수
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return data;
}

// [제안] 매직 넘버 사용
function isAdult(age) {
  return age >= 18;  // 18이 뭔지 명확하지 않음
}

// [권장] 중복 로직
function getUserName(user) {
  if (user.firstName && user.lastName) {
    return user.firstName + ' ' + user.lastName;
  }
  return '';
}

function getAuthorName(author) {
  if (author.firstName && author.lastName) {
    return author.firstName + ' ' + author.lastName;
  }
  return '';
}

export { add, fetchUser, isAdult, getUserName, getAuthorName };
