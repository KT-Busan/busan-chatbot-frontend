import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

// 익명 사용자 ID 생성 및 관리 함수
const getAnonymousId = () => {
    let anonymousId = localStorage.getItem('anonymousId'); // 로컬스토리지에서 기존 ID 확인
    if (!anonymousId) {
        anonymousId = `user_${crypto.randomUUID()}`; // 새로운 익명 ID 생성
        localStorage.setItem('anonymousId', anonymousId); // 로컬스토리지에 저장
    }
    return anonymousId;
};

// 채팅 ID 생성 함수 (타임스탬프 기반)
const generateChatId = () => `chat_${Date.now()}`;

// 다크모드 상태 관리 커스텀 훅
const useDarkMode = () => {
    // 로컬스토리지에서 다크모드 설정 불러오기 (기본값: false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // 다크모드 상태 변경 시 로컬스토리지 저장 및 CSS 테마 적용
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode)); // 설정 저장
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark'); // 다크 테마 적용
        } else {
            document.documentElement.removeAttribute('data-theme'); // 라이트 테마 적용
        }
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode];
};

// 사이드바 상태 관리 커스텀 훅 (반응형 처리 포함)
const useSidebarState = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // 사이드바 접힘 상태
    const [isMobile, setIsMobile] = useState(false); // 모바일 디바이스 여부

    // 윈도우 크기 변경 감지 및 반응형 처리
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newIsMobile = width <= 768; // 768px 이하를 모바일로 판단
            setIsMobile(newIsMobile);

            // PC에서 1200px 미만이면 사이드바 자동 접기
            if (width < 1200 && width > 768) {
                setIsSidebarCollapsed(true);
            } else if (width >= 1200) {
                setIsSidebarCollapsed(false); // 1200px 이상에서는 사이드바 펼치기
            }
        };

        handleResize(); // 초기 실행
        window.addEventListener('resize', handleResize); // 리사이즈 이벤트 리스너 등록
        return () => window.removeEventListener('resize', handleResize); // 클린업
    }, []);

    return [isSidebarCollapsed, setIsSidebarCollapsed, isMobile];
};

// 환경에 따른 백엔드 URL 동적 설정 함수
const getBackendUrl = () => {
    // 🚀 개발 중에는 이 줄 사용 (로컬 백엔드 연결)
    // return 'http://localhost:5001';

    // 🌐 프로덕션 배포 시에는 위 줄을 주석처리하고 아래 코드 사용
    const hostname = window.location.hostname;
    console.log(`🔍 현재 호스트: ${hostname}`);

    // 로컬 환경 감지 (개발용)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🏠 로컬 개발 환경');
        return 'http://localhost:5001';
    }

    // 프로덕션 환경 (배포용)
    console.log('🌐 프로덕션 환경');
    return 'https://b-bot-backend.onrender.com';
};

