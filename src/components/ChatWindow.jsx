import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

// 메인 메뉴 데이터 구조를 이미지와 텍스트를 포함하는 객체로 변경
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
                {chat.isInitial && (
                    <div className="message bot-message">
                        <div className="message-content">
                            <div className="message-bubble">
                                <ReactMarkdown>안녕하세요! 부산 청년들을 위한 챗봇입니다. 아래 메뉴를 선택하거나 직접 질문을 입력해주세요.</ReactMarkdown>
                            </div>
                        </div>
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
                    // 버튼 안에 이미지(img)와 텍스트(span)를 함께 렌더링
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