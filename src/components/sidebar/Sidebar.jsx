import React from 'react';
import ChatHistoryItem from './ChatHistoryItem';
import {classNames} from '../../utils/helpers';

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
    const handleThemeToggle = () => {
        onToggleDarkMode(!isDarkMode);
    };

    const sidebarClasses = classNames(
        'sidebar',
        isCollapsed && 'collapsed',
        isMobile && 'mobile',
        !isVisible && 'hidden'
    );

    return (
        <aside className={sidebarClasses}>
            {/* 사이드바 상단 영역 */}
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