import React from 'react';

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    + 새 채팅 시작하기
                </button>
            </div>
            <nav className="chat-history">
                <ul>
                    {/* chats 배열을 순회하며 각 채팅의 제목을 목록으로 표시 */}
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            // 현재 활성화된 채팅은 'active' 클래스를 적용
                            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat.id)}
                        >
                            {/* 채팅 제목이 길 경우 잘라내어 표시 */}
                            {chat.title.length > 20 ? `${chat.title.substring(0, 20)}...` : chat.title}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;