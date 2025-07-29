import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// 익명 사용자 ID 생성/관리
const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};

// 채팅 ID 생성
const generateChatId = () => `chat_${Date.now()}`;

// 다크모드 커스텀 훅
const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode];
};

// 환경에 따른 백엔드 URL 설정
const getBackendUrl = () => {
    // 🚀 개발 중에는 이 줄 사용 (로컬 백엔드 연결)
    // return 'http://localhost:5001';

    // 🌐 프로덕션 배포 시에는 위 줄을 주석처리하고 아래 코드 사용
    const hostname = window.location.hostname;
    console.log(`🔍 현재 호스트: ${hostname}`);

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🏠 로컬 개발 환경');
        return 'http://localhost:5001';
    }

    console.log('🌐 프로덕션 환경');
    return 'https://b-bot-backend.onrender.com';
};

function App() {
    const [chats, setChats] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [anonymousId] = useState(getAnonymousId());
    const [isThinking, setIsThinking] = useState(false);
    const [isDarkMode, setIsDarkMode] = useDarkMode(); // 다크모드 상태 추가

    const backendUrl = getBackendUrl();

    // 콘솔에 현재 사용 중인 백엔드 URL 출력
    useEffect(() => {
        console.log(`🚀 Backend URL: ${backendUrl}`);
    }, [backendUrl]);

    // 채팅 히스토리 로딩
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

    // 새 채팅 생성
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

    // 채팅 삭제
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

    // 채팅 선택
    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    // 메시지 전송 및 응답 처리
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId || isThinking) return;

        const userMessage = {sender: 'user', text: messageText};

        // 사용자 메시지 추가
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

        // 생각 중 상태 시작
        setIsThinking(true);

        // 생각 중 메시지 추가
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

            // 생각 중 메시지 제거하고 실제 응답 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(botMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            console.error(`Backend URL: ${backendUrl}`);
            const errorMessage = {sender: 'bot', text: '죄송합니다, 답변을 가져오는 데 실패했습니다.'};

            // 생각 중 메시지 제거하고 에러 메시지 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(errorMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });
        } finally {
            // 생각 중 상태 종료
            setIsThinking(false);
        }
    };

    const activeChat = chats[activeChatId];

    return (
        <div className="app-container">
            <Sidebar
                chats={Object.values(chats)}
                activeChatId={activeChatId}
                onNewChat={() => createNewChat()}
                onSelectChat={selectChat}
                onDeleteChat={deleteChat}
                isDarkMode={isDarkMode}
                onToggleDarkMode={setIsDarkMode}
            />
            <main className="chat-main">
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                        isThinking={isThinking}
                        isDarkMode={isDarkMode}
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;