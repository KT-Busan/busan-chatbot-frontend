import React from 'react';
import ReactMarkdown from 'react-markdown';
import BusanMap from '../map/BusanMap';
import KeywordButtons from '../ui/KeywordButtons';
import ProgramRegionButtons from '../ui/ProgramRegionButtons';
import SpaceDetailSearch from '../ui/SpaceDetailSearch';
import {removeMarker} from '../../utils/helpers';

const CustomMarkdown = ({children, onButtonClick, spacesData, anonymousId}) => {
    // children이 없으면 null 반환
    if (!children) return null;

    // 행정구역별 확인하기 마커 확인 및 지도 컴포넌트 표시
    if (children.includes('[REGION_MAP]')) {
        return (
            <BusanMap
                onRegionClick={onButtonClick}
                spacesData={spacesData}
            />
        );
    }

    // 키워드별 확인하기 마커 확인 및 키워드 버튼들 표시
    if (children.includes('[KEYWORD_BUTTONS]')) {
        return (
            <KeywordButtons onButtonClick={onButtonClick}/>
        );
    }

    // 프로그램 지역 선택 마커 확인 및 지역 버튼들 표시
    if (children.includes('[PROGRAM_REGIONS]')) {
        return (
            <ProgramRegionButtons onButtonClick={onButtonClick}/>
        );
    }

    // 청년 공간 상세 검색 마커 확인 및 상세 검색 컴포넌트 표시
    if (children.includes('[SPACE_DETAIL_SEARCH]')) {
        return (
            <SpaceDetailSearch
                onButtonClick={onButtonClick}
                anonymousId={anonymousId}
            />
        );
    }

    // 🔥 수정: 랜덤 추천 후 추가 랜덤 추천 버튼 마커 처리 - 버튼들을 한 줄에 배치
    if (children.includes('[SHOW_ADDITIONAL_RANDOM]')) {
        // 마커를 제거하고 내용 + 추가 랜덤 추천 버튼 표시
        const contentWithoutMarker = children.replace('[SHOW_ADDITIONAL_RANDOM]', '');

        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {contentWithoutMarker}
                </ReactMarkdown>

                {/* 🔥 수정: 랜덤 추천 후 버튼들을 한 줄에 배치 */}
                <div className="markdown-additional-random-section">
                    <p className="markdown-additional-random-text">
                        💡 다른 랜덤 공간이 궁금하시다면?
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('✨ 랜덤 추천')}
                        >
                            🎲 다시 랜덤 추천
                        </button>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('청년 공간 상세')}
                        >
                            🔄 새로 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 백엔드의 조건별 검색 결과 마커 처리
    if (children.includes('[SHOW_CONDITIONAL_SEARCH_BUTTONS]')) {
        // 마커를 제거하고 내용 + 조건별 검색 결과 버튼 표시
        const contentWithoutMarker = children.replace('[SHOW_CONDITIONAL_SEARCH_BUTTONS]', '');

        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {contentWithoutMarker}
                </ReactMarkdown>

                {/* 조건별 검색 결과 후 랜덤 추천 버튼 섹션 */}
                <div className="markdown-additional-random-section">
                    <p className="markdown-additional-random-text">
                        💡 다른 공간을 보고싶다면?
                    </p>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('✨ 랜덤 추천')}
                        >
                            🎲 랜덤 추천
                        </button>
                        <button
                            className="markdown-additional-random-btn"
                            onClick={() => onButtonClick('청년 공간 상세')}
                        >
                            🔄 새로 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 마커가 없는 경우 기본 마크다운 렌더링
    return (
        <div className="custom-markdown">
            <ReactMarkdown
                components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default CustomMarkdown;