import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

// 백엔드 PREDEFINED_ANSWERS와 일치하도록 메인 메뉴 수정
const mainMenu = [
    '청년 채용관',
    '청년 공간',
    'Busan Jobs',
    '청년 혜택 모아보기'
];

// 청년 공간 서브 버튼들
const youthSpaceButtons = [
    '부산청년센터',
    '청년두드림카페',
    '소담스퀘어 부산',
    '부산지식산업센터'
];

// Busan Jobs 서브 버튼들
const busanJobsButtons = [
    '취업',
    '창업'
];

// 부산청년센터 서브 버튼들
const busanYouthCenterButtons = [
    '공간소개',
    '이용수칙',
    '대관하기'
];

// 부산청년센터 공간소개 서브 버튼들
const busanYouthCenterSpaceButtons = [
    '부산청년센터 상세',
    '오름라운지 상세'
];

// 청년두드림카페 서브 버튼들
const youthDoDreamButtons = [
    '주요시설 소개',
    '시설 대관'
];

// 소담스퀘어 부산 서브 버튼들
const sodamSquareButtons = [
    '시설안내',
    '시설 이용 예약'
];

// 부산지식산업센터 서브 버튼들
const bkicButtons = [
    '부산지식산업센터 금곡점',
    '부산지식산업센터 우암점'
];

// 부산지식산업센터 금곡점 서브 버튼들
const bkicGeumgokButtons = [
    '입주지원',
    '시설 대여',
    '부산지식산업센터 바로가기'
];

// 부산지식산업센터 우암점 서브 버튼들
const bkicUamButtons = [
    '입주지원',
    '시설 대여',
    '부산지식산업센터 바로가기'
];

const jobServiceButtons = [
    '부산 청끌기업 소개',
    'JOB 성장기업',
    '지역 주도형 청년 일자리 사업',
    '드림 옷장',
    '취업 연수생',
    '청년 프로그램'
];

const quickLinks = [
    {text: "부산경제진흥원 사이트 바로가기", url: "https://www.bepa.kr/kor/view.do?no=1670"},
    {text: "부산청년플랫폼 사이트 바로가기", url: "https://young.busan.go.kr/policySupport/list.nm?menuCd=12"},
    {text: "부산청년센터 사이트 바로가기", url: "https://young.busan.go.kr/bycenter/index.nm"},
];

// 링크 썸네일 정보
const LINK_THUMBNAILS = {
    "https://young.busan.go.kr/policySupport/list.nm": {
        title: "부산청년플랫폼 - 정책지원",
        description: "부산시 청년을 위한 다양한 정책 지원 사업을 확인하세요",
        image: "/thumbnails/busan-youth-platform.jpg",
        domain: "young.busan.go.kr"
    },
    "https://www.bepa.kr/kor/view.do?no=1670": {
        title: "부산경제진흥원",
        description: "부산 경제 발전과 청년 지원을 위한 전문 기관",
        image: "/thumbnails/bepa.jpg",
        domain: "bepa.kr"
    },
    "https://young.busan.go.kr/bycenter/index.nm": {
        title: "부산청년센터",
        description: "청년들을 위한 다양한 공간과 프로그램을 제공합니다",
        image: "/thumbnails/busan-youth-center.jpg",
        domain: "young.busan.go.kr"
    },
    "https://busanjob.net": {
        title: "부산잡 - 부산 채용정보",
        description: "부산 지역 최신 채용공고와 일자리 정보",
        image: "/thumbnails/busanjob.jpg",
        domain: "busanjob.net"
    }
};

// 링크 카드 컴포넌트
const LinkCard = ({url, thumbnail}) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="link-card">
        <div className="link-card-image">
            <img src={thumbnail.image} alt={thumbnail.title}/>
        </div>
        <div className="link-card-content">
            <h4 className="link-card-title">{thumbnail.title}</h4>
            <p className="link-card-description">{thumbnail.description}</p>
            <span className="link-card-domain">{thumbnail.domain}</span>
        </div>
    </a>
);

// 외부 링크 버튼 컴포넌트
const ExternalLinkButton = ({url, text}) => (
    <div style={{marginTop: '16px'}}>
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-btn"
        >
            {text}
        </a>
    </div>
);

// 서브 버튼 컴포넌트
const SubButtons = ({buttons, onButtonClick, title}) => (
    <div className="sub-buttons-container">
        <p className="sub-buttons-title">{title}</p>
        <div className="sub-buttons">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    className="sub-button"
                    onClick={() => onButtonClick(button)}
                >
                    {button}
                </button>
            ))}
        </div>
    </div>
);

