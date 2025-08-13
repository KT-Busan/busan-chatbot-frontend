import React from 'react';
import {BUSAN_REGIONS_PROGRAMS} from '../../utils/constants';

const ProgramRegionButtons = ({onButtonClick}) => {
    return (
        <div className="program-region-section">
            <div className="program-region-header">
                <h3>🎯 청년 공간 프로그램</h3>
                <p>부산의 청년 공간에서 진행 중인 다양한 프로그램을 확인할 수 있어요!</p>
                <p>아래에서 지역을 선택하면, 마감일이 임박한 순서대로 최대 3개까지 프로그램을 보여드려요.</p>
                <div className="region-select-title">📍 지역을 선택해주세요!</div>
            </div>
            <div className="program-regions-grid-4x4">
                {BUSAN_REGIONS_PROGRAMS.map((region, index) => (
                    <button
                        key={index}
                        className="program-region-button"
                        onClick={() => onButtonClick(region)}
                    >
                        {region}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProgramRegionButtons;