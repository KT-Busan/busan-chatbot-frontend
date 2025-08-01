import React from 'react';
import ChatHistoryItem from './ChatHistoryItem';
import {classNames} from '../../utils/helpers';

// 사이드바 컴포넌트 - 채팅 목록, 테마 변경, 새 채팅 생성 기능 제공
function Sidebar({
                     chats,
                     activeChatId,
                     onNewChat,
                     onSelectChat,
                     onDeleteChat,
                     isDarkMode,
                     onToggleDarkMode,
                     isCollapsed,
                     isMobile,
                     isVisible
                 }) {
    // 테마 토글 버튼 클릭 처리 함수
    const handleThemeToggle = () => {
        onToggleDarkMode(!isDarkMode);
    };

    // 사이드바의 CSS 클래스명을 조건에 따라 동적으로 생성
    const sidebarClasses = classNames(
        'sidebar',
        isCollapsed && 'collapsed',
        isMobile && 'mobile',
        !isVisible && 'hidden'
    );

    return (
        <aside className={sidebarClasses}>
            {/* 사이드바 상단 영역 (새 채팅, 테마 변경 버튼) */}
            <div className="sidebar-header">
                <div className="sidebar-top">
                    {/* 새 채팅 시작 버튼 */}
                    <button
                        className="new-chat-btn"
                        onClick={onNewChat}
                        title="새 채팅 시작하기"
                    >
                        {isCollapsed && !isMobile ? '✚' : '+ 새 채팅 시작하기'}
                    </button>
                    {/* 테마 변경 버튼 */}
                    <button
                        className="theme-toggle-btn"
                        onClick={handleThemeToggle}
                        title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                        aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* 채팅 목록 영역 */}
            <nav className="chat-history">
                <ul>
                    {chats.map((chat) => (
                        <ChatHistoryItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === activeChatId}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                            onSelect={onSelectChat}
                            onDelete={onDeleteChat}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;