// 커스텀 마크다운 렌더러
const CustomMarkdown = ({children, onButtonClick}) => {
    // 청년 공간 응답인지 확인
    const isYouthSpaceResponse = children && children.includes('**청년 공간**에서는 부산 청년들을 위한 다양한 공간을 제공합니다');

    // Busan Jobs 응답인지 확인
    const isBusanJobsResponse = children && children.includes('부산잡스(Busan Jobs)를 소개해드릴게요');

    // 취업 서비스 응답인지 확인
    const isJobServiceResponse = children && children.includes('부산잡스에서 제공하는 취업 서비스로는 총 6가지가 있습니다');

    // 부산청년센터 상세 응답인지 확인
    const isBusanYouthCenterResponse = children && children.includes('부산청년센터는 \'부산청년센터\'와 \'오름라운지\' 두 공간으로 운영되며');

    // 부산청년센터 공간소개 응답인지 확인
    const isBusanYouthCenterSpaceIntroResponse = children && children.includes('부산청년센터 공간을 소개해드릴게요');

    // 부산청년센터 상세 공간 정보 응답인지 확인
    const isBusanYouthCenterDetailResponse = children && children.includes('**부산청년센터**는 **3층 \'들락\'과 4층 \'날락\'**으로 나뉘며');

    // 오름라운지 상세 공간 정보 응답인지 확인
    const isOreumLoungeDetailResponse = children && children.includes('**오름라운지**는 **자율공간, 회의실, 서점, 창작소**로 크게 4가지로 나눠져요');

    // 청년두드림카페 상세 응답인지 확인
    const isYouthDoDreamResponse = children && children.includes('똑똑, 청년들의 꿈을 Do dream!');

    // 소담스퀘어 부산 상세 응답인지 확인
    const isSodamSquareResponse = children && children.includes('으랏차차 부산소상공인 여러분~');

    // 부산지식산업센터 상세 응답인지 확인 (조건 완화)
    const isBKICResponse = children && (
        children.includes('BKIC 부산지식산업센터') ||
        children.includes('부산지식산업센터는 부산광역시가 지원하고') ||
        children.includes('도심형 멀티콤플렉스 산업단지')
    );

    // 청년두드림카페 주요시설 소개 응답인지 확인
    const isYouthDoDreamFacilityResponse = children && children.includes('**청년두드림센터**의 **주요시설**을 소개해드릴게요');

    // 소담스퀘어 부산 시설안내 응답인지 확인
    const isSodamSquareFacilityResponse = children && children.includes('●** 라운지**');

    // 부산지식산업센터 금곡점 응답인지 확인
    const isBKICGeumgokResponse = children && children.includes('**부산지식산업센터 금곡점**에 대한 정보입니다');

    // 부산지식산업센터 우암점 응답인지 확인
    const isBKICUamResponse = children && children.includes('**부산지식산업센터 우암점**에 대한 정보입니다');

    // 링크를 감지하고 썸네일 카드로 변환
    const renderWithLinkCards = (text) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            // 링크 앞의 텍스트 추가
            if (match.index > lastIndex) {
                parts.push(
                    <ReactMarkdown key={`text-${lastIndex}`}>
                        {text.slice(lastIndex, match.index)}
                    </ReactMarkdown>
                );
            }

            const linkText = match[1];
            const linkUrl = match[2];
            const thumbnail = LINK_THUMBNAILS[linkUrl];

            if (thumbnail) {
                // 썸네일 카드로 렌더링
                parts.push(
                    <LinkCard key={`card-${match.index}`} url={linkUrl} thumbnail={thumbnail}/>
                );
            } else {
                // 일반 링크로 렌더링
                parts.push(
                    <a key={`link-${match.index}`} href={linkUrl} target="_blank" rel="noopener noreferrer">
                        {linkText}
                    </a>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        // 남은 텍스트 추가
        if (lastIndex < text.length) {
            parts.push(
                <ReactMarkdown key={`text-${lastIndex}`}>
                    {text.slice(lastIndex)}
                </ReactMarkdown>
            );
        }

        return parts.length > 0 ? parts : (
            <ReactMarkdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                }}
            >
                {text}
            </ReactMarkdown>
        );
    };

    return (
        <div className="custom-markdown">
            {isYouthSpaceResponse ? (
                <>
                    <ReactMarkdown>
                        🏢 **청년 공간**에서는 부산 청년들을 위한 다양한 공간을 제공합니다!
                    </ReactMarkdown>
                    <SubButtons
                        buttons={youthSpaceButtons}
                        onButtonClick={onButtonClick}
                        title="아래의 버튼을 클릭하여 어떤 공간이 있는지 확인해보세요"
                    />
                </>
            ) : isBusanJobsResponse ? (
                <>
                    <ReactMarkdown>
                        {`부산잡스(Busan Jobs)를 소개해드릴게요. 부산잡스는 부산 청년을 위한 일자리 탐색 서비스예요. 부산시의 다양한 기업을 소개하며 공공기관 행정 체험, 다양한 청년 활동 프로그램을 운영하고 있어요.

B-Bot은 부산 청년의 꿈과 희망이 모두 이루어지길 응원하고 있습니다!

부산잡스에서 제공하는 서비스로는 취업 지원, 창업 지원이 있어요. 어떤 부분이 더 궁금한가요?`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={busanJobsButtons}
                        onButtonClick={onButtonClick}
                        title="관심 있는 서비스를 선택해주세요"
                    />
                </>
            ) : isJobServiceResponse ? (
                <>
                    <ReactMarkdown>
                        {`부산잡스에서 제공하는 취업 서비스로는 총 6가지가 있습니다.

**1. 부산 청끌기업 소개**
• 청년의 눈높이에 부합하며, 청년이 일하고 싶어하는 기업. 이것을 청년이 끌리는 기업, 청끌 기업이라고 합니다.
• 현재 110개의 청끌 기업이 있어요.

**2. JOB 성장기업**
• 청년 친화 구인기업을 발굴하고 기업 정보를 제공해드려요.
• 현재 237개의 JOB 성장기업이 있어요.

**3. 지역 주도형 청년 일자리 사업**
• 만 39세 이하 청년의 부산 정착을 위한 일자리와 임금, 창업지원금을 제공합니다.

**4. 드림 옷장**
• 구직 청년을 위해 면접 정장 무료 대여 서비스를 제공합니다.
• 만 15세~만39세 주소가 부산인 취업 준비 청년이라면 누구든 이용 가능!

**5. 취업 연수생**
• 부산 거주 미취업 청년을 대상으로 공공기관에서 일정 기간 행정 체험을 할 수 있습니다.

**6. 청년 프로그램**
• 부산 청년들에게 다양한 경험을 지원하는 프로그램을 보여줍니다.

6가지 메뉴 중 어느 것에 대해 더 알아보고 싶은가요?`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={jobServiceButtons}
                        onButtonClick={onButtonClick}
                        title="관심 있는 서비스를 선택해주세요"
                    />
                </>
            ) : isBusanYouthCenterResponse ? (
                <>
                    <ReactMarkdown>
                        {`부산청년센터는 '부산청년센터'와 '오름라운지' 두 공간으로 운영되며, 청년이라면 누구나 회의, 스터디, 행사 등 다양한 목적에 맞춰 공간을 대관하실 수 있어요.

📍 **부산청년센터**: 부산광역시 중구 자갈치해안로 52, 3,4층
📍 **오름라운지**: 부산광역시 중구 중앙대로 17 A67

📌 일부 공간은 청년 대상 행사일 경우에만 대관이 가능하니 참고해 주세요.
📌 또한, 종교나 정치 활동과 같은 목적은 사용이 불가합니다.`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={busanYouthCenterButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 정보를 선택해주세요"
                    />
                </>
            ) : isBusanYouthCenterSpaceIntroResponse ? (
                <>
                    <ReactMarkdown>
                        부산청년센터 공간을 소개해드릴게요! 어떤 공간이 궁금하신가요?
                    </ReactMarkdown>
                    <SubButtons
                        buttons={busanYouthCenterSpaceButtons}
                        onButtonClick={onButtonClick}
                        title="궁금한 공간을 선택해주세요"
                    />
                </>
            ) : isBusanYouthCenterDetailResponse ? (
                <>
                    <ReactMarkdown>
                        {`**부산청년센터**는 **3층 '들락'과 4층 '날락'**으로 나뉘며, 필요에 따라 공간을 선택하실 수 있어요.

📍 **3층 들락**
● **모락마루** (15명 이내): 회의와 공유주방이 함께 있는 소규모 모임 공간
● **이야기마루 1·2** (10명 이내): 회의 또는 화상 회의용
● **만날마루** (50명 이내): 대형 강연이나 워크숍에 적합한 개방형 공간

📍 **4층 날락**
● **우당탕 다목적실** (40명 이내): 강의나 발표 등 중형 행사에 적합
● **이야기마루 3** (10명 이내): 회의 및 화상 회의 가능
● **함께마루** (6명 이내): 소규모 스터디나 팀 회의`}
                    </ReactMarkdown>
                    <ExternalLinkButton
                        url="https://young.busan.go.kr/bycenter/index.nm?menuCd=131"
                        text="[부산청년센터] 공간소개 바로가기"
                    />
                </>
            ) : isOreumLoungeDetailResponse ? (
                <>
                    <ReactMarkdown>
                        {`**오름라운지**는 **자율공간, 회의실, 서점, 창작소**로 크게 4가지로 나눠져요.
**오름라운지**는 **부산청년리빙랩 띵두 & 뿌리**라고도 불러요.

● **자율공간** (50명 이내): 넓은 공간이 필요한 행사에 적합한 공간
● **회의실 2·3** (10명 이내): 독립된 회의 공간이 필요한 모임에 적합
● **서점** (15명 이내): 예약없이 자유롭게 찾아와서 이용 가능한 스터디룸
● **창작소** (6명 이내): 독립된 회의 공간이 필요한 모임에 적합`}
                    </ReactMarkdown>
                    <ExternalLinkButton
                        url="https://young.busan.go.kr/bycenter/index.nm?menuCd=155"
                        text="[오름라운지] 공간소개 바로가기"
                    />
                </>
            ) : isYouthDoDreamResponse ? (
                <>
                    <ReactMarkdown>
                        {`똑똑, 청년들의 꿈을 Do dream!
**청년두드림센터**는 청년을 위한 공유공간이에요!
스터디, 회의, 문화활동 등 다양한 모임을 위한 커뮤니티 공간을 무료로 대여할 수 있어요.😊

📍 위치: 부산 부산진구 가야대로 772, 롯데백화점 별관 2층
⏰ 운영시간: 월~금 10:00 ~ 21:00 / 토 10:00 ~ 19:00
📞 전화번호: 051-600-1350`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={youthDoDreamButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 정보를 선택해주세요"
                    />
                </>
            ) : isSodamSquareResponse ? (
                <>
                    <ReactMarkdown>
                        {`으랏차차 부산소상공인 여러분~
**소담스퀘어 부산**은 급변하는 디지털전환에 어려움을 겪고 있는 소상공인 여러분을 위한 **라이브커머스 맞춤형 지원 공간**입니다.
온라인 판로진출 교육부터 상세페이지제작, 라이브커머스, 장비 및 스튜디오 대여 등 '디지털비즈니스'의 토탈 솔루션을 제공합니다.😊

📍 위치: 부산광역시 동구 부산진성공원로23 KT남부산지사 18층
⏰ 운영시간: 월~금 10:00 ~ 18:00, 12:00 ~ 13:00 휴게시 / 토~일: 정기휴무
📞 전화번호: 051-600-1367`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={sodamSquareButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 정보를 선택해주세요"
                    />
                </>
            ) : isYouthDoDreamFacilityResponse ? (
                <>
                    <ReactMarkdown>
                        {`**청년두드림센터**의 **주요시설**을 소개해드릴게요.

● 대회의실
● 휴식공간
● 소회의실
● 상담실
● 열린공간
● 부산 청년JOB 성장 카페

🔍 홈페이지에 들어가셔서 아래로 스크롤하시면 공간별 대관 시간과 수용 인원을 확인할 수 있어요!
👀 각 공간 소개 안에 있는 'VR보기' 버튼을 누르면, 해당 공간을 미리 둘러볼 수도 있답니다.`}
                    </ReactMarkdown>
                    <ExternalLinkButton
                        url="https://www.busanjob.net/08_wyou/wyou10.asp#a"
                        text="[청년두드림센터] 홈페이지 바로가기"
                    />
                </>
            ) : isSodamSquareFacilityResponse ? (
                <>
                    <ReactMarkdown>
                        {`●** 라운지**
👉 방문자 휴식과 커뮤니티 교류를 위한 열린 소통 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_07.php)

● **공유 오피스**
👉 입주자 간 협업과 독립 업무가 모두 가능한 소상공인 맞춤형 사무 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_06.php)

● **편집실**
👉 영상 편집과 콘텐츠 후반 작업을 위한 장비가 구비된 작업 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_05.php)

● **녹음실**
👉 음성 콘텐츠, 나레이션, 더빙 작업에 적합한 고음질 전용 녹음 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_04.php)

● **1인 미디어 스튜디오**
👉 1인 크리에이터를 위한 조명·촬영·송출 시스템이 갖춰진 방송 제작 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_03.php)

● **뷰티 스튜디오**
👉 뷰티 관련 라이브커머스, 촬영, 뷰티 시연이 가능한 전용 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_02.php)

● **쿠킹 스튜디오**
👉 라이브 방송이나 요리 콘텐츠 제작이 가능한 조리 전문 촬영 공간 (https://www.bssodam.or.kr/kor/05_facilty/faci_01.php)`}
                    </ReactMarkdown>
                </>
            ) : isBKICGeumgokResponse ? (
                <>
                    <ReactMarkdown>
                        **부산지식산업센터 금곡점**에 대한 정보입니다.
                    </ReactMarkdown>
                    <SubButtons
                        buttons={bkicGeumgokButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 서비스를 선택해주세요"
                    />
                </>
            ) : isBKICUamResponse ? (
                <>
                    <ReactMarkdown>
                        **부산지식산업센터 우암점**에 대한 정보입니다.
                    </ReactMarkdown>
                    <SubButtons
                        buttons={bkicUamButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 서비스를 선택해주세요"
                    />
                </>
            ) : isBKICResponse ? (
                <>
                    <ReactMarkdown>
                        {`**BKIC 부산지식산업센터**는 부산광역시가 지원하고 부산경제진흥원이 운영하는 도심형 멀티콤플렉스 산업단지입니다.

📍 **부산지식산업센터 금곡**: 부산광역시 북구 효열로 111번길(부산광역시 북구 금곡동 812-8번지)
⏰ 운영시간: 평일 09:00 ~ 17:59 | 주말미운영 | 점심 미운영
📞 대표 전화: 051-717-3658

📍 **부산지식산업센터 우암**: 부산광역시 남구 신선로 2(부산광역시 남구 우암동 301)
⏰ 운영시간: 평일 09:00 ~ 17:59 | 주말미운영 | 점심 12:00 ~ 12:59
📞 대표 전화: 051-600-1837~8`}
                    </ReactMarkdown>
                    <SubButtons
                        buttons={bkicButtons}
                        onButtonClick={onButtonClick}
                        title="원하는 센터를 선택해주세요"
                    />
                </>
            ) : (
                renderWithLinkCards(children)
            )}
        </div>
    );
};

// 중앙 정렬될 환영 메시지 컴포넌트
const WelcomeScreen = () => (
    <div className="welcome-screen">
        <img src={botProfileImage} alt="B-BOT Profile" className="welcome-profile-pic"/>
        <strong className="gradient-text">B-BOT</strong>
        <span className="gradient-text">For the Youth in Busan</span>
        <p className="welcome-subtitle">
            안녕하세요! 부산 청년을 위한 정책 및 일자리 정보 전문가 B-BOT입니다.<br/>
            채용정보, 지원사업, 청년센터 이용 등 무엇이든 물어보세요! 🚀
        </p>
    </div>
);

function ChatWindow({
                        chat,
                        onSendMessage,
                        isThinking,
                        onToggleSidebar,
                        isSidebarCollapsed,
                        isMobile
                    }) {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    const handleButtonClick = (text) => {
        // 직접 링크로 이동하는 버튼들
        if (text === '이용수칙') {
            window.open('https://young.busan.go.kr/bycenter/index.nm?menuCd=158', '_blank');
            return;
        }

        if (text === '대관하기') {
            window.open('https://young.busan.go.kr/bycenter/centerPlace/list.nm?menuCd=132', '_blank');
            return;
        }

        if (text === '시설 대관') {
            window.open('https://busanjob.net/08_wyou/wyou10_3_2.asp', '_blank');
            return;
        }

        if (text === '시설 이용 예약') {
            window.open('https://www.bssodam.or.kr/kor/05_facilty/01.php', '_blank');
            return;
        }

        // 공간소개 버튼 클릭 시 특별 처리
        if (text === '공간소개') {
            onSendMessage(text);
            return;
        }

        // 주요시설 소개 버튼 클릭 시 특별 처리
        if (text === '주요시설 소개') {
            onSendMessage(text);
            return;
        }

        // 시설안내 버튼 클릭 시 특별 처리
        if (text === '시설안내') {
            onSendMessage(text);
            return;
        }

        // 부산지식산업센터 금곡점 상세 정보
        if (text === '부산지식산업센터 금곡점') {
            onSendMessage(text);
            return;
        }

        // 부산지식산업센터 우암점 상세 정보
        if (text === '부산지식산업센터 우암점') {
            onSendMessage(text);
            return;
        }

        // 부산청년센터 상세 정보
        if (text === '부산청년센터 상세') {
            const detailMessage = {
                sender: 'bot',
                text: `**부산청년센터**는 **3층 '들락'과 4층 '날락'**으로 나뉘며, 필요에 따라 공간을 선택하실 수 있어요.

📍 **3층 들락**
● **모락마루** (15명 이내): 회의와 공유주방이 함께 있는 소규모 모임 공간
● **이야기마루 1·2** (10명 이내): 회의 또는 화상 회의용
● **만날마루** (50명 이내): 대형 강연이나 워크숍에 적합한 개방형 공간

📍 **4층 날락**
● **우당탕 다목적실** (40명 이내): 강의나 발표 등 중형 행사에 적합
● **이야기마루 3** (10명 이내): 회의 및 화상 회의 가능
● **함께마루** (6명 이내): 소규모 스터디나 팀 회의`
            };
            onSendMessage(text);
            return;
        }

        // 오름라운지 상세 정보
        if (text === '오름라운지 상세') {
            const detailMessage = {
                sender: 'bot',
                text: `**오름라운지**는 **자율공간, 회의실, 서점, 창작소**로 크게 4가지로 나눠져요.
**오름라운지**는 **부산청년리빙랩 띵두 & 뿌리**라고도 불러요.

● **자율공간** (50명 이내): 넓은 공간이 필요한 행사에 적합한 공간
● **회의실 2·3** (10명 이내): 독립된 회의 공간이 필요한 모임에 적합
● **서점** (15명 이내): 예약없이 자유롭게 찾아와서 이용 가능한 스터디룸
● **창작소** (6명 이내): 독립된 회의 공간이 필요한 모임에 적합`
            };
            onSendMessage(text);
            return;
        }

        // 일반적인 버튼 클릭 처리
        onSendMessage(text);
    };

    return (
        <div className="chat-window">
            {chat.messages.length > 0 && (
                <header className="chat-header">
                    <button
                        className="hamburger-btn"
                        onClick={onToggleSidebar}
                        title={isSidebarCollapsed ? '사이드바 열기' : '사이드바 닫기'}
                        aria-label={isSidebarCollapsed ? '사이드바 열기' : '사이드바 닫기'}
                    >
                        {isSidebarCollapsed ? '☰' : '✕'}
                    </button>

                    <img src={botProfileImage} alt="Bot Profile" className="header-profile-pic"/>
                    <div className="header-title">
                        <strong>B-BOT</strong>
                        <span>For the Youth in Busan</span>
                    </div>
                </header>
            )}

            <div className="chat-messages" ref={chatContainerRef}>
                {chat.messages.length === 0 ? (
                    <WelcomeScreen/>
                ) : (
                    chat.messages.map((msg, index) => (
                        <div key={index}
                             className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                            <div className="message-content">
                                {msg.sender === 'bot' && (
                                    <img src={botProfileImage} alt="Bot Profile" className="message-profile-pic"/>
                                )}
                                <div className="message-bubble">
                                    {/* 생각 중 메시지인지 확인 */}
                                    {msg.isThinking ? (
                                        <div className="thinking-indicator">
                                            <span>B-BOT이 생각하고 있어요</span>
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    ) : (
                                        <CustomMarkdown onButtonClick={handleButtonClick}>
                                            {msg.text}
                                        </CustomMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 메인 메뉴 - 백엔드 PREDEFINED_ANSWERS와 일치 */}
            <div className="main-menu-container">
                {mainMenu.map((item, index) => (
                    <button key={index} className="main-menu-btn" onClick={() => handleButtonClick(item)}>
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            {/* 외부 링크들 */}
            <div className="quick-replies-container">
                {quickLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quick-reply-link"
                    >
                        <span className="gradient-text">{link.text}</span>
                    </a>
                ))}
            </div>

            <ChatInput onSendMessage={onSendMessage} disabled={isThinking}/>
        </div>
    );
}

export default ChatWindow;