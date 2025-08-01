import React from 'react';
import ReactMarkdown from 'react-markdown';
import BusanMap from '../map/BusanMap';
import RegionButtons from '../map/RegionButtons';
import {removeMarker} from '../../utils/helpers';

const CustomMarkdown = ({children, onButtonClick, spacesData}) => {
    // children이 없으면 null 반환
    if (!children) return null;

    // 지역별 확인하기 마커 확인 및 지도 컴포넌트 표시
    if (children.includes('[REGION_MAP]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {removeMarker(children)}
                </ReactMarkdown>
                <BusanMap
                    onRegionClick={onButtonClick}
                    spacesData={spacesData}
                />
            </div>
        );
    }

    // 프로그램 지역 선택 마커 확인 및 지역 버튼들 표시
    if (children.includes('[PROGRAM_REGIONS]')) {
        return (
            <div className="custom-markdown">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>
                    }}
                >
                    {removeMarker(children)}
                </ReactMarkdown>
                <RegionButtons onButtonClick={onButtonClick}/>
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