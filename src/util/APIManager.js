import { API, STORAGE_KEYS } from '../config/Constant';
import { v4 as uuid } from 'uuid';
import Axios from 'axios';
import { osName, osVersion } from 'react-device-detect';
export default class ApiManager {
    get apiUrl() {
        return this.apiUrl;
    }

    constructor(baseURL) {
        this.apiURL = API + baseURL;
    }

    getDeviceId() {
        let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
        if (!deviceId) {
            deviceId = uuid();
            localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
        }
        return deviceId;
    }

    getDeviceOS() {
        return osName + osVersion;
    }

    getUserInfo() {
        const userData = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{"currentToken": "public-token"}';
        return JSON.parse(userData);
    }

    getHeaders(isAuth) {
        let result = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        if (isAuth) {
            try {
                const user = this.getUserInfo();
                if (user && user.currentToken) {
                    result['Authorization'] = 'Bearer ' + user.currentToken;
                }
            } catch (error) {
                if (error.response) {
                    console.warn(error.response);
                    throw error.response.data || error.response;
                }
                throw error;
            }
        }
        return result;
    }

    errorHandling(error) {
        console.warn(error.response);
        if (error.response.status === 401 || error.response.status === 403) {
            sessionStorage.clear();
        }
    }

    buildUrl(url) {
        //Clean URL '//'
        return (this.apiURL + url).replace(/(?<!https?:)\/\/+/g, '/');
    }

    async get(url, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('GET => ' + this.buildUrl(url));
            const response = await Axios.get(this.buildUrl(url), { headers });
            console.log('Response => ', response);
            return response.data;
        } catch (error) {
            this.errorHandling(error);
            throw error.response.data;
        }
    }

    async post(url, data, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('POST => ', this.buildUrl(url));
            console.log('BODY => ', data);
            const response = await Axios.post(this.buildUrl(url), data, { headers });
            console.log('Response => ', response);
            return response.data;
        } catch (error) {
            this.errorHandling(error);
            throw error.response.data;
        }
    }

    async put(url, data, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('PUT => ' + this.buildUrl(url));
            console.log('BODY => ', data);
            const response = await Axios.put(this.buildUrl(url), data, { headers });
            console.log('Response => ', response);
            return response.data;
        } catch (error) {
            this.errorHandling(error);
            throw error.response.data;
        }
    }

    async delete(url, data, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('DELETE => ' + this.buildUrl(url));
            console.log('BODY => ', data);
            const response = await Axios.delete(this.buildUrl(url), { headers, data });
            console.log('Response => ', response);
            return response.data;
        } catch (error) {
            this.errorHandling(error);
            throw error.response.data;
        }
    }

    async getPaging(page, size, sort, filter) {
        let url = '?page=' + page + '&size=' + size;
        if (sort && sort !== '') url += '&sort=' + sort;
        if (filter && filter !== '') url += '&filter=' + filter;

        const response = await this.get(url, this.getHeaders(true));
        return response;
    }

    async getById(id) {
        const response = await this.get('/' + id, this.getHeaders(true));
        return response;
    }

    async addNew(data) {
        const response = await this.post('', data, this.getHeaders(true));
        return response;
    }

    async modifyById(id, data) {
        const response = await this.put('/' + id, data, this.getHeaders(true));
        return response;
    }

    async removeById(id) {
        const response = await this.delete('/' + id, {}, this.getHeaders(true));
        return response;
    }

    async multiRemove(ids) {
        const response = await this.delete('/multi', ids, this.getHeaders(true));
        return response;
    }
}
