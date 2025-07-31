import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import BusanMap from './BusanMap';
import botProfileImage from '../assets/bot-profile.png';

// 메인 메뉴 버튼 목록 (청년 공간 특화)
const mainMenu = [
    '지역별 확인하기',
    '키워드별 확인하기',
    '청년 공간 프로그램 확인하기',
    '청년 공간 예약'
];

// 하단 고정 외부 링크 목록
const quickLinks = [
    {text: "부산청년플랫폼 바로가기", url: "https://young.busan.go.kr/bycenter/index.nm"},
    {text: "부산청년센터 바로가기", url: "https://young.busan.go.kr/bycenter/index.nm"},
    {text: "부산경제진흥원 바로가기", url: "https://www.bepa.kr/kor/view.do?no=1670"},
];

// 마크다운을 렌더링하고 특정 마커에 따라 컴포넌트를 표시하는 함수
const CustomMarkdown = ({children, onButtonClick, spacesData}) => {
    // 텍스트에서 마커([MARKER_NAME])를 제거하는 함수
    const removeMarker = (text) => {
        return text.replace(/\[[\w_]+\]/g, '');
    };

    // children이 없으면 null 반환
    if (!children) return null;

    // 지역별 확인하기 마커 확인 및 지도 컴포넌트 표시
    if (children.includes('[REGION_MAP]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {removeMarker(children)}
                </ReactMarkdown>
                <BusanMap
                    onRegionClick={onButtonClick}
                    spacesData={spacesData}
                />
            </div>
        );
    }

    // 마커가 없는 경우 기본 마크다운 렌더링
    return (
        <div className="custom-markdown">
            <ReactMarkdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

// 채팅 시작 시 표시되는 환영 화면 컴포넌트
const WelcomeScreen = () => (
    <div className="welcome-screen">
        <img src={botProfileImage} alt="B-BOT Profile" className="welcome-profile-pic"/>
        <strong className="gradient-text">B-BOT</strong>
        <span className="gradient-text">For the Youth in Busan</span>
        <p className="welcome-subtitle">
            안녕하세요! 부산 청년 공간을 알리는 B-BOT입니다!<br/>
            청년 공간 관련 궁금하신 내용을 무엇이든 물어보세요! 🚀
        </p>
    </div>
);

// 메인 채팅 창 컴포넌트
function ChatWindow({
                        chat, // 채팅 메시지 배열
                        onSendMessage, // 메시지 전송 함수
                        isThinking, // 봇 응답 대기 상태
                        onToggleSidebar, // 사이드바 토글 함수
                        isSidebarCollapsed, // 사이드바 접힘 상태
                        isMobile, // 모바일 여부
                        spacesData // 청년공간 크롤링 데이터
                    }) {
    const chatContainerRef = useRef(null); // 채팅 컨테이너 스크롤 제어용 ref

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    // 버튼 클릭 처리 함수
    const handleButtonClick = (text) => {
        // 모든 버튼 클릭을 onSendMessage로 전달
        onSendMessage(text);
    };

    return (
        <div className="chat-window">
            {/* 메시지가 있을 때만 헤더 표시 */}
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

            {/* 채팅 메시지 영역 */}
            <div className="chat-messages" ref={chatContainerRef}>
                {chat.messages.length === 0 ? (
                    <WelcomeScreen/>
                ) : (
                    chat.messages.map((msg, index) => (
                        <div key={index}
                             className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                            <div className="message-content">
                                {/* 봇 메시지일 때만 프로필 이미지 표시 */}
                                {msg.sender === 'bot' && (
                                    <img src={botProfileImage} alt="Bot Profile" className="message-profile-pic"/>
                                )}
                                <div className="message-bubble">
                                    {/* 생각 중 상태 또는 일반 메시지 렌더링 */}
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
                                        <CustomMarkdown
                                            onButtonClick={handleButtonClick}
                                            spacesData={spacesData}
                                        >
                                            {msg.text}
                                        </CustomMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 메인 메뉴 버튼들 */}
            <div className="main-menu-container">
                {mainMenu.map((item, index) => (
                    <button key={index} className="main-menu-btn" onClick={() => handleButtonClick(item)}>
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            {/* 하단 고정 외부 링크들 */}
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

            {/* 채팅 입력 컴포넌트 */}
            <ChatInput onSendMessage={onSendMessage} disabled={isThinking}/>
        </div>
    );
}

export default ChatWindow;