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
    '소담스퀘어'
];

// 하단 링크들은 그대로 유지
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
    const isYouthSpaceResponse = children && children.includes('청년 공간에서는 부산 청년들을 위한 다양한');

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

function ChatWindow({chat, onSendMessage, isThinking}) {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    const handleButtonClick = (text) => {
        onSendMessage(text);
    };

    return (
        <div className="chat-window">
            {chat.messages.length > 0 && (
                <header className="chat-header">
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