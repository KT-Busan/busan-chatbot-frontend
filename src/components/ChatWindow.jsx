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

// 추가 빠른 답변 버튼들 제거

// 하단 링크들은 그대로 유지
const quickLinks = [
    {text: "부산경제진흥원 사이트 바로가기", url: "https://www.bepa.kr/kor/view.do?no=1670"},
    {text: "부산청년플랫폼 사이트 바로가기", url: "https://young.busan.go.kr/policySupport/list.nm?menuCd=12"},
    {text: "부산청년센터 사이트 바로가기", url: "https://young.busan.go.kr/bycenter/index.nm"},
];

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
                                        <ReactMarkdown
                                            components={{
                                                a: ({node, ...props}) => <a {...props} target="_blank"
                                                                            rel="noopener noreferrer"/>
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
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