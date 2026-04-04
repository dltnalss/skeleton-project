# skeleton-project

6조의 스켈레톤 프로젝트 : 가계부 서비스
팀원 : 24회차 김진홍 김태균 복원준 이수민 홍서영

# git clone 방법

각자 개인 컴퓨터에서 환경 세팅

1. 터미널 창을 열고 git clone https://github.com/dltnalss/skeleton-project.git
2. 폴더가 잘 들어와있는지 확인하기
3. cd skeleton-project (프로젝트 폴더로 이동)
4. npm install (\*\*필수 / node modules는 파일 크기가 너무 커서 삭제 후 업로드)
5. 터미널 창에서 폴더이름 옆에 (main or develop)이라고 뜨는지 확인

# git 브랜치 생성 방법 및 이동 방법

우린 무조건 develop 브랜치에서 모든 개발 수행

1. git checkout develop (develop 브랜치로 이동 - 터미널 창 폴더이름 옆에 develop이라고 뜨는지 확인)
2. git pull origin develop(최신 develop으로 업데이트)
3. git checkout -b feat/login (login 개발에 사용하는 브랜치 만들어줘)
4. 폴더 이름 옆 괄호 안 브랜치 이름 확인 후 개발 시작 \*\*\*

# git develop 상태 업데이트

1. git checkout develop (develop 브랜치로 이동)
2. git fetch origin (원격 저장소 github에 있는 develop 정찰 부탁)
3. git status (그래서 지금 상태 어떰 ?) - 이 때 바뀐 게 있으면 바꼈다고 말해줌
4. git pull origin develop

# git push 방법

\*\* 옆에 괄호로 뜨는 브랜치 이름을 확인할 것 !!
git status -> 현재 상태를 확인
git add . -> 전체 파일을 추가해주세요
git commit -m "커밋메세지를 입력해주세요(나 지금 뭐 수정함)"
git push -> 만약 오류 뜰 시 터미널에서 요구하는 명령어 입력

# 🌿 브랜치 및 협업 규칙

우리 팀은 Git Flow 방식을 지향합니다.

main: 출시 가능한 상태의 최종 코드 (Pull Request로만 합류 가능)

develop: 개발 중인 통합 브랜치 (기준점)
우리는 해당 브랜치로 계속 작업합니다.
하루에 1~2번씩 다 같이 모여서 회의하고 충돌을 해결한 다음
main 브랜치로 merge 합니다.

feat/[기능명]: 각자 할당된 기능을 개발하는 개인 브랜치

예: feat/login, feat/board-list

⚠️ 주의: main 브랜치에 직접 Push하지 마세요! 작업은 항상 본인 브랜치에서 한 뒤 develop으로 합칩니다.

# ⚠️ 가장 중요한 merge 규칙

우리는 선착순으로 develop에 merge 할 기회를 가져갑니다 !!

1. 만약 나와 팀원이 같이 feat/login 브랜치를 수정했다고 생각해봅시다
2. 내가 먼저 개발을 끝내서 나의 feat/login 브랜치를 develop에 merge 합니다.
3. 뒤늦게 개발을 끝낸 팀원은 업데이트 된 develop 브랜치를 자신의 local로 가져옵니다
4. 이 때 !! 충돌이 발생할 수 있습니다. 그럼 팀원은 나와 함께 팀원의 브랜치에서 충돌을 해결합니다.
5. 이후 팀원은 해결된 브랜치를 다시 develop에 merge 합니다.
6. 가장 중요한 건 {우리 팀은 브랜치끼리 merge 하지 않습니다.}

📦 기술 스택 (Tech Stack)
Framework: Vue (Composition API)

Build Tool: Vite

Router: Vue Router

State: Pinia

HTTP: Axios

Styling: CSS

# 📝 커밋 메시지 규약 (Commit Convention)

서로의 작업 내용을 쉽게 파악하기 위해 아래 머리말을 꼭 지켜주세요.

feat: 새로운 기능 추가

docs: README 등 문서 수정

style: 코드 의미에 영향을 주지 않는 변경 (세미콜론, 포맷팅 등)

refactor: 코드 리팩토링 (기능 변화 없음)
option API -> composition API로 바꾼다던가 .. 등등

## 📂 폴더 구조 (Folder Structure)

```text
src/
├── assets/          # 이미지, 아이콘, 전역 CSS
├── components/      # 재사용 가능한 공통 컴포넌트
│   ├── common/      # 버튼, 모달 등 공통 UI
│   └── layout/      # 헤더, 푸터, 사이드바
├── pages/           # 페이지 단위 컴포넌트 (Router 연결)
├── router/          # 라우터 설정 (index.js)
├── store/           # 상태 관리 (Pinia) - counter.js
├── api/             # Axios API 호출 함수 관리
├── utils/           # 공통 유틸리티 함수
└── App.vue          # 최상위 컴포넌트
```
