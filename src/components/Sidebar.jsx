import React from 'react';

// App.jsx로부터 onDeleteChat 함수를 추가로 받아옴
function Sidebar({chats, activeChatId, onNewChat, onSelectChat, onDeleteChat}) {
    /**
     * 삭제 버튼을 클릭했을 때 실행되는 함수
     * 이벤트 버블링을 막아, 삭제 버튼 클릭 시 채팅이 선택되는 것을 방지
     * @param {Event} e - 클릭 이벤트 객체
     * @param {string} chatId - 삭제할 채팅의 ID
     */
    const handleDeleteClick = (e, chatId) => {
        e.stopPropagation(); // 부모 요소(li)의 onClick 이벤트가 실행되지 않도록 막음
        onDeleteChat(chatId); // App.jsx에 있는 삭제 함수를 호출
    };

    return (
        <aside className="sidebar">
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
                            {/* 채팅 제목을 span으로 감싸서 스타일링 용이 */}
                            <span className="chat-title">
                                {chat.title.length > 20 ? `${chat.title.substring(0, 20)}...` : chat.title}
                            </span>

                            {/* 삭제 버튼 추가 */}
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => handleDeleteClick(e, chat.id)}
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