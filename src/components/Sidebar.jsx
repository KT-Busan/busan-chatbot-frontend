import React from 'react';

// isCollapsed prop은 CSS 전용이므로 JS 로직에서는 사용되지 않습니다.
function Sidebar({chats, activeChatId, onNewChat, onSelectChat, onDeleteChat}) {
    /**
     * 삭제 버튼을 클릭했을 때 실행되는 함수
     * 사용자에게 삭제 여부를 확인한 후, '확인'을 눌렀을 때만 삭제를 진행합니다.
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

    return (
        <aside className="sidebar">
            {/* 햄버거 메뉴 아이콘 */}
            <div className="hamburger-menu">
                <span>☰</span>
            </div>
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    + 새 채팅 시작하기
                </button>
            </div>
            <nav className="chat-history">
                <ul>
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat.id)}
                        >
                            <span className="chat-title">
                                {chat.title}
                            </span>
                            <button
                                className="delete-chat-btn"
                                // 더 나은 확인 메시지를 위해 chat.title도 함께 전달
                                onClick={(e) => handleDeleteClick(e, chat.id, chat.title)}
                                title="대화 삭제" // 마우스를 올렸을 때 '대화 삭제' 툴팁 표시
                            >
                                ...
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;