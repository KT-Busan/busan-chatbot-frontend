import React from 'react';
import {QUICK_LINKS} from '../../utils/constants';

const QuickLinks = () => {
    return (
        <div className="quick-replies-container">
            {QUICK_LINKS.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-reply-link"
                >
                    <span className="gradient-text">{link.text}</span>
                </a>
            ))}
        </div>
    );
};

export default QuickLinks;