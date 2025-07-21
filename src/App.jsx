import React, {useState, useEffect} from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// 고유 ID 생성을 위한 간단한 함수
const generateId = () => `chat_${Date.now()}`;

function App() {
    // 전체 채팅 세션들을 저장하는 상태
    const [chats, setChats] = useState({});
    // 현재 활성화된 채팅 세션의 ID를 저장하는 상태
    const [activeChatId, setActiveChatId] = useState(null);

    // 컴포넌트가 처음 렌더링될 때 localStorage에서 채팅 데이터를 불러옴
    useEffect(() => {
        const savedChats = localStorage.getItem('chats');
        if (savedChats && Object.keys(JSON.parse(savedChats)).length > 0) {
            setChats(JSON.parse(savedChats));
            // 가장 최근 채팅을 활성화
            setActiveChatId(Object.keys(JSON.parse(savedChats))[0]);
        } else {
            // 저장된 채팅이 없으면 새 채팅 시작
            createNewChat();
        }
    }, []);

    // chats 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem('chats', JSON.stringify(chats));
        }
    }, [chats]);

    // 새 채팅 생성 함수
    const createNewChat = () => {
        const newChatId = generateId();
        const newChat = {
            id: newChatId,
            title: `새로운 대화 ${Object.keys(chats).length + 1}`,
            messages: [],
        };
        // 기존 채팅 목록의 맨 앞에 새 채팅 추가
        setChats(prevChats => ({[newChatId]: newChat, ...prevChats}));
        setActiveChatId(newChatId);
    };

    // 메시지 전송 처리 함수
    const handleSendMessage = (messageText) => {
        if (!activeChatId) return;

        const userMessage = {
            sender: 'user', // '나'
            text: messageText,
        };

        // 상태를 업데이트하여 사용자 메시지를 추가
        const updatedChats = {...chats};
        updatedChats[activeChatId].messages.push(userMessage);

        // 첫 메시지인 경우, 제목을 메시지 내용으로 설정
        if (updatedChats[activeChatId].messages.length === 1) {
            updatedChats[activeChatId].title = messageText;
        }

        setChats(updatedChats);

        // AI 챗봇의 응답 시뮬레이션 (실제로는 여기서 백엔드 API 호출)
        setTimeout(() => {
            const botMessage = {
                sender: 'bot', // '부산 청년 지원 전문가'
                text: `\"${messageText}\"에 대한 답변입니다. 현재는 테스트 중입니다.`,
            };
            const finalChats = {...updatedChats};
            finalChats[activeChatId].messages.push(botMessage);
            setChats(finalChats);
        }, 1000);
    };

    // 현재 활성화된 채팅 세션 정보
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
                        onSendMessage={handleSendMessage}
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