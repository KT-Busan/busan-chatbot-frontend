import React from 'react';

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
    /**
     * 삭제 버튼을 클릭했을 때 실행되는 함수
     * 사용자에게 삭제 여부를 확인한 후, '확인'을 눌렀을 때만 삭제를 진행
     * @param {Event} e - 클릭 이벤트 객체
     * @param {string} chatId - 삭제할 채팅의 ID
     * @param {string} chatTitle - 확인 메시지에 표시할 채팅 제목
     */
    const handleDeleteClick = (e, chatId, chatTitle) => {
        e.stopPropagation(); // 부모 요소(li)의 onClick 이벤트가 실행되지 않도록 막음

        // 삭제 확인 창을 띄우는 로직 추가
        if (window.confirm(`'${chatTitle}' 대화를 정말 삭제하시겠습니까?`)) {
            // 사용자가 '확인'을 누른 경우에만 App.jsx에 있는 삭제 함수를 호출
            onDeleteChat(chatId);
        }
    };

    const handleThemeToggle = () => {
        onToggleDarkMode(!isDarkMode);
    };

    const sidebarClasses = [
        'sidebar',
        isCollapsed ? 'collapsed' : '',
        isMobile ? 'mobile' : '',
        !isVisible ? 'hidden' : ''
    ].filter(Boolean).join(' ');

    return (
        <aside className={sidebarClasses}>
            <div className="sidebar-header">
                <div className="sidebar-top">
                    <button
                        className="new-chat-btn"
                        onClick={onNewChat}
                        title="새 채팅 시작하기"
                    >
                        {isCollapsed && !isMobile ? '✚' : '+ 새 채팅 시작하기'}
                    </button>
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

            <nav className="chat-history">
                <ul>
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat.id)}
                            title={isCollapsed && !isMobile ? chat.title : ''}
                        >
                            <span className="chat-title">
                                {isCollapsed && !isMobile ?
                                    chat.title.charAt(0).toUpperCase() :
                                    chat.title
                                }
                            </span>
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => handleDeleteClick(e, chat.id, chat.title)}
                                title="대화 삭제"
                            >
                                {isCollapsed && !isMobile ? '×' : '...'}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;