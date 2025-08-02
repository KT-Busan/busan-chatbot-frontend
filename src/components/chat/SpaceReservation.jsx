import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SpaceSearchResults from './SpaceSearchResults';
import {getBackendUrl} from '../../utils/helpers';

const SpaceReservation = ({onButtonClick}) => {
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    // 드롭다운 옵션들
    const [capacityOptions, setCapacityOptions] = useState([]);
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [optionsLoading, setOptionsLoading] = useState(true);

    const backendUrl = getBackendUrl();

    // 컴포넌트 마운트 시 필터 옵션들 로드
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setOptionsLoading(true);
                const response = await axios.get(`${backendUrl}/api/spaces/filter-options`);

                if (response.data.success) {
                    const {capacities, equipment, types} = response.data.data;
                    setCapacityOptions(capacities);
                    setEquipmentOptions(equipment);
                    setTypeOptions(types);
                } else {
                    console.error('필터 옵션 로드 실패:', response.data.message);
                    alert('검색 옵션을 불러오는 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('필터 옵션 API 호출 오류:', error);
                alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchFilterOptions();
    }, [backendUrl]);

    // 장비 선택 토글
    const toggleEquipment = (item) => {
        setSelectedEquipment(prev =>
            prev.includes(item)
                ? prev.filter(eq => eq !== item)
                : [...prev, item]
        );
    };

    // 검색 실행
    const handleSearch = async () => {
        if (!selectedCapacity) {
            alert('인원수를 선택해주세요.');
            return;
        }

        try {
            setLoading(true);

            const searchData = {
                capacity: selectedCapacity,
                equipment: selectedEquipment,
                type: selectedType
            };

            console.log('검색 요청 데이터:', searchData);

            const response = await axios.post(
                `${backendUrl}/api/spaces/reservation/search`,
                searchData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('검색 응답:', response.data);

            if (response.data.success) {
                setSearchResults(response.data);
                setShowResults(true);
            } else {
                alert(response.data.message || '검색 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('검색 API 호출 오류:', error);
            if (error.response) {
                console.error('응답 데이터:', error.response.data);
                alert(`검색 중 오류가 발생했습니다: ${error.response.data.message || '서버 오류'}`);
            } else {
                alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 검색 결과 닫기
    const closeResults = () => {
        setShowResults(false);
        setSearchResults(null);
    };

    // 검색 조건 초기화
    const resetFilters = () => {
        setSelectedCapacity('');
        setSelectedEquipment([]);
        setSelectedType('');
    };

    if (showResults) {
        return (
            <SpaceSearchResults
                results={searchResults}
                onClose={closeResults}
                onButtonClick={onButtonClick}
            />
        );
    }

    return (
        <div className="space-reservation">
            <div className="reservation-intro">
                <h3>🏢 청년 공간 예약</h3>
                <p>부산시에는 다양한 청년을 위한 공간이 존재합니다!</p>
                <p>목적에 맞게 다음 조건을 선택하여, 청년 공간을 대여해보세요!</p>
            </div>

            {optionsLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>검색 옵션을 불러오는 중...</p>
                </div>
            ) : (
                <div className="search-filters">
                    {/* 인원수 선택 */}
                    <div className="filter-group">
                        <label htmlFor="capacity-select">인원수 *</label>
                        <select
                            id="capacity-select"
                            value={selectedCapacity}
                            onChange={(e) => setSelectedCapacity(e.target.value)}
                            className="filter-select"
                            disabled={loading}
                        >
                            <option value="">인원수 선택</option>
                            {capacityOptions.map(capacity => (
                                <option key={capacity} value={capacity}>{capacity}</option>
                            ))}
                        </select>
                    </div>

                    {/* 구비물품 선택 */}
                    <div className="filter-group">
                        <label htmlFor="equipment-select">구비물품</label>
                        <div className="equipment-dropdown">
                            <select
                                id="equipment-select"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        toggleEquipment(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="filter-select"
                                disabled={loading}
                            >
                                <option value="">구비물품 선택</option>
                                {equipmentOptions.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                            {selectedEquipment.length > 0 && (
                                <div className="selected-equipment">
                                    {selectedEquipment.map(item => (
                                        <span key={item} className="equipment-tag">
                      {item}
                                            <button
                                                type="button"
                                                onClick={() => toggleEquipment(item)}
                                                disabled={loading}
                                                aria-label={`${item} 제거`}
                                            >
                        ×
                      </button>
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 구분 선택 */}
                    <div className="filter-group">
                        <label htmlFor="type-select">구분</label>
                        <select
                            id="type-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                            disabled={loading}
                        >
                            <option value="">구분 선택</option>
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="button-group">
                        <button
                            type="button"
                            className="reset-btn"
                            onClick={resetFilters}
                            disabled={loading}
                        >
                            <span>초기화</span>
                        </button>
                        <button
                            type="button"
                            className="search-btn"
                            onClick={handleSearch}
                            disabled={!selectedCapacity || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner small"></span>
                                    <span>검색 중...</span>
                                </>
                            ) : (
                                <span>검색 결과 보기</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* 선택된 조건 미리보기 */}
            {(selectedCapacity || selectedEquipment.length > 0 || selectedType) && !optionsLoading && (
                <div className="selected-conditions">
                    <h4>선택된 조건</h4>
                    <div className="condition-tags">
                        {selectedCapacity && (
                            <span className="condition-tag capacity">👥 {selectedCapacity}</span>
                        )}
                        {selectedEquipment.map(item => (
                            <span key={item} className="condition-tag equipment">🔧 {item}</span>
                        ))}
                        {selectedType && (
                            <span className="condition-tag type">🏷️ {selectedType}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceReservation;