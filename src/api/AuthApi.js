import ApiManager from '../util/ApiManager';

export interface Auth {
    deviceId: string;
    deviceOs: string;
    firebaseMessagingToken?: string;
}

export interface UserAuth extends Auth {
    password: string;
    user: string;
    mfaKey: string;
    mfaCode: string;
}

export interface UserRegistration extends Auth {
    displayName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface ForgetPassword {
    phoneNumber: string;
    email: string;
    callback: string;
}

export interface ResetPassword {
    oldPassword: string;
    newPassword: string;
    user: string;
}

class AuthApi extends ApiManager {
    constructor() {
        super('auth');
    }

    async setAuth(data: Auth) {
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

    async authByFacebook(accessToken: string) {
        const data = await this.setAuth({ accessToken: accessToken });
        const headers = await this.getHeaders(false);
        const response = await this.post('/facebook', data, headers);
        return response;
    }

    async authByGoogle(accessToken: string) {
        const data = await this.setAuth({ accessToken: accessToken });
        const headers = await this.getHeaders(false);
        const response = await this.post('/google', data, headers);
        return response;
    }

    async resetPassword(request: ResetPassword) {
        const response = await this.post('/resetPassword', request, this.getHeaders(false));
        return response;
    }
}

export default new AuthApi();
