import ApiManager from '../util/APIManager';

const API_URL = 'me/';

class ProfileApi extends ApiManager {

    async getAll() {
        try {
            const url = API_URL;
            const response = await this.get(url, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error.response);
            throw error;
        }
        return null;
    }

    async updateProfile(data) {
        try {
            const url = API_URL;
            const response = await this.post(url, data, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error.response);
            throw error.response;
        }
        return null;
    }

    async changePassword(data) {
        try {
            const url = API_URL + "changePassword";
            const response = await this.post(url, data, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error.response);
            throw error.response;
        }
        return null;
    }
}

export default new ProfileApi();