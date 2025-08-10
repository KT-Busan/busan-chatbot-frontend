import React, {useRef, useEffect, useState} from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import MainMenuButtons from '../ui/MainMenuButtons';
import QuickLinks from '../ui/QuickLinks';
import MenuToggle from '../ui/MenuToggle';
import botProfileImage from '../../assets/bot-profile.png';

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
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container) return;

        const {scrollTop, scrollHeight, clientHeight} = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        setShowScrollToBottom(!isNearBottom && chat.messages.length > 0);
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages]);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll();

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [chat.messages.length]);

    const handleButtonClick = (text) => {
        if (text.startsWith('__BOT_RESPONSE__')) {
            const botResponse = text.replace('__BOT_RESPONSE__', '');
            onSendMessage(botResponse, true);
        } else {
            onSendMessage(text);
        }
    };

    return (
        <div className="chat-window">
            {/* 메시지가 있을 때만 헤더 표시 */}
            {chat.messages.length > 0 && (
                <header className="chat-header">
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

            {/* 맨 아래로 스크롤 버튼 */}
            {showScrollToBottom && (
                <button
                    className={`scroll-to-bottom-btn ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}
                    onClick={scrollToBottom}
                    aria-label="맨 아래로 스크롤"
                    title="맨 아래로"
                >
                    <span className="scroll-arrow">↓</span>
                </button>
            )}

            {/* 메뉴 토글 버튼 */}
            <MenuToggle open={isMenuOpen} onToggle={() => setIsMenuOpen((v) => !v)}/>

            {/* 토글로 제어되는 메뉴 그룹 */}
            {isMenuOpen && (
                <div id="main-menu-group">
                    <MainMenuButtons onButtonClick={handleButtonClick}/>
                    <QuickLinks/>
                </div>
            )}

            {/* 채팅 입력 컴포넌트 */}
            <ChatInput onSendMessage={onSendMessage} disabled={isThinking}/>
        </div>
    );
}

export default ChatWindow;