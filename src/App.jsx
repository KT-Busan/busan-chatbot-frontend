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

    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId || isThinking) return;

        const userMessage = {sender: 'user', text: messageText};

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
            // 각 버튼별 처리 로직
            let botReply = '';

            // 메인 메뉴 버튼 처리
            if (messageText === '행정구역별 확인하기') {
                botReply = `[REGION_MAP]`;
            } else if (messageText === '키워드별 확인하기') {
                botReply = `[KEYWORD_BUTTONS]`;
            } else if (messageText === '청년 공간 프로그램 확인하기') {
                botReply = `[PROGRAM_REGIONS]`;
            } else if (messageText === '청년 공간 상세') {
                botReply = `[SPACE_DETAIL_SEARCH]`;
            }
            // 키워드 버튼 클릭 처리
            else if (['스터디/회의', '교육/강연', '모임/커뮤니티', '진로/창업', '문화/창작', '작업/창작실', '휴식/놀이', '행사/이벤트'].includes(messageText)) {
                // 예시 데이터 (실제로는 백엔드에서 받아올 예정)
                botReply = `${messageText}로 찾은 공간입니다!

1️⃣ 부산청년센터 – 회의실 부산진구
2️⃣ 해운대청년공간 – 스터디룸 해운대구  
3️⃣ 사상청년창작소 – 모임공간 사상구

📌 공간 상세 내용은
👉 "청년 공간 상세" 버튼을 눌러 확인하거나,
👉 공간명을 입력해서 직접 확인해보세요!`;
            }
            // 지역별 프로그램 클릭 처리
            else if (messageText.includes('프로그램')) {
                const region = messageText.replace(' 프로그램', '');
                // 예시 데이터 (실제로는 백엔드에서 받아올 예정)
                botReply = `📍 ${region} 청년공간 프로그램 안내(마감 임박순)

1️⃣ ${region} 창업 멘토링 프로그램
• 장소: ${region} 청년센터
• 신청기간: 2025.01.15 ~ 2025.02.10
🔗 https://example.com/program1

2️⃣ ${region} 네트워킹 모임
• 장소: ${region} 청년공간
• 신청기간: 2025.01.20 ~ 2025.02.15  
🔗 https://example.com/program2

3️⃣ ${region} 취업 준비 워크샵
• 장소: ${region} 커뮤니티센터
• 신청기간: 2025.01.25 ~ 2025.02.20
🔗 https://example.com/program3

📌 전체 프로그램은 [청년 공간 프로그램](https://young.busan.go.kr)에서 더 확인할 수 있어요.`;
            }
            // 랜덤 추천 버튼 클릭 처리
            else if (messageText === '✨ 랜덤 추천') {
                // 예시 랜덤 공간 데이터 (실제로는 백엔드에서 받아올 예정)
                botReply = `🎲 랜덤으로 추천해드릴게요!

1️⃣ 연제청년문화공간 – 다목적홀
• 📍 위치 : 연제구 중앙대로 1001 
• 👥 인원 : 최대 25명
• 🧰 특징 : 문화행사 및 공연 적합 | 음향장비, 조명시설 구비 | 유료(일일 50,000원)
• 🔗 링크 : https://example.com/yeonje

💡 다른 공간이 궁금하시면 다시 랜덤 추천을 눌러보세요!`;
            }
            // 기타 메시지는 백엔드 API 호출
            else {
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