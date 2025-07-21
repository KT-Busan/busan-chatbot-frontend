import React, { useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png'; // 챗봇 프로필 이미지

function ChatWindow({ chat, onSendMessage }) {
    const chatContainerRef = useRef(null);

    // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    return (
        <div className="chat-window">
            <div className="chat-messages" ref={chatContainerRef}>
                {chat.messages.length === 0 ? (
                    <div className="empty-chat-message">
                        <h1>부산 청년 지원 전문가</h1>
                        <p>무엇이든 물어보세요!</p>
                    </div>
                ) : (
                    chat.messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                            <div className="message-content">
                                {msg.sender === 'bot' && (
                                    <img src={botProfileImage} alt="Bot Profile" className="profile-pic" />
                                )}
                                <div className="message-bubble">
                                    <strong>{msg.sender === 'user' ? '나' : '부산 청년 지원 전문가'}</strong>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    );
}

export default ChatWindow;