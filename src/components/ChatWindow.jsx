import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

// 상단에 표시될 3개의 메인 메뉴
const mainMenu = [
    '청년 지원 정책 메뉴',
    '부산 청년 센터 메뉴',
    '부산 청년 센터 장소 대여 메뉴',
];

// 하단에 표시될 4개의 추천 질문 (Quick Replies)
const quickReplies = [
    '청년 센터 일정',
    '청년 센터 이용 수칙',
    '청년 센터 운영 시간',
    'FAQ'
];

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
            <header className="chat-header">
                <img src={botProfileImage} alt="Bot Profile" className="header-profile-pic"/>
                <div className="header-title">
                    <strong>부산 청년 지원 전문가</strong>
                    <span>무엇이든 물어보세요!</span>
                </div>
            </header>

            <div className="chat-messages" ref={chatContainerRef}>
                {chat.messages.length === 0 && (
                    <div className="welcome-screen">
                        <img src={botProfileImage} alt="Bot Profile" className="welcome-profile-pic"/>
                        <strong>부산 청년 지원 전문가</strong>
                        <span>무엇이든 물어보세요!</span>
                    </div>
                )}
                {chat.messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="message-content">
                            {msg.sender === 'bot' && (
                                <img src={botProfileImage} alt="Bot Profile" className="message-profile-pic"/>
                            )}
                            <div className="message-bubble">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="main-menu-container">
                {mainMenu.map((item, index) => (
                    <button key={index} className="main-menu-btn" onClick={() => handleButtonClick(item)}>
                        {item}
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