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
        Axios.defaults.withCredentials = true;
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
            const user = this.getUserInfo();
            if (user && user.currentToken) {
                result['Authorization'] = 'Bearer ' + user.currentToken;
            }
        }
        return result;
    }

    errorHandling(error) {
        console.warn('Error Response => ', error.response);
        const status = error.response && error.response.status ? error.response.status : 0;
        let message = error;
        if (error.response) {
            message = error.response;
            if (error.response.data) {
                message = error.response.data;
            }
        }
        if (status === 401 || status === 403) {
            sessionStorage.clear();
        }
        throw message;
    }

    buildUrl(url) {
        //Clean URL '//'
        return (this.apiURL + url).replace(/([^:]\/)\/+/g, '$1');
    }

    buildFormData(data) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    }

    customLink(url, isPublic) {
        let result = this.buildUrl(url);
        if (!isPublic) {
            const user = this.getUserInfo();
            result += '?accessToken=' + user.currentToken;
        }

        return result;
    }

    async getBase64(url, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('GET => ' + this.buildUrl(url));
            const response = await Axios.get(this.buildUrl(url), { headers: headers, responseType: 'arraybuffer' });
            console.log('Response => ', response);
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            return base64;
        } catch (error) {
            throw this.errorHandling(error);
        }
    }

    async get(url, headers) {
        try {
            console.log('Headers =>', headers);
            console.log('GET => ' + this.buildUrl(url));
            const response = await Axios.get(this.buildUrl(url), { headers });
            console.log('Response => ', response);
            return response.data;
        } catch (error) {
            throw this.errorHandling(error);
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
            throw this.errorHandling(error);
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
            throw error;
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
            throw this.errorHandling(error);
        }
    }

    async getPaging(page, size = 10, sort = 'modifiedAt:DESC', filter = '') {
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

    async getStructure() {
        const response = await this.get('/struct', this.getHeaders(true));
        return response;
    }

    async importData(data) {
        const response = await this.post('/import', data, this.getHeaders(true));
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

    async removeAll(ids) {
        const response = await this.delete('/', ids, this.getHeaders(true));
        return response;
    }

    async fileUpload(file, fieldName, folder) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        formData.append('fieldName', fieldName);
        if (file.name) {
            formData.append('uploadedFile', file);
        } else {
            for (let i = 0; i < file.length; i++) {
                formData.append('uploadedFile', file[i]);
            }
        }

        if (folder) formData.append('folder', folder);

        const response = await this.post('/upload', formData, headers);
        if (response.count === 1) {
            return response.data;
        }

        return response;
    }
}
