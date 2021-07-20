import ApiManager from '../util/ApiManager';

class ProfileApi extends ApiManager {
    constructor() {
        super('me');
    }
    async getProfile() {
        const response = await this.get('', this.getHeaders(true));
        return response;
    }

    async updateProfile(data) {
        const response = await this.post('', data, this.getHeaders(true));
        return response;
    }

    async changePassword(data) {
        const response = await this.post('/changePassword', data, this.getHeaders(true));
        return response;
    }

    async cleanTokens() {
        const response = await this.delete('/cleanToken', this.getHeaders(true));
        return response;
    }

    async refreshToken(tokenString) {
        const response = await this.post(
            '/refreshToken',
            {
                deviceId: this.getDeviceId(),
                deviceOS: this.getDeviceOS(),
                firebaseMessagingToken: tokenString,
            },
            this.getHeaders(true),
        );
        return response;
    }
}

export default new ProfileApi();
