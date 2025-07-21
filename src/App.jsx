import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// 고유 ID 생성을 위한 간단한 함수
const generateId = () => `chat_${Date.now()}`;

function App() {
    // 전체 채팅 세션들을 객체 형태로 저장하는 상태 { id: { ...chatData } }
    const [chats, setChats] = useState({});
    // 현재 활성화된 채팅 세션의 ID를 저장하는 상태
    const [activeChatId, setActiveChatId] = useState(null);

    // 1. 컴포넌트가 처음 로드될 때 실행되는 로직
    useEffect(() => {
        const savedChats = localStorage.getItem('chats');
        if (savedChats && Object.keys(JSON.parse(savedChats)).length > 0) {
            const parsedChats = JSON.parse(savedChats);
            setChats(parsedChats);
            setActiveChatId(Object.keys(parsedChats)[0]);
        } else {
            createNewChat();
        }
    }, []);

    // 2. 'chats' 데이터가 변경될 때마다 로컬 스토리지에 자동 저장
    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem('chats', JSON.stringify(chats));
        }
    }, [chats]);

    // 3. 새 채팅을 생성하는 함수
    const createNewChat = () => {
        const newChatId = generateId();
        const newChat = {
            id: newChatId,
            title: '새로운 대화',
            messages: [],
        };
        setChats(prevChats => ({ [newChatId]: newChat, ...prevChats }));
        setActiveChatId(newChatId);
    };

    // 4. 메시지를 전송하는 함수 (백엔드 연동)
    const handleSendMessage = async (messageText) => {
        if (!activeChatId) return;

        const userMessage = {
            sender: 'user',
            text: messageText,
        };

        // 먼저 사용자 메시지를 화면에 즉시 표시
        setChats(prevChats => {
            const updatedChat = { ...prevChats[activeChatId] };
            updatedChat.messages = [...updatedChat.messages, userMessage];
            if (updatedChat.messages.length === 1) {
                updatedChat.title = messageText;
            }
            return { ...prevChats, [activeChatId]: updatedChat };
        });

        // 백엔드 API에 실제 요청을 보냄
        try {
            // Flask 서버의 /api/chat 엔드포인트에 POST 요청
            const response = await axios.post('http://localhost:5001/api/chat', {
                message: messageText,
            });

            // 백엔드로부터 받은 답변으로 봇 메시지 객체 생성
            const botMessage = {
                sender: 'bot',
                text: response.data.reply,
            };

            // 봇 메시지를 채팅 목록에 추가
            setChats(prevChats => {
                const updatedChat = { ...prevChats[activeChatId] };
                updatedChat.messages = [...updatedChat.messages, botMessage];
                return { ...prevChats, [activeChatId]: updatedChat };
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            // 오류 발생 시 사용자에게 보여줄 에러 메시지
            const errorMessage = {
                sender: 'bot',
                text: '죄송합니다, 답변을 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            };
            setChats(prevChats => {
                const updatedChat = { ...prevChats[activeChatId] };
                updatedChat.messages = [...updatedChat.messages, errorMessage];
                return { ...prevChats, [activeChatId]: updatedChat };
            });
        }
    };

    // 현재 활성화된 채팅 세션의 전체 데이터
    const activeChat = chats[activeChatId];

    return (
        <div className="app-container">
            <Sidebar
                chats={Object.values(chats)}
                activeChatId={activeChatId}
                onNewChat={createNewChat}
                onSelectChat={setActiveChatId}
            />
            <main className="chat-main">
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat}
                        onSendMessage={handleSendMessage} // ChatWindow로 함수 전달
                    />
                ) : (
                    <div className="no-active-chat">
                        <h2>채팅을 시작하세요</h2>
                        <p>왼쪽 사이드바에서 '새 채팅 시작하기'를 클릭하여 대화를 시작해 보세요.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;