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

// 창업 지원 서비스 서브 버튼들
const startupServiceButtons = [
    '지역주도형 청년 일자리 사업',
    '청년 로컬 크리에이터 레벨업 사업',
    '청년 프로그램'
];

// 청년 혜택 모아보기 1단계 버튼들
const youthBenefitsButtons = [
    '나에게 맞는 지원 찾기',
    '관심있는 분야만 보기',
    '대상자별 지원 찾기',
    '전체 사업 목록 보기'
];

// 나에게 맞는 지원 찾기 - 조건 선택 버튼들
const supportFinderButtons = [
    '대학생이에요',
    '현재 무직이에요',
    '고용보험 가입자에요',
    '청년 구직자에요'
];

// 관심있는 분야만 보기 - 분야 선택 버튼들
const interestFieldButtons = [
    '문화/여가',
    '교통',
    '생활',
    '주거',
    '저축지원'
];

// 대상자별 지원 찾기 - 유형 선택 버튼들
const targetGroupButtons = [
    '대학생',
    '청년',
    '보호종료아동',
    '기초수급자',
    '장애인'
];

// 청년 채용관 서브 버튼들
const youthRecruitmentButtons = [
    '기업 채용',
    '공공 채용',
    '해외 채용'
];

// 부산 지역 목록
const busanDistricts = [
    '중구', '동구', '서구', '영도구', '부산진구', '동래구',
    '연제구', '금정구', '북구', '사상구', '사하구', '강서구',
    '남구', '해운대구', '수영구', '기장군'
];

const jobServiceButtons = [
    '부산 청끌기업 소개',
    'JOB 성장기업',
    '지역 주도형 청년 일자리 사업',
    '드림 옷장',
    '취업 연수생',
    '청년 프로그램'
];

// 지역 주도형 청년일자리사업 서브 버튼들
const regionalYouthJobButtons = [
    '자세히 알아보기',
    '모집 공고 보러 가기'
];

// 드림 옷장 서브 버튼들
const dreamClothesButtons = [
    '드림 옷장 자세히 알아보기',
    '드림 옷장 신청'
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

// 지역 선택 드롭다운 컴포넌트
const DistrictSelector = ({onSelect, title, recruitmentType}) => {
    const handleChange = (e) => {
        const selectedDistrict = e.target.value;
        if (selectedDistrict) {
            onSelect(`${selectedDistrict}_${recruitmentType}`);
        }
    };

    return (
        <div className="district-selector-container">
            <p className="sub-buttons-title">{title}</p>
            <select
                className="district-selector"
                onChange={handleChange}
                defaultValue=""
            >
                <option value="" disabled>지역을 선택해주세요</option>
                {busanDistricts.map((district, index) => (
                    <option key={index} value={district}>
                        {district}
                    </option>
                ))}
            </select>
        </div>
    );
};

// 해외 채용 국가 입력 컴포넌트
const CountryInput = ({onSubmit, title}) => {
    const [country, setCountry] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (country.trim()) {
            onSubmit(country.trim());
            setCountry('');
        }
    };

    return (
        <div className="country-input-container">
            <p className="sub-buttons-title">{title}</p>
            <form onSubmit={handleSubmit} className="country-input-form">
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="예: 미국, 일본, 싱가포르..."
                    className="country-input"
                />
                <button type="submit" className="country-submit-btn">
                    검색
                </button>
            </form>
        </div>
    );
};

