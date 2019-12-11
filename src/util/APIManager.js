import { API_URL, STORAGE_KEYS } from "../config/Constant";
import Axios from 'axios';

export default class APIManager {
    async getHeaders(isAuth) {
        let result = {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        if (isAuth) {
            try {
                const userData = await sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'public-token';
                const jsonUserData = JSON.parse(userData);
                if (jsonUserData && jsonUserData.current_token) {
                    result['Authorization'] = "Bearer " + jsonUserData.current_token;
                }
            } catch (error) {
                console.warn(error.response);
                throw error;
            }
        }
        return result;
    }

    async get(url, isAuth) {
        try {
            const headers = await this.getHeaders(isAuth);
            console.log('Headers =>', headers);
            console.log("GET => " + API_URL + url);
            const response = await Axios.get(API_URL + url, { headers });
            console.log("Response => ", response);
            return response.data;
        } catch (error) {
            console.warn(error);
            throw error;
        }
    }

    async post(url, data, isAuth) {
        try {
            const headers = await this.getHeaders(isAuth);
            console.log('Headers =>', headers);
            console.log("POST => ", API_URL + url);
            console.log("BODY => ", data);
            const response = await Axios.post(API_URL + url, data, { headers });
            console.log("Response => ", response);
            return response.data;
        } catch (error) {
            console.warn(error.response);
            throw error;
        }
    }

    async put(url, data, isAuth) {
        try {
            const headers = await this.getHeaders(isAuth);
            console.log('Headers =>', headers);
            console.log("PUT => " + API_URL + url);
            console.log("BODY => ", data);
            const response = await Axios.put(API_URL + url, data, { headers });
            console.log("Response => ", response);
            return response.data;
        } catch (error) {
            console.warn(error);
            throw error;
        }
    }

    async deleteItem(url, data, isAuth) {
        try {
            const headers = await this.getHeaders(isAuth);
            console.log('Headers =>', headers);
            console.log("DELETE => " + API_URL + url);
            console.log("BODY => ", data);
            const response = await Axios.delete(API_URL + url, { headers, data });
            console.log("Response => ", response);
            return response.data;
        } catch (error) {
            console.warn(error.response);
            throw error.response.data;
        }
    }

}