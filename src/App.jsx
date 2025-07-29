import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// (getAnonymousId, generateChatId 함수는 이전과 동일)
const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};
const generateChatId = () => `chat_${Date.now()}`;


function App() {
    const [chats, setChats] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [anonymousId] = useState(getAnonymousId());
    const [isThinking, setIsThinking] = useState(false); // 생각 중 상태 추가

    const backendUrl = 'https://b-bot-backend.onrender.com';

    // (DB에서 기록 불러오는 useEffect는 이전과 동일)
    useEffect(() => {
        const fetchHistory = async () => {
            if (!anonymousId) return;
            try {
                const response = await axios.get(`https://b-bot-backend.onrender.com/api/history/${anonymousId}`);
                const history = response.data;
                if (history && Object.keys(history).length > 0) {
                    setChats(history);
                    setActiveChatId(Object.keys(history)[0]);
                } else {
                    createNewChat({});
                }
            } catch (error) {
                console.error("채팅 기록 로딩 실패:", error);
                createNewChat({});
            }
        };
        fetchHistory();
    }, [anonymousId]);

    // (createNewChat, deleteChat, selectChat 함수는 이전과 동일)
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
            await axios.delete(`https://b-bot-backend.onrender.com/api/chat/${chatIdToDelete}`);
        } catch (error) {
            console.error("채팅 삭제 실패:", error);
            setChats(originalChats);
            alert("채팅 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    // handleSendMessage 함수에 생각 중 상태 추가
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId || isThinking) return; // 생각 중일 때는 메시지 전송 방지

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

        // 생각 중 메시지 추가 (임시 메시지)
        const thinkingMessage = {
            sender: 'bot',
            text: 'thinking...', // 특별한 마커
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
            const response = await axios.post('https://b-bot-backend.onrender.com/api/chat', {
                message: messageText,
                anonymousId: anonymousId,
                chatId: activeChatId,
            });

            const botMessage = {sender: 'bot', text: response.data.reply};

            // 생각 중 메시지 제거하고 실제 응답 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                // 마지막 메시지(생각 중 메시지) 제거하고 실제 응답 추가
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(botMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
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
            />
            <main className="chat-main">
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                        isThinking={isThinking} // 생각 중 상태 전달
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;