// 커스텀 마크다운 렌더러 - 마커 기반으로 단순화
const CustomMarkdown = ({children, onButtonClick}) => {
    // 마커를 제거한 텍스트를 가져오는 함수
    const removeMarker = (text) => {
        return text.replace(/\[[\w_]+\]/g, '');
    };

    // 링크를 감지하고 썸네일 카드로 변환
    const renderWithLinkCards = (text) => {
        const cleanText = removeMarker(text);
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(cleanText)) !== null) {
            // 링크 앞의 텍스트 추가
            if (match.index > lastIndex) {
                parts.push(
                    <ReactMarkdown key={`text-${lastIndex}`}>
                        {cleanText.slice(lastIndex, match.index)}
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
        if (lastIndex < cleanText.length) {
            parts.push(
                <ReactMarkdown key={`text-${lastIndex}`}>
                    {cleanText.slice(lastIndex)}
                </ReactMarkdown>
            );
        }

        return parts.length > 0 ? parts : (
            <ReactMarkdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                }}
            >
                {cleanText}
            </ReactMarkdown>
        );
    };

    // 마커 기반 조건 확인
    if (!children) return null;

    // 청년 공간 마커
    if (children.includes('[YOUTH_SPACE]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={youthSpaceButtons}
                    onButtonClick={onButtonClick}
                    title="아래의 버튼을 클릭하여 어떤 공간이 있는지 확인해보세요"
                />
            </div>
        );
    }

    // 청년 채용관 마커
    if (children.includes('[YOUTH_RECRUITMENT]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={youthRecruitmentButtons}
                    onButtonClick={onButtonClick}
                    title="관심 있는 채용 유형을 선택해주세요"
                />
            </div>
        );
    }

    // 기업 채용 지역 선택 마커
    if (children.includes('[COMPANY_RECRUITMENT]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <DistrictSelector
                    onSelect={onButtonClick}
                    title="지역을 선택해주세요"
                    recruitmentType="기업"
                />
            </div>
        );
    }

    // 공공 채용 지역 선택 마커
    if (children.includes('[PUBLIC_RECRUITMENT]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <DistrictSelector
                    onSelect={onButtonClick}
                    title="지역을 선택해주세요"
                    recruitmentType="공공"
                />
            </div>
        );
    }

    // 해외 채용 국가 입력 마커
    if (children.includes('[OVERSEAS_RECRUITMENT]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <CountryInput
                    onSubmit={(country) => onButtonClick(`해외_${country}`)}
                    title="관심 있는 국가를 입력해주세요"
                />
            </div>
        );
    }

    // Busan Jobs 마커
    if (children.includes('[BUSAN_JOBS]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={busanJobsButtons}
                    onButtonClick={onButtonClick}
                    title="관심 있는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 취업 서비스 마커
    if (children.includes('[JOB_SERVICES]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={jobServiceButtons}
                    onButtonClick={onButtonClick}
                    title="관심 있는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 창업 서비스 마커
    if (children.includes('[STARTUP_SERVICES]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={startupServiceButtons}
                    onButtonClick={onButtonClick}
                    title="관심 있는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 청년 혜택 모아보기 마커
    if (children.includes('[YOUTH_BENEFITS]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={youthBenefitsButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 방식을 선택해주세요"
                />
            </div>
        );
    }

    // 나에게 맞는 지원 찾기 마커
    if (children.includes('[MY_SUPPORT_FINDER]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={supportFinderButtons}
                    onButtonClick={onButtonClick}
                    title="해당하는 조건을 선택해주세요"
                />
            </div>
        );
    }

    // 관심있는 분야만 보기 마커
    if (children.includes('[INTEREST_FIELD]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={interestFieldButtons}
                    onButtonClick={onButtonClick}
                    title="관심 있는 분야를 선택해주세요"
                />
            </div>
        );
    }

    // 대상자별 지원 찾기 마커
    if (children.includes('[TARGET_GROUP_FINDER]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={targetGroupButtons}
                    onButtonClick={onButtonClick}
                    title="해당하는 유형을 선택해주세요"
                />
            </div>
        );
    }

    // 부산청년센터 마커
    if (children.includes('[BUSAN_YOUTH_CENTER]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={busanYouthCenterButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 정보를 선택해주세요"
                />
            </div>
        );
    }

    // 부산청년센터 공간소개 마커
    if (children.includes('[BUSAN_YOUTH_CENTER_SPACE_INTRO]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={busanYouthCenterSpaceButtons}
                    onButtonClick={onButtonClick}
                    title="궁금한 공간을 선택해주세요"
                />
            </div>
        );
    }

    // 부산청년센터 상세 마커
    if (children.includes('[BUSAN_YOUTH_CENTER_DETAIL]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <ExternalLinkButton
                    url="https://young.busan.go.kr/bycenter/index.nm?menuCd=131"
                    text="[부산청년센터] 공간소개 바로가기"
                />
            </div>
        );
    }

    // 오름라운지 상세 마커
    if (children.includes('[OREUM_LOUNGE_DETAIL]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <ExternalLinkButton
                    url="https://young.busan.go.kr/bycenter/index.nm?menuCd=155"
                    text="[오름라운지] 공간소개 바로가기"
                />
            </div>
        );
    }

    // 청년두드림카페 마커
    if (children.includes('[YOUTH_DODREAM]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={youthDoDreamButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 정보를 선택해주세요"
                />
            </div>
        );
    }

    // 청년두드림카페 시설 마커
    if (children.includes('[YOUTH_DODREAM_FACILITY]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <ExternalLinkButton
                    url="https://www.busanjob.net/08_wyou/wyou10.asp#a"
                    text="[청년두드림센터] 홈페이지 바로가기"
                />
            </div>
        );
    }

    // 소담스퀘어 부산 마커
    if (children.includes('[SODAM_SQUARE]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={sodamSquareButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 정보를 선택해주세요"
                />
            </div>
        );
    }

    // 부산지식산업센터 마커
    if (children.includes('[BKIC]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={bkicButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 센터를 선택해주세요"
                />
            </div>
        );
    }

    // 부산지식산업센터 금곡점 마커
    if (children.includes('[BKIC_GEUMGOK]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={bkicGeumgokButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 부산지식산업센터 우암점 마커
    if (children.includes('[BKIC_UAM]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={bkicUamButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 지역 주도형 청년일자리사업 마커
    if (children.includes('[REGIONAL_YOUTH_JOB]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={regionalYouthJobButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 정보를 선택해주세요"
                />
            </div>
        );
    }

    // 드림 옷장 마커
    if (children.includes('[DREAM_CLOTHES]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown>{removeMarker(children)}</ReactMarkdown>
                <SubButtons
                    buttons={dreamClothesButtons}
                    onButtonClick={onButtonClick}
                    title="원하는 서비스를 선택해주세요"
                />
            </div>
        );
    }

    // 기본 렌더링 (마커가 없는 경우)
    return (
        <div className="custom-markdown">
            {renderWithLinkCards(children)}
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

        if (text === '자세히 알아보기') {
            window.open('https://busanjob.net/08_wyou/wyou01_0.asp', '_blank');
            return;
        }

        if (text === '모집 공고 보러 가기') {
            window.open('https://busanjob.net/08_wyou/wyou01_2_1.asp', '_blank');
            return;
        }

        if (text === '드림 옷장 자세히 알아보기') {
            window.open('https://busanjob.net/08_wyou/wyou08_1.asp', '_blank');
            return;
        }

        if (text === '드림 옷장 신청') {
            window.open('https://busanjob.net/08_wyou/wyou08_2_write.asp', '_blank');
            return;
        }

        // 지역별 채용 정보 처리
        if (text.includes('_기업') || text.includes('_공공')) {
            onSendMessage(text);
            return;
        }

        // 해외 채용 처리
        if (text.startsWith('해외_')) {
            const country = text.substring(3);
            // 해외 채용은 예시 답변으로 처리
            onSendMessage(`${country} 채용 정보(상위 3개) 결과입니다.\n\n예시 답변입니다.\n더 많은 해외 채용 정보를 찾으시나요? [더보기](https://www.busanjob.net/01_emif/emif01.asp)`);
            return;
        }

        // 일반적인 버튼 클릭 처리 - 모든 버튼을 onSendMessage로 전달
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