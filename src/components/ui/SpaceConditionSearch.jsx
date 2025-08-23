import React, {useState} from 'react';
import axios from 'axios';
import '../../styles/components/space-detail-search.css';

const SpaceConditionSearch = ({onButtonClick, anonymousId}) => {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showConditions, setShowConditions] = useState(false);
    const [showRandomResult, setShowRandomResult] = useState(false);

    const regions = [
        '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구',
        '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'
    ];

    const capacities = [
        {value: '1-2명', icon: '👤', label: '1–2명'},
        {value: '3-6명', icon: '👥', label: '3–6명'},
        {value: '7명이상', icon: '👨‍👩‍👧‍👦', label: '7명 이상'},
        {value: '상관없음', icon: '❓', label: '상관없음'}
    ];

    const purposes = [
        {value: '교육/강연', icon: '🎤', label: '교육/강연'},
        {value: '문화/창작', icon: '🎨', label: '문화/창작'},
        {value: '스터디/회의', icon: '📝', label: '스터디/회의'},
        {value: '작업/창작실', icon: '🛠', label: '작업/창작실'},
        {value: '진로/창업', icon: '🚀', label: '진로/창업'},
        {value: '커뮤니티', icon: '👥', label: '커뮤니티'},
        {value: '행사/이벤트', icon: '🎪', label: '행사/이벤트'},
        {value: '휴식/놀이', icon: '🧘', label: '휴식/놀이'}
    ];

    const getBackendUrl = () => {
        const hostname = window.location.hostname;

        if (hostname.includes('github.io') || hostname.includes('kt-busan.github.io')) {
            return 'https://b-bot-backend.onrender.com';
        }

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5001';
        }

        return 'https://b-bot-backend.onrender.com';
    };

    const handleSearch = async () => {
        if (!selectedRegion && !selectedCapacity && !selectedPurpose) {
            alert('지역, 인원, 이용 목적 중 하나는 반드시 선택해주세요.');
            return;
        }

        const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;

        setShowConditions(true);
        setIsSearching(true);
        setSearchResults(null);
        setShowRandomResult(false);

        try {
            const searchConditions = [];
            if (selectedRegion) searchConditions.push(`지역=${selectedRegion}`);
            if (selectedCapacity) searchConditions.push(`인원=${selectedCapacity}`);
            if (selectedPurpose) searchConditions.push(`목적=${selectedPurpose}`);

            const searchMessage = `조건별 검색: ${searchConditions.join('|')}`;
            const chatId = `search_${Date.now()}`;

            const requestData = {
                message: searchMessage,
                anonymousId: finalAnonymousId,
                chatId: chatId
            };

            const isGitHubPages = window.location.hostname.includes('github.io');
            const backendUrl = 'https://b-bot-backend.onrender.com';

            let apiUrl;
            if (isGitHubPages || !window.location.hostname.includes('localhost')) {
                apiUrl = `${backendUrl}/api/chat`;
            } else {
                apiUrl = '/api/chat';
            }

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            if (response.data && response.data.reply) {
                onButtonClick('__BOT_RESPONSE__' + response.data.reply);

                setSearchResults({
                    success: true,
                    message: '검색 결과를 표시했습니다!',
                    conditions: {
                        region: selectedRegion,
                        capacity: selectedCapacity,
                        purpose: selectedPurpose
                    }
                });
            } else {
                throw new Error('검색 응답을 받지 못했습니다.');
            }

        } catch (error) {
            console.error('❌ 검색 중 오류:', error);
            console.error('❌ 요청 URL:', error.config?.url);

            let errorMessage = '검색 중 오류가 발생했습니다.';

            if (error.code === 'ECONNABORTED') {
                errorMessage = '요청 시간이 초과되었습니다. Render 서버가 깨어나는 중일 수 있습니다.';
            } else if (error.response?.status === 404) {
                errorMessage = 'API 엔드포인트를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.';
            } else if (error.response?.status === 500) {
                errorMessage = '서버 내부 오류가 발생했습니다.';
            } else if (!error.response) {
                errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.';
            }

            setSearchResults({
                success: false,
                message: errorMessage,
                conditions: {
                    region: selectedRegion,
                    capacity: selectedCapacity,
                    purpose: selectedPurpose
                }
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleRandomRecommendation = async () => {
        setIsSearching(true);

        try {
            const finalAnonymousId = anonymousId || `temp_user_${Date.now()}`;

            const isGitHubPages = window.location.hostname.includes('github.io');
            const backendUrl = 'https://b-bot-backend.onrender.com';

            let apiUrl;
            if (isGitHubPages || !window.location.hostname.includes('localhost')) {
                apiUrl = `${backendUrl}/api/chat`;
            } else {
                apiUrl = '/api/chat';
            }

            const response = await axios.post(apiUrl, {
                message: '✨ 랜덤 추천',
                anonymousId: finalAnonymousId,
                chatId: `random_${Date.now()}`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            if (response.data && response.data.reply) {
                onButtonClick('__BOT_RESPONSE__' + response.data.reply);

                setShowRandomResult(true);
                setSearchResults(null);
                setShowConditions(false);
            } else {
                throw new Error('랜덤 추천 응답을 받지 못했습니다.');
            }

        } catch (error) {
            console.error('랜덤 추천 중 오류:', error);

            let errorMessage = '랜덤 추천 중 오류가 발생했습니다.';
            if (error.code === 'ECONNABORTED') {
                errorMessage = '요청 시간이 초과되었습니다. 서버가 준비 중일 수 있습니다.';
            }

            setSearchResults({
                success: false,
                message: errorMessage,
                isRandom: true
            });
        } finally {
            setIsSearching(false);
        }
    };

    const resetSearch = () => {
        setSelectedRegion('');
        setSelectedCapacity('');
        setSelectedPurpose('');
        setShowConditions(false);
        setSearchResults(null);
        setIsSearching(false);
        setShowRandomResult(false);
    };

    return (
        <div className="space-detail-search">
            <div className="search-header">
                <h3>🔍 청년 공간 조건별 검색</h3>
                <p>아래 조건을 선택하여 나에게 딱 맞는 청년 공간을 찾을 수 있어요!</p>
                <p>대관 가능 여부와 링크도 함께 확인할 수 있어요.</p>
            </div>

            {!showConditions && !searchResults && !showRandomResult && (
                <div className="search-filters-container">
                    <div className="filter-section">
                        <label>지역 선택</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">지역 선택</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label>인원 선택</label>
                        <select
                            value={selectedCapacity}
                            onChange={(e) => setSelectedCapacity(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">인원 선택</option>
                            {capacities.map(capacity => (
                                <option key={capacity.value} value={capacity.value}>
                                    {capacity.icon} {capacity.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <label>이용 목적 선택</label>
                        <select
                            value={selectedPurpose}
                            onChange={(e) => setSelectedPurpose(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">목적 선택</option>
                            {purposes.map(purpose => (
                                <option key={purpose.value} value={purpose.value}>
                                    {purpose.icon} {purpose.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <button
                            className="search-detail-btn"
                            onClick={handleSearch}
                            disabled={!selectedRegion && !selectedCapacity && !selectedPurpose}
                        >
                            🔎 검색 결과 보기
                        </button>
                    </div>

                    <div className="filter-section">
                        <button
                            className="random-recommend-btn-main"
                            onClick={handleRandomRecommendation}
                            disabled={isSearching}
                        >
                            🎲 랜덤 추천
                        </button>
                    </div>
                </div>
            )}

            {showConditions && !searchResults && (
                <div className="search-status">
                    <div className="selected-conditions">
                        <h4>✅ 선택하신 조건</h4>
                        <ul>
                            <li>• 지역 : {selectedRegion || '선택하지 않음'}</li>
                            <li>• 인원 : {selectedCapacity || '선택하지 않음'}</li>
                            <li>• 목적 : {selectedPurpose || '선택하지 않음'}</li>
                        </ul>
                    </div>

                    {isSearching && (
                        <div className="searching-status">
                            <div className="loading-spinner"></div>
                            <p>🔎 조건에 맞는 공간을 찾고 있어요...</p>
                        </div>
                    )}
                </div>
            )}

            {searchResults && (
                <div className="search-results">
                    <div className="results-header">
                        <h4>{searchResults.success ? '✅ 검색 완료!' : '❌ 검색 실패'}</h4>
                        <p>{searchResults.message}</p>
                    </div>
                </div>
            )}

            {showRandomResult && (
                <div className="additional-random-section">
                    <p>💡 다른 랜덤 공간이 궁금하시다면?</p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button
                            className="additional-random-btn"
                            onClick={handleRandomRecommendation}
                            disabled={isSearching}
                        >
                            🎲 다시 랜덤 추천
                        </button>
                        <button
                            className="new-search-btn"
                            onClick={resetSearch}
                        >
                            🔄 새로 검색하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceConditionSearch;