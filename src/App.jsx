import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

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

    useEffect(() => {
        const initialize = async () => {
            if (!anonymousId) return;

            const isReload = sessionStorage.getItem('isReloaded');
            const savedChats = localStorage.getItem('chats');
            const savedActiveChatId = localStorage.getItem('activeChatId');

            let initialChats = {};
            if (savedChats && Object.keys(JSON.parse(savedChats)).length > 0) {
                initialChats = JSON.parse(savedChats);
            }

            if (isReload && savedActiveChatId) {
                setChats(initialChats);
                setActiveChatId(savedActiveChatId);
            } else {
                setChats(initialChats);
                createNewChat(initialChats);
            }

            sessionStorage.setItem('isReloaded', 'true');
        };

        initialize();
    }, [anonymousId]);

    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem('chats', JSON.stringify(chats));
        }
        if (activeChatId) {
            localStorage.setItem('activeChatId', activeChatId);
        }
    }, [chats, activeChatId]);

    /**
     * '새 채팅 시작하기' 버튼을 누르면 실행되는 함수
     */
    const createNewChat = (currentChats = chats) => {
        const newChatId = generateChatId();
        const newChat = {
            id: newChatId,
            title: '새로운 대화',
            messages: [],
            isInitial: true, // 새 채팅은 항상 '초기 상태'임을 표시
        };
        setChats({[newChatId]: newChat, ...currentChats});
        setActiveChatId(newChatId);
    };

    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    /**
     * 메시지를 전송하면 실행되는 핵심 함수
     * @param {string} messageText - 사용자가 입력한 메시지
     * @param {object} options - 추가 옵션 (예: { isCategoryClick: true })
     */
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId) return;

        const userMessage = {sender: 'user', text: messageText};

        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, userMessage];
            if (chatToUpdate.messages.length === 1) {
                chatToUpdate.title = messageText;
            }

            // 사용자가 직접 입력했을 때만 isInitial 상태를 false로 변경
            if (!options.isCategoryClick) {
                chatToUpdate.isInitial = false;
            }

            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        try {
            const response = await axios.post('http://localhost:5001/api/chat', {
                message: messageText,
                anonymousId: anonymousId,
                chatId: activeChatId,
            });

            const botMessage = {sender: 'bot', text: response.data.reply};

            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = [...updatedChat.messages, botMessage];
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            const errorMessage = {sender: 'bot', text: '죄송합니다, 답변을 가져오는 데 실패했습니다.'};
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = [...updatedChat.messages, errorMessage];
                return {...prevChats, [activeChatId]: updatedChat};
            });
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
            />
            <main className="chat-main">
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;