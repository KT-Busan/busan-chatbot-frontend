import React from 'react';

// 사이드바 컴포넌트 - 채팅 목록, 테마 변경, 새 채팅 생성 기능 제공
function Sidebar({
                     chats, // 모든 채팅 목록 배열
                     activeChatId, // 현재 활성화된 채팅 ID
                     onNewChat, // 새 채팅 생성 함수
                     onSelectChat, // 채팅 선택 함수
                     onDeleteChat, // 채팅 삭제 함수
                     isDarkMode, // 다크 모드 상태
                     onToggleDarkMode, // 테마 변경 함수
                     isCollapsed, // 사이드바 접힘 상태
                     isMobile, // 모바일 디바이스 여부
                     isVisible // 사이드바 표시 여부
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

    // 테마 토글 버튼 클릭 처리 함수
    const handleThemeToggle = () => {
        onToggleDarkMode(!isDarkMode); // 현재 테마 상태를 반전시켜 전달
    };

    // 사이드바의 CSS 클래스명을 조건에 따라 동적으로 생성
    const sidebarClasses = [
        'sidebar', // 기본 클래스
        isCollapsed ? 'collapsed' : '', // 접힘 상태일 때 클래스 추가
        isMobile ? 'mobile' : '', // 모바일일 때 클래스 추가
        !isVisible ? 'hidden' : '' // 숨김 상태일 때 클래스 추가
    ].filter(Boolean).join(' '); // falsy 값 제거 후 공백으로 연결

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
                        {/* 접힘 상태와 모바일 여부에 따라 버튼 텍스트 변경 */}
                        {isCollapsed && !isMobile ? '✚' : '+ 새 채팅 시작하기'}
                    </button>
                    {/* 테마 변경 버튼 */}
                    <button
                        className="theme-toggle-btn"
                        onClick={handleThemeToggle}
                        title={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                        aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
                    >
                        {/* 현재 테마에 따라 아이콘 변경 */}
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* 채팅 목록 영역 */}
            <nav className="chat-history">
                <ul>
                    {/* 모든 채팅을 순회하며 목록 아이템 생성 */}
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`} // 활성 채팅일 때 'active' 클래스 추가
                            onClick={() => onSelectChat(chat.id)} // 채팅 선택 시 해당 채팅으로 이동
                            title={isCollapsed && !isMobile ? chat.title : ''} // 접힌 상태일 때만 툴팁 표시
                        >
                            {/* 채팅 제목 표시 */}
                            <span className="chat-title">
                                {/* 접힌 상태일 때는 첫 글자만, 아니면 전체 제목 표시 */}
                                {isCollapsed && !isMobile ?
                                    chat.title.charAt(0).toUpperCase() : // 첫 글자를 대문자로 변환
                                    chat.title
                                }
                            </span>
                            {/* 채팅 삭제 버튼 */}
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => handleDeleteClick(e, chat.id, chat.title)} // 삭제 확인 후 처리
                                title="대화 삭제"
                            >
                                {/* 접힌 상태일 때는 × 아이콘, 아니면 ... 표시 */}
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