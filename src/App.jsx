import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

/**npm
 * 브라우저의 localStorage에서 익명 사용자 ID를 가져오거나, 없으면 새로 생성
 * @returns {string} 익명 사용자 ID
 */
const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`;
        localStorage.setItem('anonymousId', anonymousId);
    }
    return anonymousId;
};

/**
 * 현재 시간을 기반으로 고유한 채팅 ID를 생성
 * @returns {string} 채팅 ID
 */
const generateChatId = () => `chat_${Date.now()}`;

function App() {
    // --- 상태 관리 (State) ---
    // 전체 채팅 목록을 객체 형태로 관리 { chatId: { ...chatData } }
    const [chats, setChats] = useState({});
    // 현재 활성화된 채팅의 ID를 관리
    const [activeChatId, setActiveChatId] = useState(null);
    // 익명 사용자 ID를 관리 (페이지 로드 시 한 번만 설정)
    const [anonymousId] = useState(getAnonymousId());

    // 1. 최초 페이지 로드 시 실행되는 효과
    useEffect(() => {
        const initialize = async () => {
            if (!anonymousId) return; // ID가 없으면 실행하지 않음

            try {
                // 백엔드에서 해당 사용자의 채팅 기록을 가져옴
                const response = await axios.get(`http://localhost:5001/api/history/${anonymousId}`);
                const history = response.data;

                if (history && Object.keys(history).length > 0) {
                    // 기록이 있으면, 상태를 설정하고 가장 최근 채팅을 활성화
                    setChats(history);
                    setActiveChatId(Object.keys(history)[0]);
                } else {
                    // 기록이 없으면, 새로운 채팅을 시작
                    createNewChat();
                }
            } catch (error) {
                console.error("채팅 기록을 불러오는 데 실패했습니다:", error);
                createNewChat(); // 에러 발생 시에도 새 채팅을 시작
            }
        };

        initialize();
    }, [anonymousId]); // anonymousId가 정해진 후 딱 한 번만 실행

    /**
     * '새 채팅 시작하기' 버튼을 누르면 실행되는 함수
     */
    const createNewChat = () => {
        const newChatId = generateChatId();
        const newChat = {
            id: newChatId,
            title: '새로운 대화',
            messages: [],
        };
        // 기존 채팅 목록은 그대로 두고, 새 채팅을 맨 앞에 추가
        setChats(prevChats => ({[newChatId]: newChat, ...prevChats}));
        setActiveChatId(newChatId);
    };

    /**
     * 사이드바에서 특정 채팅을 클릭하면 실행되는 함수
     * @param {string} chatId - 선택된 채팅의 ID
     */
    const selectChat = (chatId) => {
        setActiveChatId(chatId);
    };

    /**
     * 메시지를 전송하면 실행되는 핵심 함수
     * @param {string} messageText - 사용자가 입력한 메시지
     */
    const handleSendMessage = async (messageText) => {
        if (!activeChatId) return;

        const userMessage = {
            sender: 'user',
            text: messageText,
        };

        // 옵티미스틱 UI 업데이트: 사용자 메시지를 먼저 화면에 표시하고, 해당 채팅을 맨 위로 올림
        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, userMessage];
            // 첫 메시지인 경우, 채팅 제목을 메시지 내용으로 설정
            if (chatToUpdate.messages.length === 1) {
                chatToUpdate.title = messageText;
            }
            // 나머지 채팅 목록에서 현재 채팅을 제거
            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            // 업데이트된 채팅을 맨 앞에 배치하여 순서를 변경
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        try {
            // 백엔드에 메시지, 사용자 ID, 채팅 ID를 전송
            const response = await axios.post('http://localhost:5001/api/chat', {
                message: messageText,
                anonymousId: anonymousId,
                chatId: activeChatId,
            });

            const botMessage = {
                sender: 'bot',
                text: response.data.reply,
            };

            // 백엔드로부터 받은 봇의 답변을 채팅에 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = [...updatedChat.messages, botMessage];
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            const errorMessage = {
                sender: 'bot',
                text: '죄송합니다, 답변을 가져오는 데 실패했습니다.',
            };
            // 에러 발생 시 에러 메시지를 채팅에 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = [...updatedChat.messages, errorMessage];
                return {...prevChats, [activeChatId]: updatedChat};
            });
        }
    };

    // 현재 활성화된 채팅의 데이터
    const activeChat = chats[activeChatId];

    return (
        <div className="app-container">
            <Sidebar
                chats={Object.values(chats)} // 객체를 배열로 변환하여 전달
                activeChatId={activeChatId}
                onNewChat={createNewChat}
                onSelectChat={selectChat}
            />
            <main className="chat-main">
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    // 채팅이 로드되는 동안 잠시 보일 수 있는 화면
                    <div className="no-active-chat">
                        <h2>채팅을 불러오는 중...</h2>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;