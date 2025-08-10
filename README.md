# B-BOT 🤖
**부산 청년을 위한 AI 챗봇 서비스**

> 부산 청년들의 공간 및 프로그램 정보를 쉽게 찾을 수 있도록 도와주는 스마트 챗봇입니다.

## 📋 프로젝트 개요

B-BOT은 부산 지역 청년들이 다양한 청년 공간과 프로그램 정보를 쉽게 접근할 수 있도록 설계된 대화형 AI 챗봇입니다. 사용자 친화적인 인터페이스와 직관적인 검색 기능을 통해 필요한 정보를 빠르게 제공합니다.

### 주요 기능
- 🏢 **청년 공간 정보 검색** - 부산 16개 구군별 청년 공간 안내
- 📅 **프로그램 정보 제공** - 스터디, 교육, 커뮤니티, 창업 등 다양한 프로그램
- 🗺️ **인터랙티브 지도** - 시각적 공간 탐색 기능
- 🔍 **키워드 기반 검색** - 관심사별 맞춤 정보 제공
- 💬 **대화형 인터페이스** - 자연스러운 채팅 환경
- 🌙 **다크모드 지원** - 사용자 환경에 맞는 테마 설정

## 🛠️ 기술 스택

### Frontend
- **React 18** - 컴포넌트 기반 사용자 인터페이스
- **JavaScript (ES6+)** - 모던 자바스크립트 문법
- **CSS3** - 반응형 디자인 및 애니메이션
- **Axios** - HTTP 클라이언트 라이브러리

### 주요 라이브러리
- **React Hooks** - 상태 관리 및 생명주기 관리
- **Custom Hooks** - 재사용 가능한 로직 분리
- **CSS Variables** - 동적 테마 시스템

### 배포
- **GitHub Pages** - 정적 사이트 호스팅

## 📁 프로젝트 구조

```
busan-chatbot-frontend/
├── public/                     # 정적 파일
│   ├── index.html
│   ├── bot-profile.png        # 챗봇 프로필 이미지
│   └── bot-profile_nb.png     # 배경 없는 로고
├── src/
│   ├── components/            # React 컴포넌트
│   │   ├── chat/             # 채팅 관련 컴포넌트
│   │   │   ├── ChatWindow.jsx        # 메인 채팅 창
│   │   │   ├── ChatInput.jsx         # 메시지 입력
│   │   │   ├── MessageBubble.jsx     # 메시지 버블
│   │   │   ├── ThinkingIndicator.jsx # 로딩 인디케이터
│   │   │   └── WelcomeScreen.jsx     # 웰컴 화면
│   │   ├── sidebar/          # 사이드바 컴포넌트
│   │   │   ├── Sidebar.jsx           # 메인 사이드바
│   │   │   └── ChatHistoryItem.jsx   # 채팅 기록 아이템
│   │   ├── map/              # 지도 관련 컴포넌트
│   │   │   └── BusanMap.jsx          # 부산 지역 지도
│   │   └── ui/               # UI 컴포넌트
│   │       ├── MainMenuButtons.jsx   # 메인 메뉴 버튼
│   │       ├── MenuToggle.jsx        # 메뉴 토글 버튼
│   │       ├── QuickLinks.jsx        # 빠른 링크
│   │       ├── KeywordButtons.jsx    # 키워드 버튼
│   │       └── ProgramRegionButtons.jsx # 지역별 프로그램 버튼
│   ├── hooks/                # Custom Hooks
│   │   ├── useDarkMode.js            # 다크모드 관리
│   │   └── useSidebarState.js        # 사이드바 상태 관리
│   ├── utils/                # 유틸리티 함수
│   │   ├── constants.js              # 상수 정의
│   │   └── helpers.js                # 헬퍼 함수
│   ├── styles/               # 스타일 시트
│   │   ├── variables.css             # CSS 변수 정의
│   │   ├── globals.css               # 전역 스타일
│   │   ├── responsive.css            # 반응형 디자인
│   │   └── components/               # 컴포넌트별 스타일
│   │       ├── chat.css
│   │       ├── sidebar.css
│   │       ├── ui.css
│   │       ├── map.css
│   │       └── space-detail-search.css
│   ├── assets/               # 에셋 파일
│   │   └── bot-profile.png
│   ├── App.jsx               # 메인 앱 컴포넌트
│   └── index.js              # 앱 진입점
├── package.json              # 프로젝트 설정
└── README.md                 # 프로젝트 문서
```

## 🎨 주요 특징

### 모던 스타일 사이드바
- **모던한 디자인**: ChatGPT와 유사한 깔끔한 인터페이스
- **직관적인 네비게이션**: 로고, 다크모드, 사이드바 토글 버튼
- **채팅 기록 관리**: 이전 대화 내용 저장 및 관리
- **반응형 디자인**: 데스크톱과 모바일 환경 최적화

### 스마트 메뉴 시스템
- **토글 가능한 메뉴**: 필요에 따라 숨기거나 표시
- **동적 버튼 배치**: 메뉴 상태에 따른 스크롤 버튼 위치 조정
- **호버 효과**: 사용자 상호작용 피드백

### 다양한 검색 방식
- **지역별 검색**: 부산 16개 구군별 정보 제공
- **카테고리별 검색**: 8가지 활동 유형별 분류
- **키워드 검색**: 자유로운 텍스트 기반 검색
- **상세 검색**: 고급 필터링 옵션

### 사용자 경험 최적화
- **실시간 채팅**: 자연스러운 대화 흐름
- **로딩 애니메이션**: 응답 대기 시 시각적 피드백
- **다크모드**: 사용자 선호도에 맞는 테마
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🚀 시작하기

### 필수 요구사항
- Node.js 14.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/kt-busan/busan-chatbot-frontend.git

# 프로젝트 디렉토리 이동
cd busan-chatbot-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

---

**부산 청년을 위한 B-BOT과 함께 더 나은 청년 생활을 시작하세요! 🚀**