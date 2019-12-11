import APIManager from '../util/APIManager';

const AUTH_URL = 'auth/';

class AuthApi extends APIManager {
    async Authenticate(request) {
        try {
            const response = await this.post(AUTH_URL, request, false);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async register(request) {
        try {
            const reg_url = AUTH_URL + 'register/';
            const response = await this.post(reg_url, request, false);
            return response.content;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new AuthApi();