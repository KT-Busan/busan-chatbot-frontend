import React from 'react';
import BusanMap from '../map/BusanMap';
import SpaceConditionSearch from '../ui/SpaceConditionSearch';
import SpaceListView from '../ui/SpaceListView';
import ProgramRegionButtons from '../ui/ProgramRegionButtons';
import ConditionalSearchButtons from '../ui/ConditionalSearchButtons';
import CenterListView from '../ui/CenterListView';
import CenterDetailView from '../ui/CenterDetailView';

const CustomMarkdown = ({children, onButtonClick, spacesData, anonymousId}) => {
    if (children === '[SPACE_LIST_VIEW]') {
        return <SpaceListView onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[CENTER_LIST_VIEW]') {
        return <CenterListView onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[REGION_MAP]') {
        return <BusanMap onRegionClick={onButtonClick} spacesData={spacesData}/>;
    }

    if (children === '[SPACE_CONDITION_SEARCH]') {
        return <SpaceConditionSearch onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[PROGRAM_REGIONS]') {
        return <ProgramRegionButtons onButtonClick={onButtonClick}/>;
    }

    if (children === '[SHOW_CONDITIONAL_SEARCH_BUTTONS]') {
        return <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (children === '[SHOW_ADDITIONAL_RANDOM]') {
        return <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (typeof children === 'string' && children.startsWith('[CENTER_RENTAL_SPACES:')) {
        const centerName = children.replace('[CENTER_RENTAL_SPACES:', '').replace(']', '');
        return <CenterDetailView centerName={centerName} onButtonClick={onButtonClick} anonymousId={anonymousId}/>;
    }

    if (typeof children === 'string' && children.includes('[SPACE_CONDITION_SEARCH]')) {
        const parts = children.split('[SPACE_CONDITION_SEARCH]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <SpaceConditionSearch onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[SHOW_CONDITIONAL_SEARCH_BUTTONS]')) {
        const parts = children.split('[SHOW_CONDITIONAL_SEARCH_BUTTONS]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[SHOW_ADDITIONAL_RANDOM]')) {
        const parts = children.split('[SHOW_ADDITIONAL_RANDOM]');
        return (
            <div>
                {parts[0] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[0]}</CustomMarkdown>}
                <ConditionalSearchButtons onButtonClick={onButtonClick} anonymousId={anonymousId}/>
                {parts[1] && <CustomMarkdown onButtonClick={onButtonClick} spacesData={spacesData}
                                             anonymousId={anonymousId}>{parts[1]}</CustomMarkdown>}
            </div>
        );
    }

    if (typeof children === 'string' && children.includes('[CENTER_RENTAL_SPACES:')) {
        const parts = children.split(/(\[CENTER_RENTAL_SPACES:[^\]]+\])/);
        return (
            <div>
                {parts.map((part, index) => {
                    if (part.startsWith('[CENTER_RENTAL_SPACES:')) {
                        const centerName = part.replace('[CENTER_RENTAL_SPACES:', '').replace(']', '');
                        return <CenterDetailView key={index} centerName={centerName} onButtonClick={onButtonClick}
                                                 anonymousId={anonymousId}/>;
                    } else if (part.trim()) {
                        return <CustomMarkdown key={index} onButtonClick={onButtonClick} spacesData={spacesData}
                                               anonymousId={anonymousId}>{part}</CustomMarkdown>;
                    }
                    return null;
                })}
            </div>
        );
    }

    const processText = (text) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }

            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="message-link"
                >
                    {match[1]}
                </a>
            );

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts.length > 1 ? parts : text;
    };

    const lines = children.split('\n');

    return (
        <div className="message-text">
            {lines.map((line, index) => {
                const processedLine = processText(line);

                if (line.trim() === '') {
                    return <br key={index}/>;
                }

                if (line.trim() === '---') {
                    return (
                        <hr key={index} style={{
                            border: 'none',
                            borderTop: '1px solid #e1e5e9',
                            margin: '16px 0'
                        }}/>
                    );
                }

                if (line.startsWith('## ')) {
                    return (
                        <h3 key={index} className="message-heading">
                            {processText(line.slice(3))}
                        </h3>
                    );
                }

                if (line.startsWith('# ')) {
                    return (
                        <h2 key={index} className="message-title">
                            {processText(line.slice(2))}
                        </h2>
                    );
                }

                const boldRegex = /\*\*([^*]+)\*\*/g;
                if (boldRegex.test(line)) {
                    const boldProcessedLine = line.replace(boldRegex, '<strong>$1</strong>');
                    return (
                        <p key={index} dangerouslySetInnerHTML={{__html: processText(boldProcessedLine)}}/>
                    );
                }

                return (
                    <p key={index}>
                        {Array.isArray(processedLine) ? processedLine : processedLine}
                    </p>
                );
            })}
        </div>
    );
};

export default CustomMarkdown;