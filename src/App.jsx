import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// 익명 사용자 ID를 생성하고 관리 (이 함수는 그대로 유지)
const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};

// 새 채팅 ID 생성 (이 함수는 그대로 유지)
const generateChatId = () => `chat_${Date.now()}`;

function App() {
    const [chats, setChats] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [anonymousId] = useState(getAnonymousId());

    // 1. useEffect 로직을 DB에서 기록을 불러오는 것으로 완전히 교체
    useEffect(() => {
        const fetchHistory = async () => {
            if (!anonymousId) return;
            try {
                // 백엔드 API를 호출하여 이 사용자의 모든 채팅 기록을 가져옴
                const response = await axios.get(`http://localhost:5001/api/history/${anonymousId}`);
                const history = response.data;

                if (history && Object.keys(history).length > 0) {
                    // 기록이 있으면, 상태를 업데이트하고 가장 최신 채팅을 활성화
                    setChats(history);
                    setActiveChatId(Object.keys(history)[0]); // 백엔드에서 이미 최신순으로 정렬됨
                } else {
                    // 기록이 없으면, 새로운 채팅을 시작
                    createNewChat({});
                }
            } catch (error) {
                console.error("채팅 기록 로딩 실패:", error);
                createNewChat({}); // API 호출 실패 시에도 새 채팅 시작
            }
        };

        fetchHistory();
    }, [anonymousId]); // 이 컴포넌트가 로드될 때 한 번만 실행

    // 2. localStorage에 채팅 기록을 저장하던 useEffect는 완전히 제거
    // (이제 모든 데이터는 DB에서 관리합니다.)

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

    // 3. DB에서 채팅을 영구적으로 삭제하는 함수 추가
    const deleteChat = async (chatIdToDelete) => {
        // 낙관적 업데이트: 먼저 화면에서 바로 삭제
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
            // 백엔드에 삭제 요청 API를 호출
            await axios.delete(`http://localhost:5001/api/chat/${chatIdToDelete}`);
        } catch (error) {
            console.error("채팅 삭제 실패:", error);
            // API 호출 실패 시, 화면 상태를 원래대로 되돌림 (롤백)
            setChats(originalChats);
            alert("채팅 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    // (handleSendMessage 함수는 이전과 동일)
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId) return;
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
                onDeleteChat={deleteChat} // 4. 삭제 함수를 Sidebar로 전달
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