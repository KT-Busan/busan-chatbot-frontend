import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

// 상단 메인 메뉴 버튼
const mainMenu = [
    {text: '청년 지원 정책 메뉴', image: botProfileImage},
    {text: '부산 청년 센터 메뉴', image: botProfileImage},
    {text: '부산 청년 센터 장소 대여 메뉴', image: botProfileImage},
];

// 하단 추천 질문 버튼
const quickReplies = [
    '청년 센터 일정',
    '청년 센터 이용 수칙',
    '청년 센터 운영 시간',
    'FAQ'
];

// 중앙 정렬될 환영 메시지 컴포넌트
const WelcomeScreen = () => (
    <div className="welcome-screen">
        <img src={botProfileImage} alt="Bot Profile" className="welcome-profile-pic"/>
        <strong>부산 청년 지원 전문가</strong>
        <span>무엇이든 물어보세요!</span>
    </div>
);


function ChatWindow({chat, onSendMessage}) {
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
            {/* 채팅 메시지가 있을 때만 헤더가 보이도록 수정 */}
            {chat.messages.length > 0 && (
                <header className="chat-header">
                    <img src={botProfileImage} alt="Bot Profile" className="header-profile-pic"/>
                    <div className="header-title">
                        <strong>부산 청년 지원 전문가</strong>
                        <span>무엇이든 물어보세요!</span>
                    </div>
                </header>
            )}

            <div className="chat-messages" ref={chatContainerRef}>
                {/* 기존 코드에서 이 부분만 수정되었습니다. */}
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
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="main-menu-container">
                {mainMenu.map((item, index) => (
                    <button key={index} className="main-menu-btn" onClick={() => handleButtonClick(item.text)}>
                        <img src={item.image} alt="" className="main-menu-icon"/>
                        <span>{item.text}</span>
                    </button>
                ))}
            </div>

            <div className="quick-replies-container">
                {quickReplies.map((item, index) => (
                    <button key={index} className="quick-reply-btn" onClick={() => handleButtonClick(item)}>
                        {item}
                    </button>
                ))}
            </div>

            <ChatInput onSendMessage={onSendMessage}/>
        </div>
    );
}

export default ChatWindow;