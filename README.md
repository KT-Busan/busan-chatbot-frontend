# B-BOT 🤖

**부산 청년을 위한 AI 챗봇 서비스**

> For the Youth in Busan

---

## 📋 프로젝트 개요

B-BOT은 부산 지역 청년들이 **청년공간/프로그램** 정보를 빠르게 찾도록 돕는 **대화형 웹 앱**입니다. 사용자 친화적 UI, 관심사 기반 검색, 지역/카테고리 필터링을 통해 필요한 정보를 **최소 클릭**으로 제공합니다.

### 주요 기능

* 🏢 **청년 공간 정보** : 부산 **16개 구·군** 공간 메타데이터 열람
* 📅 **프로그램 정보** : 스터디/교육/커뮤니티/창업 등 **8개 카테고리** 정리
* 🗺️ **인터랙티브 지도** : 지역 시각 탐색(공간 상세 연결)
* 🔍 **키워드·카테고리·지역 검색** : 관심사·지역·유형별 필터
* 💬 **대화형 인터페이스** : 자연스러운 질의응답 UX
* 🌙 **다크 모드** : 테마 토글 및 상태 유지

---

## 🛠️ 기술 스택

### Frontend

* **React 18**
* **Vite** (번들러/개발 서버)
* **JavaScript (ES6+)**
* **CSS3** (반응형 레이아웃, 컴포넌트 스타일 분리)
* **ESLint** (코드 규칙)

### 주요 설계 요소

* **React Hooks** : 상태/사이드이펙트 관리
* **Custom Hooks** : 다크모드/사이드바 등 공통 로직 재사용
* **CSS Variables** : 테마/색상 토큰화
* **유틸 분리** : `utils/constants.js`, `utils/helpers.js` 등

### 배포

* **GitHub Pages** (GitHub Actions 기반)

---

## 📁 프로젝트 구조
```
busan-chatbot-frontend/
├── .github/                              # GitHub Actions 및 워크플로우 설정
│   └── workflows/
│       └── deploy.yml                    # Pages 자동 배포 워크플로우 파일
├── public/                               # 정적 자산 (직접 참조되는 이미지/HTML)
│   ├── index.html                        # Fallback/참조용 HTML
│   ├── bot-profile.png                   # 챗봇 기본 로고 이미지
│   └── bot-profile_nb.png                # 배경 제거된 로고 이미지
├── src/                                  # 앱 소스 코드
│   ├── App.jsx                           # 메인 App 컴포넌트 (루트 UI 구성)
│   ├── index.js                          # 엔트리 포인트 (React DOM 렌더링)
│   ├── assets/                           # 추가 이미지/아이콘 리소스
│   │   └── bot-profile.png
│   ├── components/                       # React UI 컴포넌트 모음
│   │   ├── chat/                         # 채팅 인터페이스 관련 컴포넌트
│   │   │   ├── ChatWindow.jsx            # 메인 채팅창 레이아웃
│   │   │   ├── ChatInput.jsx             # 사용자 입력창
│   │   │   ├── MessageBubble.jsx         # 메시지 버블 UI
│   │   │   ├── ThinkingIndicator.jsx     # 챗봇 응답 로딩 애니메이션
│   │   │   └── WelcomeScreen.jsx         # 초기 환영 화면
│   │   ├── sidebar/                      # 좌측 사이드바 관련 컴포넌트
│   │   │   ├── Sidebar.jsx               # 사이드바 전체 레이아웃
│   │   │   └── ChatHistoryItem.jsx       # 채팅 기록 아이템
│   │   ├── map/                          # 지도 관련 컴포넌트
│   │   │   └── BusanMap.jsx              # 부산 지역 지도 UI
│   │   └── ui/                           # 공통 UI 컴포넌트
│   │       ├── MainMenuButtons.jsx       # 메인 메뉴 버튼 세트
│   │       ├── MenuToggle.jsx            # 사이드바 토글 버튼
│   │       ├── QuickLinks.jsx            # 바로가기 버튼 모음
│   │       ├── KeywordButtons.jsx        # 키워드 기반 버튼
│   │       └── ProgramRegionButtons.jsx  # 프로그램 지역 선택 버튼
│   ├── hooks/                            # Custom Hooks 모음
│   │   ├── useDarkMode.js                # 다크모드 상태 관리 Hook
│   │   └── useSidebarState.js            # 사이드바 열림/닫힘 상태 Hook
│   ├── utils/                            # 유틸리티 함수
│   │   ├── constants.js                  # 상수 정의
│   │   └── helpers.js                    # 헬퍼 함수 모음
│   ├── styles/                           # CSS 스타일시트 모음
│   │   ├── variables.css                 # CSS 변수 정의 (테마/색상)
│   │   ├── globals.css                   # 전역 스타일
│   │   ├── responsive.css                # 반응형 스타일
│   │   └── components/                   # 컴포넌트별 스타일 분리
│   │       ├── chat.css                  # 채팅창 전용 스타일
│   │       ├── sidebar.css               # 사이드바 전용 스타일
│   │       ├── ui.css                    # 공통 UI 스타일
│   │       ├── map.css                   # 지도 UI 스타일
│   │       └── space-detail-search.css   # 공간 상세검색 스타일
├── index.html                            # Vite 루트 HTML 엔트리
├── vite.config.js                        # Vite 설정 파일 (빌드/배포 설정)
├── eslint.config.js                      # ESLint 코드 규칙 설정
├── package.json                          # 프로젝트 의존성 및 스크립트 정의
└── README.md                             # 프로젝트 설명 문서
```

---

## 🎨 UX 하이라이트

### 모던 사이드바

* 로고/다크모드/사이드바 토글 버튼 배치
* **대화 히스토리 관리** 및 빠른 재진입
* 데스크톱/모바일 **반응형 최적화**

### 스마트 메뉴 시스템

* **토글 가능** 메인 메뉴(상태에 따라 버튼 레이아웃 자동 조정)
* 호버/포커스 피드백으로 상호작용 명확화

### 강력한 탐색/검색

* **지역별(16개 구·군)** / **카테고리(8종)** / **키워드** 필터
* 공간 → 상세 → 링크 **3단 점프 흐름**(탐색 시간 단축)

---

## 🚀 시작하기

### 요구 사항

* **Node.js 18+ 권장**
* **npm** 또는 **yarn** 또는 **pnpm**

### 설치 & 개발 서버

```bash
# 1) 클론
git clone https://github.com/KT-Busan/busan-chatbot-frontend.git
cd busan-chatbot-frontend

# 2) 패키지 설치
npm install

# 3) 개발 서버 실행 (Vite)
npm run dev
# 브라우저: http://localhost:5173
```

### 프로덕션 빌드 & 미리보기

```bash
# 빌드 산출물: dist/
npm run build

# 빌드 결과 로컬 미리보기
npm run preview
```

---
**부산 청년을 위한 B-BOT과 함께 더 나은 청년 생활을 시작하세요! 🚀**