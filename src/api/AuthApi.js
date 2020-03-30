import ApiManager from '../util/ApiManager';

type Auth = {
    deviceId: string,
    deviceOs: string,
    firebaseMessagingToken?: string,
};

type UserAuth = {
    ...Auth,
    password: string,
    user: string,
};

type UserRegistration = {
    ...Auth,
    displayName: string,
    email: string,
    phoneNumber: string,
    password: string,
};

type ForgetPassword = {
    phoneNumber: string,
    email: string,
    callback: string,
};

type ResetPassword = {
    oldPassword: string,
    newPassword: string,
    user: string,
};

class AuthApi extends ApiManager {
    constructor() {
        super('auth');
    }

    async setAuth(data): Auth {
        return {
            deviceId: this.getDeviceId(),
            deviceOS: this.getDeviceOS(),
            firebaseMessagingToken: null,
            ...data,
        };
    }

    async register(request: UserRegistration) {
        const data = await this.setAuth(request);
        const response = await this.post('/register', data, this.getHeaders(false));
        return response;
    }

    async authByUserAndPassword(request: UserAuth) {
        const data = await this.setAuth(request);
        const response = await this.post('', data, this.getHeaders(false));
        return response;
    }

    async forgetPassword(request: ForgetPassword) {
        const response = await this.post('/forgetPassword', request, this.getHeaders(false));
        return response;
    }

    async authByFacebook(accessToken: string) {}

    async resetPassword(request: ResetPassword) {
        const response = await this.post('/resetPassword', request, this.getHeaders(false));
        return response;
    }
}

export default new AuthApi();
