import {useState} from 'react';
import axios from 'axios';
import './App.css'; // 간단한 스타일링

function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {sender: 'user', text: input};
        setMessages((prev) => [...prev, userMessage]);

        try {
            // 백엔드 API(FastAPI)에 요청
            const response = await axios.post('http://127.0.0.1:8000/api/chat', {
                message: input,
            });

            const botMessage = {sender: 'bot', text: response.data.reply};
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching bot reply:", error);
            const errorMessage = {sender: 'bot', text: '죄송합니다. 응답을 가져오는 데 실패했습니다.'};
            setMessages((prev) => [...prev, errorMessage]);
        }

        setInput('');
    };

    // ... (return 문과 JSX 코드는 이전과 동일)
    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
}

export default App;