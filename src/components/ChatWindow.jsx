import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

const categoryButtons = [
    '오늘의 부산청년센터 대한 일정', '부산청년센터 대한 이용수칙',
    '부산청년 기쁨두배통장 신청 안내', '모집 중인 청년 지원 사업',
    '부산청년센터 운영 시간', '모집 중인 부산청년센터 프로그램',
];

const InitialScreen = ({onCategoryClick}) => (
    <div className="empty-chat-container">
        <div className="message bot-message">
            <div className="message-content">
                <img src={botProfileImage} alt="Bot Profile" className="profile-pic"/>
                <div className="message-bubble">
                    <strong>부산 청년 지원 전문가</strong>
                    <p>안녕하세요, 부산 청년을 위한 정책 알리미입니다. 궁금한 점이 있나요?</p>
                </div>
            </div>
        </div>
        <div className="category-buttons-grid">
            {categoryButtons.map((category, index) => (
                <button
                    key={index}
                    className="category-btn"
                    onClick={() => onCategoryClick(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    </div>
);

function ChatWindow({chat, onSendMessage}) {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    const handleCategoryClick = (category) => {
        onSendMessage(category, {isCategoryClick: true});
    };

    return (
        <div className="chat-window">
            <div className="chat-messages" ref={chatContainerRef}>
                {chat.isInitial && <InitialScreen onCategoryClick={handleCategoryClick}/>}

                {chat.messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="message-content">
                            {msg.sender === 'bot' && (
                                <img src={botProfileImage} alt="Bot Profile" className="profile-pic"/>
                            )}
                            <div className="message-bubble">
                                <strong>{msg.sender === 'user' ? '나' : '부산 청년 지원 전문가'}</strong>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* disabled={chat.isInitial} 속성을 제거 */}
            <ChatInput onSendMessage={onSendMessage}/>
        </div>
    );
}

export default ChatWindow;