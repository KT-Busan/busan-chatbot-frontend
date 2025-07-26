import React, {useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './ChatInput';
import botProfileImage from '../assets/bot-profile.png';

// 새로운 메인 메뉴 버튼
const mainMenu = ['부산청년센터 대관 이용 수칙', '부산청년센터 장소 대여', '부산시 모집 중인 일자리 지원 사업',];

// 새로운 하단 추천 질문 버튼
const quickReplies = ['청년 센터 일정', '청년 센터 이용 수칙', '청년 센터 운영 시간', 'FAQ'];

// 중앙 정렬될 환영 메시지 컴포넌트
const WelcomeScreen = () => (<div className="welcome-screen">
    {/* 1. B-BOT 이름 위에 캐릭터 이미지 추가 */}
    <img src={botProfileImage} alt="B-BOT Profile" className="welcome-profile-pic"/>

    {/* 챗봇 이름과 영어 설명 */}
    <strong className="gradient-text">B-BOT</strong>
    <span className="gradient-text">For the Youth in Busan</span>

    {/* 2. 한글 설명 문구 추가 */}
    <p className="welcome-subtitle">
        안녕하세요, 부산 청년을 위한 정책 지원 챗봇입니다. 무엇이든 물어보세요!
    </p>
</div>);

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

    return (<div className="chat-window">
        {chat.messages.length > 0 && (<header className="chat-header">
            <img src={botProfileImage} alt="Bot Profile" className="header-profile-pic"/>
            <div className="header-title">
                <strong>B-BOT</strong>
                <span>For the Youth in Busan</span>
            </div>
        </header>)}

        <div className="chat-messages" ref={chatContainerRef}>
            {chat.messages.length === 0 ? (<WelcomeScreen/>) : (chat.messages.map((msg, index) => (<div key={index}
                                                                                                        className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                    {msg.sender === 'bot' && (
                        <img src={botProfileImage} alt="Bot Profile" className="message-profile-pic"/>)}
                    <div className="message-bubble">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                </div>
            </div>)))}
        </div>

        {/* 3. 별도의 환영 메시지 버블은 이제 필요 없으므로 삭제 */}
        <div className="main-menu-container">
            {mainMenu.map((item, index) => (
                <button key={index} className="main-menu-btn" onClick={() => handleButtonClick(item)}>
                    <span>{item}</span>
                </button>))}
        </div>

        <div className="quick-replies-container">
            {quickReplies.map((item, index) => (
                <button key={index} className="quick-reply-btn" onClick={() => handleButtonClick(item)}>
                    {item}
                </button>))}
        </div>

        <ChatInput onSendMessage={onSendMessage}/>
    </div>);
}

export default ChatWindow;