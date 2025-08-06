import React, {useRef, useEffect} from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import MainMenuButtons from '../ui/MainMenuButtons';
import QuickLinks from '../ui/QuickLinks';
import botProfileImage from '../../assets/bot-profile.png';

// 메인 채팅 창 컴포넌트
function ChatWindow({
                        chat,
                        onSendMessage,
                        isThinking,
                        onToggleSidebar,
                        isSidebarCollapsed,
                        isMobile,
                        spacesData,
                        anonymousId
                    }) {
    const chatContainerRef = useRef(null);

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    // 버튼 클릭 처리 함수
    const handleButtonClick = (text) => {
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
                        <MessageBubble
                            key={index}
                            message={msg}
                            onButtonClick={handleButtonClick}
                            spacesData={spacesData}
                            anonymousId={anonymousId}
                        />
                    ))
                )}
            </div>

            {/* 메인 메뉴 버튼들 */}
            <MainMenuButtons onButtonClick={handleButtonClick}/>

            {/* 하단 고정 외부 링크들 */}
            <QuickLinks/>

            {/* 채팅 입력 컴포넌트 */}
            <ChatInput onSendMessage={onSendMessage} disabled={isThinking}/>
        </div>
    );
}

export default ChatWindow;