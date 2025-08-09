import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar/Sidebar';
import ChatWindow from './components/chat/ChatWindow';
import {useDarkMode} from './hooks/useDarkMode';
import {useSidebarState} from './hooks/useSidebarState';
import {
    getAnonymousId,
    generateChatId,
    getBackendUrl,
    getSidebarVisibility,
    classNames
} from './utils/helpers';

import './styles/variables.css';
import './styles/globals.css';
import './styles/components/chat.css';
import './styles/components/sidebar.css';
import './styles/components/ui.css';
import './styles/components/map.css';
import './styles/components/space-detail-search.css';
import './styles/responsive.css';

function App() {
    const [chats, setChats] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [anonymousId] = useState(getAnonymousId());
    const [isThinking, setIsThinking] = useState(false);
    const [spacesData, setSpacesData] = useState([]);

    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const {isSidebarCollapsed, setIsSidebarCollapsed, isMobile, toggleSidebar} = useSidebarState();

    const backendUrl = getBackendUrl();

    useEffect(() => {
        console.log(`🚀 Backend URL: ${backendUrl}`);
    }, [backendUrl]);

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

    const selectChat = (chatId) => {
        setActiveChatId(chatId);
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    };

    const handleSendMessage = async (messageText, isBotResponseOnly = false) => {
        if (!activeChatId || isThinking) return;

        if (isBotResponseOnly) {
            const botMessage = {sender: 'bot', text: messageText};

            setChats(prevChats => {
                const chatToUpdate = {...prevChats[activeChatId]};
                chatToUpdate.messages = [...chatToUpdate.messages, botMessage];

                const otherChats = {...prevChats};
                delete otherChats[activeChatId];
                return {[activeChatId]: chatToUpdate, ...otherChats};
            });

            return;
        }

        const userMessage = {sender: 'user', text: messageText};

        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, userMessage];

            if (chatToUpdate.messages.length === 1) {
                chatToUpdate.title = messageText;
            }

            chatToUpdate.isInitial = false;

            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        setIsThinking(true);

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
            let botReply = '';

            if (messageText === '행정구역별 확인하기') {
                botReply = `[REGION_MAP]`;
            } else if (messageText === '키워드별 확인하기') {
                botReply = `[KEYWORD_BUTTONS]`;
            } else if (messageText === '청년 공간 상세') {
                botReply = `[SPACE_DETAIL_SEARCH]`;
            } else if (messageText === '청년 공간 프로그램 확인하기') {
                botReply = `[PROGRAM_REGIONS]`;
            } else if (['📝스터디/회의', '🎤교육/강연', '👥커뮤니티', '🚀진로/창업', '🎨문화/창작', '🛠작업/창작실', '🧘휴식/놀이', '🎪행사/이벤트'].includes(messageText)) {
                const response = await axios.post(`${backendUrl}/api/chat`, {
                    message: messageText,
                    anonymousId: anonymousId,
                    chatId: activeChatId,
                });
                botReply = response.data.reply;
            } else if (messageText.endsWith(' 프로그램')) {
                const response = await axios.post(`${backendUrl}/api/chat`, {
                    message: messageText,
                    anonymousId: anonymousId,
                    chatId: activeChatId,
                });
                botReply = response.data.reply;
            } else if (['중구', '서구', '동구', '영도구', '부산진구', '동래구', '연제구', '금정구', '북구', '사상구', '사하구', '강서구', '남구', '해운대구', '수영구', '기장군'].includes(messageText)) {
                const response = await axios.post(`${backendUrl}/api/chat`, {
                    message: messageText,
                    anonymousId: anonymousId,
                    chatId: activeChatId,
                });
                botReply = response.data.reply;
            } else {
                const response = await axios.post(`${backendUrl}/api/chat`, {
                    message: messageText,
                    anonymousId: anonymousId,
                    chatId: activeChatId,
                });
                botReply = response.data.reply;
            }

            const botMessage = {sender: 'bot', text: botReply};

            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(botMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);

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
                        anonymousId={anonymousId}
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;