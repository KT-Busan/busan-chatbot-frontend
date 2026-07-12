import React, {useState} from 'react';
import { submitErrorReport } from '../../api';

const CATEGORY_OPTIONS = ['홈페이지', '전화번호', '주소', '기타'];

// 카카오맵처럼 사용자가 직접 센터 정보 오류를 신고할 수 있는 버튼 + 폼.
// 실시간 API가 아닌 자체 DB 기반 서비스라 현장 정보 변경이 바로 반영되지 않는 문제를 보완한다.
const ReportErrorButton = ({centerName, anonymousId}) => {
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('신고 내용을 입력해주세요.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await submitErrorReport({
                center_name: centerName,
                category,
                content: content.trim(),
                anonymous_id: anonymousId || null
            });
            setSubmitted(true);
        } catch (err) {
            console.error('❌ 오류 신고 제출 실패:', err);
            setError('신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="report-error-container">
                <p className="report-error-success">✅ 신고가 접수되었습니다. 확인 후 반영하겠습니다.</p>
            </div>
        );
    }

    if (!open) {
        return (
            <div className="report-error-container">
                <button type="button" className="report-error-toggle-btn" onClick={() => setOpen(true)}>
                    ⚠️ 정보 오류 신고
                </button>
            </div>
        );
    }

    return (
        <div className="report-error-container">
            <form className="report-error-form" onSubmit={handleSubmit}>
                <label className="report-error-label">
                    신고 항목
                    <select
                        className="report-error-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>

                <label className="report-error-label">
                    상세 내용
                    <textarea
                        className="report-error-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="예) 전화번호가 결번입니다."
                        rows={3}
                    />
                </label>

                {error && <p className="report-error-message">❌ {error}</p>}

                <div className="report-error-actions">
                    <button
                        type="button"
                        className="report-error-cancel-btn"
                        onClick={() => setOpen(false)}
                        disabled={submitting}
                    >
                        취소
                    </button>
                    <button type="submit" className="report-error-submit-btn" disabled={submitting}>
                        {submitting ? '제출 중...' : '제출하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportErrorButton;
