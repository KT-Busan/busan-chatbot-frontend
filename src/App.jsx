import React, { useState, useEffect } from 'react';
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
        // 로컬 스토리지에서 저장된 채팅 기록을 불러옴
        const savedChats = localStorage.getItem('chats');
        if (savedChats && Object.keys(JSON.parse(savedChats)).length > 0) {
            const parsedChats = JSON.parse(savedChats);
            setChats(parsedChats);
            // 가장 최근 채팅(객체의 첫 번째 키)을 활성화
            setActiveChatId(Object.keys(parsedChats)[0]);
        } else {
            // 저장된 채팅이 없으면 새 채팅을 생성
            createNewChat();
        }
    }, []); // []를 비워두어 최초 1회만 실행되도록 함

    // 2. 'chats' 데이터가 변경될 때마다 로컬 스토리지에 자동 저장
    useEffect(() => {
        // chats 객체에 내용이 있을 때만 저장 동작
        if (Object.keys(chats).length > 0) {
            localStorage.setItem('chats', JSON.stringify(chats));
        }
    }, [chats]); // 'chats'가 바뀔 때마다 이 useEffect가 실행됨

    // 3. 새 채팅을 생성하는 함수
    const createNewChat = () => {
        const newChatId = generateId();
        const newChat = {
            id: newChatId,
            title: '새로운 대화', // 제목은 첫 메시지 입력 시 변경됨
            messages: [],
        };
        // 기존 채팅 목록의 맨 앞에 새 채팅 추가 (최신순 정렬 효과)
        setChats(prevChats => ({ [newChatId]: newChat, ...prevChats }));
        setActiveChatId(newChatId);
    };

    // 4. 메시지를 전송하는 함수 (가장 핵심적인 로직)
    const handleSendMessage = (messageText) => {
        // 활성화된 채팅이 없으면 함수 종료
        if (!activeChatId) return;

        const userMessage = {
            sender: 'user',
            text: messageText,
        };

        // 불변성을 유지하며 chats 상태를 업데이트
        setChats(prevChats => {
            const updatedChat = { ...prevChats[activeChatId] };
            updatedChat.messages = [...updatedChat.messages, userMessage];

            // 첫 메시지인 경우, 채팅 제목을 메시지 내용으로 설정
            if (updatedChat.messages.length === 1) {
                updatedChat.title = messageText;
            }

            return {
                ...prevChats,
                [activeChatId]: updatedChat,
            };
        });

        // AI 챗봇의 응답을 시뮬레이션 (1초 후 답변)
        setTimeout(() => {
            const botMessage = {
                sender: 'bot',
                text: `"${messageText}"에 대한 답변입니다. 현재는 테스트 중입니다.`,
            };
            // 봇 메시지를 추가하기 위해 다시 한번 상태 업데이트
            setChats(prevChats => {
                const updatedChat = { ...prevChats[activeChatId] };
                updatedChat.messages = [...updatedChat.messages, botMessage];
                return {
                    ...prevChats,
                    [activeChatId]: updatedChat,
                };
            });
        }, 1000);
    };

    // 현재 활성화된 채팅 세션의 전체 데이터
    const activeChat = chats[activeChatId];

    return (
        <div className="app-container">
            <Sidebar
                // chats 객체를 배열로 변환하여 전달
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