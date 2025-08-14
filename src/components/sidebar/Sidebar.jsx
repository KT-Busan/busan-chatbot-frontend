import React from 'react';
import ChatHistoryItem from './ChatHistoryItem';
import {classNames} from '../../utils/helpers';

function Sidebar({
                     chats,
                     activeChatId,
                     onNewChat,
                     onSelectChat,
                     onDeleteChat,
                     canDeleteChat,
                     isDarkMode,
                     onToggleDarkMode,
                     isCollapsed,
                     isMobile,
                     isVisible,
                     onToggleSidebar,
                     onGoToHome
                 }) {
    const handleThemeToggle = () => {
        onToggleDarkMode(!isDarkMode);
    };

    const handleLogoClick = () => {
        if (onGoToHome) {
            onGoToHome();
        }
    };

    const handleSidebarClick = () => {
        if (isCollapsed && !isMobile) {
            onToggleSidebar();
        }
    };

    const sidebarClasses = classNames(
        'sidebar',
        isCollapsed && !isMobile && 'collapsed',
        isMobile && 'mobile',
        isMobile && !isVisible && 'hidden',
        isMobile && isVisible && 'show'
    );

    return (
        <aside className={sidebarClasses} onClick={handleSidebarClick}>
            {/* 상단 헤더 */}
            <div className="sidebar-header">
                <div className="sidebar-header-top">
                    {/* 로고 버튼 */}
                    <button
                        className="logo-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLogoClick();
                        }}
                        title="메인화면으로 이동"
                        aria-label="메인화면으로 이동"
                    >
                        <span className="logo-text">B-BOT</span>
                    </button>

                    {/* 다크모드 토글 버튼 */}
                    <button
                        className="theme-toggle-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleThemeToggle();
                        }}
                        title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                        aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {/* 사이드바 닫기 버튼 - 모바일에서만 표시 */}
                    {isMobile && (
                        <button
                            className="sidebar-close-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSidebar();
                            }}
                            title="사이드바 닫기"
                            aria-label="사이드바 닫기"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* 새 채팅 시작 버튼 */}
                <button
                    className="new-chat-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNewChat();
                    }}
                    title="새 채팅 시작하기"
                >
                    <span className="new-chat-icon">✚</span>
                    {(!isCollapsed || isMobile) && (
                        <span className="new-chat-text">새 채팅 시작하기</span>
                    )}
                </button>
            </div>

            {/* 구분선 */}
            <div className="sidebar-divider"></div>

            {/* 채팅 목록 영역 */}
            <nav className="chat-history">
                {(!isCollapsed || isMobile) && (
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
                                canDelete={canDeleteChat(chat.id)}
                            />
                        ))}
                    </ul>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;