// 메인 App 컴포넌트
function App() {
    const [chats, setChats] = useState({}); // 모든 채팅 데이터 (객체 형태)
    const [activeChatId, setActiveChatId] = useState(null); // 현재 활성화된 채팅 ID
    const [anonymousId] = useState(getAnonymousId()); // 익명 사용자 ID (한 번만 생성)
    const [isThinking, setIsThinking] = useState(false); // 봇 응답 대기 상태
    const [isDarkMode, setIsDarkMode] = useDarkMode(); // 다크모드 상태 및 토글 함수
    const [isSidebarCollapsed, setIsSidebarCollapsed, isMobile] = useSidebarState(); // 사이드바 관련 상태들

    const backendUrl = getBackendUrl(); // 현재 환경에 맞는 백엔드 URL

    // 콘솔에 현재 사용 중인 백엔드 URL 출력 (디버깅용)
    useEffect(() => {
        console.log(`🚀 Backend URL: ${backendUrl}`);
    }, [backendUrl]);

    // 앱 시작 시 채팅 히스토리 로딩
    useEffect(() => {
        const fetchHistory = async () => {
            if (!anonymousId) return; // 익명 ID가 없으면 실행하지 않음
            try {
                // 백엔드에서 사용자의 채팅 히스토리 가져오기
                const response = await axios.get(`${backendUrl}/api/history/${anonymousId}`);
                const history = response.data;

                // 기존 채팅이 있으면 로드, 없으면 새 채팅 생성
                if (history && Object.keys(history).length > 0) {
                    setChats(history);
                    setActiveChatId(Object.keys(history)[0]); // 첫 번째 채팅을 활성화
                } else {
                    createNewChat({}); // 새 채팅 생성
                }
            } catch (error) {
                console.error("채팅 기록 로딩 실패:", error);
                console.error(`Backend URL: ${backendUrl}`);
                createNewChat({}); // 오류 시에도 새 채팅 생성
            }
        };
        fetchHistory();
    }, [anonymousId, backendUrl]);

    // 새 채팅 생성 함수
    const createNewChat = (currentChats = chats) => {
        const newChatId = generateChatId(); // 새로운 채팅 ID 생성
        const newChat = {
            id: newChatId,
            title: '새로운 대화', // 기본 제목
            messages: [], // 빈 메시지 배열
            isInitial: true, // 초기 채팅 여부 플래그
        };
        // 새 채팅을 맨 앞에 추가 (최신 순 정렬)
        setChats({[newChatId]: newChat, ...currentChats});
        setActiveChatId(newChatId); // 새 채팅을 활성화
    };

    // 채팅 삭제 함수
    const deleteChat = async (chatIdToDelete) => {
        const originalChats = {...chats}; // 원본 채팅 백업 (롤백용)
        const newChats = {...originalChats};
        delete newChats[chatIdToDelete]; // 로컬에서 먼저 삭제
        setChats(newChats);

        // 삭제된 채팅이 현재 활성 채팅이면 다른 채팅으로 전환
        if (activeChatId === chatIdToDelete) {
            const remainingChatIds = Object.keys(newChats);
            setActiveChatId(remainingChatIds.length > 0 ? remainingChatIds[0] : null);
            // 남은 채팅이 없으면 새 채팅 생성
            if (remainingChatIds.length === 0) {
                createNewChat({});
            }
        }

        try {
            // 백엔드에서도 채팅 삭제
            await axios.delete(`${backendUrl}/api/chat/${chatIdToDelete}`);
        } catch (error) {
            console.error("채팅 삭제 실패:", error);
            console.error(`Backend URL: ${backendUrl}`);
            setChats(originalChats); // 실패 시 원본 상태로 롤백
            alert("채팅 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 채팅 선택 함수
    const selectChat = (chatId) => {
        setActiveChatId(chatId); // 선택한 채팅을 활성화
        // 모바일에서 채팅 선택 시 사이드바 자동 닫기
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    };

    // 사이드바 토글 함수
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // 메시지 전송 및 봇 응답 처리 함수
    const handleSendMessage = async (messageText, options = {}) => {
        if (!activeChatId || isThinking) return; // 활성 채팅이 없거나 봇이 응답 중이면 중단

        const userMessage = {sender: 'user', text: messageText}; // 사용자 메시지 객체

        // 사용자 메시지를 채팅에 추가
        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, userMessage];
            // 첫 메시지면 채팅 제목을 해당 메시지로 설정
            if (chatToUpdate.messages.length === 1) {
                chatToUpdate.title = messageText;
            }
            // 카테고리 클릭이 아닌 경우 초기 상태 해제
            if (!options.isCategoryClick) {
                chatToUpdate.isInitial = false;
            }
            // 업데이트된 채팅을 맨 앞으로 이동 (최신 순 정렬)
            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        // 봇 응답 대기 상태 시작
        setIsThinking(true);

        // 생각 중 표시용 임시 메시지 추가
        const thinkingMessage = {
            sender: 'bot',
            text: 'thinking...',
            isThinking: true // 생각 중 메시지임을 표시하는 플래그
        };

        setChats(prevChats => {
            const chatToUpdate = {...prevChats[activeChatId]};
            chatToUpdate.messages = [...chatToUpdate.messages, thinkingMessage];
            const otherChats = {...prevChats};
            delete otherChats[activeChatId];
            return {[activeChatId]: chatToUpdate, ...otherChats};
        });

        try {
            // 백엔드로 메시지 전송 및 응답 받기
            const response = await axios.post(`${backendUrl}/api/chat`, {
                message: messageText,
                anonymousId: anonymousId,
                chatId: activeChatId,
            });

            const botMessage = {sender: 'bot', text: response.data.reply}; // 봇 응답 메시지

            // 생각 중 메시지 제거하고 실제 봇 응답 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(botMessage); // 마지막 메시지(생각 중) 제거 후 봇 응답 추가
                return {...prevChats, [activeChatId]: updatedChat};
            });

        } catch (error) {
            console.error("API 호출 오류:", error);
            console.error(`Backend URL: ${backendUrl}`);
            const errorMessage = {sender: 'bot', text: '죄송합니다, 답변을 가져오는 데 실패했습니다.'}; // 오류 메시지

            // 생각 중 메시지 제거하고 오류 메시지 추가
            setChats(prevChats => {
                const updatedChat = {...prevChats[activeChatId]};
                updatedChat.messages = updatedChat.messages.slice(0, -1).concat(errorMessage);
                return {...prevChats, [activeChatId]: updatedChat};
            });
        } finally {
            // 응답 처리 완료 후 생각 중 상태 해제
            setIsThinking(false);
        }
    };

    const activeChat = chats[activeChatId]; // 현재 활성화된 채팅 객체
    const sidebarVisible = isMobile ? !isSidebarCollapsed : true; // 모바일에서는 접힘 상태에 따라, PC에서는 항상 표시

    return (
        <div className="app-container">
            {/* 모바일 환경에서 사이드바가 열려 있을 때 배경 오버레이 */}
            {isMobile && !isSidebarCollapsed && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarCollapsed(true)} // 오버레이 클릭 시 사이드바 닫기
                />
            )}

            {/* 사이드바 컴포넌트 */}
            <Sidebar
                chats={Object.values(chats)} // 채팅 객체를 배열로 변환하여 전달
                activeChatId={activeChatId}
                onNewChat={() => createNewChat()} // 새 채팅 생성 함수
                onSelectChat={selectChat} // 채팅 선택 함수
                onDeleteChat={deleteChat} // 채팅 삭제 함수
                isDarkMode={isDarkMode}
                onToggleDarkMode={setIsDarkMode} // 다크모드 토글 함수
                isCollapsed={isSidebarCollapsed}
                isMobile={isMobile}
                isVisible={sidebarVisible}
            />

            {/* 메인 채팅 영역 */}
            <main className={`chat-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {activeChat ? (
                    <ChatWindow
                        chat={activeChat} // 현재 활성화된 채팅 데이터
                        onSendMessage={handleSendMessage} // 메시지 전송 함수
                        isThinking={isThinking} // 봇 응답 대기 상태
                        isDarkMode={isDarkMode}
                        onToggleSidebar={toggleSidebar} // 사이드바 토글 함수
                        isSidebarCollapsed={isSidebarCollapsed}
                        isMobile={isMobile}
                    />
                ) : null}
            </main>
        </div>
    );
}

export default App;