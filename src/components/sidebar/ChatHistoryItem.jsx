import React from 'react';

const ChatHistoryItem = ({
                             chat,
                             isActive,
                             isCollapsed,
                             isMobile,
                             onSelect,
                             onDelete
                         }) => {
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (window.confirm(`'${chat.title}' 대화를 정말 삭제하시겠습니까?`)) {
            onDelete(chat.id);
        }
    };

    return (
        <li
            className={`chat-history-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(chat.id)}
            title={isCollapsed && !isMobile ? chat.title : ''}
        >
            <span className="chat-title">
                {isCollapsed && !isMobile
                    ? chat.title.charAt(0).toUpperCase()
                    : chat.title
                }
            </span>
            <button
                className="delete-chat-btn"
                onClick={handleDeleteClick}
                title="대화 삭제"
            >
                {isCollapsed && !isMobile ? '×' : '...'}
            </button>
        </li>
    );
};

export default ChatHistoryItem;