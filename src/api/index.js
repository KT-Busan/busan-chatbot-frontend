import axios from 'axios';
import { getBackendUrl } from '../utils/helpers';

const getClient = () => {
    const baseURL = getBackendUrl();
    // Render 무료 티어는 콜드스타트 시 첫 응답이 30초를 넘기기도 하므로 여유있게 설정
    return axios.create({ baseURL, timeout: 45000 });
};

export const sendChatMessage = (message, anonymousId, chatId) =>
    getClient().post('/api/chat', { message, anonymousId, chatId });

export const fetchHistory = (anonymousId) =>
    getClient().get(`/api/history/${anonymousId}`);

export const deleteChat = (chatId) =>
    getClient().delete(`/api/chat/${chatId}`);

export const fetchCacheData = () =>
    getClient().get('/api/spaces/cache-data', { timeout: 15000 });

export const fetchKeywordData = () =>
    getClient().get('/api/spaces/keyword-data', { timeout: 15000 });

export const fetchRentalSpaces = (centerName) =>
    getClient().get(`/api/spaces/rental-spaces/${encodeURIComponent(centerName)}`);

export const fetchBusanYouth = () =>
    getClient().get('/api/spaces/busan-youth', { timeout: 15000 });
