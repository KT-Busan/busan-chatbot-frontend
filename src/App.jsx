import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar/Sidebar'; // 경로 수정
import ChatWindow from './components/chat/ChatWindow'; // 경로 수정
import {useDarkMode} from './hooks/useDarkMode';
import {useSidebarState} from './hooks/useSidebarState';
import {
    getAnonymousId,
    generateChatId,
    getBackendUrl,
    getSidebarVisibility,
    classNames
} from './utils/helpers';

// 스타일 가져오기
import './styles/variables.css';
import './styles/globals.css';
import './styles/components/chat.css';
import './styles/components/sidebar.css';
import './styles/components/ui.css';
import './styles/components/map.css';
import './styles/responsive.css';

// 메인 App 컴포넌트
function App() {
    const [chats, setChats] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [anonymousId] = useState(getAnonymousId());
    const [isThinking, setIsThinking] = useState(false);
    const [spacesData, setSpacesData] = useState([]);

    // 커스텀 훅 사용
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const {isSidebarCollapsed, setIsSidebarCollapsed, isMobile, toggleSidebar} = useSidebarState();

    const backendUrl = getBackendUrl();

    // 콘솔에 현재 사용 중인 백엔드 URL 출력 (디버깅용)
    useEffect(() => {
        console.log(`🚀 Backend URL: ${backendUrl}`);
    }, [backendUrl]);

    // 앱 시작 시 채팅 히스토리 로딩
    useEffect(() => {
        const fetchHistory = async () => {
            if (!anonymousId) return;

            try {
                const response = await axios.get(`${backendUrl}/api/history/${anonymousId}`);
                const history = response.data;

                if (history && Object.keys(history).length > 0) {
                    setChats(history);
                    setActiveChatId(Object.keys(history)[0]);
                } else {
                    createNewChat({});
                }
            } catch (error) {
                console.error("채팅 기록 로딩 실패:", error);
                console.error(`Backend URL: ${backendUrl}`);
                createNewChat({});
            }
        };

        fetchHistory();
    }, [anonymousId, backendUrl]);

    // 새 채팅 생성 함수
    const createNewChat = (currentChats = chats) => {
        const newChatId = generateChatId();
        const newChat = {
            id: newChatId,
            title: '새로운 대화',
            messages: [],
            isInitial: true,
        };

        setChats({[newChatId]: newChat, ...currentChats});
        setActiveChatId(newChatId);
    };

    // 채팅 삭제 함수
    const deleteChat = async (chatIdToDelete) => {
        const originalChats = {...chats};
        const newChats = {...originalChats};
        delete newChats[chatIdToDelete];
        setChats(newChats);

        if (activeChatId === chatIdToDelete) {
            const remainingChatIds = Object.keys(newChats);
            setActiveChatId(remainingChatIds.length > 0 ? remainingChatIds[0] : null);

            if (remainingChatIds.length === 0) {
                createNewChat({});
            }
        }

        try {
            await axios.delete(`${backendUrl}/api/chat/${chatIdToDelete}`);
        } catch (error) {
            console.error("채팅 삭제 실패:", error);
            console.error(`Backend URL: ${backendUrl}`);
            setChats(originalChats);
            alert("채팅 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 채팅 선택 함수
    const selectChat = (chatId) => {
        setActiveChatId(chatId);
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    };

    // 메시지 전송 및 봇 응답 처리 함수
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId || isThinking) return;

        const userMessage = {sender: 'user', text: messageText};

        // 사용자 메시지를 채팅에 추가
        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, userMessage];

            if (chatToUpdate.messages.length === 1) {
                chatToUpdate.title = messageText;
            }

            if (!options.isCategoryClick) {
                chatToUpdate.isInitial = false;
            }

            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        setIsThinking(true);

        // 생각 중 표시용 임시 메시지 추가
        const thinkingMessage = {
            sender: 'bot',
            text: 'thinking...',
            isThinking: true
        };

        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, thinkingMessage];
            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        try {
            const response = await axios.post(`${backendUrl}/api/chat`, {
                message: messageText,
                anonymousId: anonymousId,
                chatId: activeChatId,
            });

            const botMessage = {sender: 'bot', text: response.data.reply};

            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(botMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            console.error(`Backend URL: ${backendUrl}`);

            const errorMessage = {
                sender: 'bot',
                text: '죄송합니다, 답변을 가져오는 데 실패했습니다.'
            };

            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(errorMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });
        } finally {
            setIsThinking(false);
        }
    };

    const activeChat = chats[activeChatId];
    const sidebarVisible = getSidebarVisibility(isMobile, isSidebarCollapsed);

    return (
        <div className="app-container">
            {/* 모바일 환경에서 사이드바가 열려 있을 때 배경 오버레이 */}
            {isMobile && !isSidebarCollapsed && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarCollapsed(true)}
                />
            )}

            {/* 사이드바 컴포넌트 */}
            <Sidebar
                chats={Object.values(chats)}
                activeChatId={activeChatId}
                onNewChat={() => createNewChat()}
                onSelectChat={selectChat}
                onDeleteChat={deleteChat}
                isDarkMode={isDarkMode}
                onToggleDarkMode={setIsDarkMode}
                isCollapsed={isSidebarCollapsed}
                isMobile={isMobile}
                isVisible={sidebarVisible}
            />

            {/* 메인 채팅 영역 */}
            <main className={classNames(
                'chat-main',
                isSidebarCollapsed && 'sidebar-collapsed'
            )}>
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                        isThinking={isThinking}
                        onToggleSidebar={toggleSidebar}
                        isSidebarCollapsed={isSidebarCollapsed}
                        isMobile={isMobile}
                        spacesData={spacesData}
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;