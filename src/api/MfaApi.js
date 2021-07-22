import { file } from '@babel/types';
import React from 'react';
import ApiManager from '../util/ApiManager';

type MfaSetup = {
    key: string,
    type: 'EMAIL' | 'SMS' | 'APP',
    totp: true,
    main: true,
};

class MfaApi extends ApiManager {
    constructor() {
        super('mfa');
    }

    appQrLink(noMargin = true, width = 128) {
        const user = this.getUserInfo();
        let url = this.buildUrl('/qr');
        url += `?accessToken=${user.currentToken}&noMargin=${noMargin}&width=${width}`;
        return url;
    }

    async resend(userId, key) {
        const headers = this.getHeaders(false);
        const response = await this.get(`/resend?key=${key}&userId=${userId}`, headers);
        return response;
    }

    async setup(data: MfaSetup) {
        const headers = this.getHeaders(true);
        const response = await this.post('/setup', data, headers);
        return response;
    }

    async disable() {
        const headers = this.getHeaders(true);
        const response = await this.get('/disable', headers);
        return response;
    }

    async verify(totp, key) {
        const headers = this.getHeaders(true);
        let url = `/verify?totp=${totp}`;
        if (key) {
            url += `&key=${key}`;
        }
        const response = await this.get(url, headers);
        return response;
    }

    async remove(id) {
        const headers = this.getHeaders(true);
        const response = await this.delete(`/remove/${id}`, null, headers);
        return response;
    }

    async setDefault(id) {
        const headers = this.getHeaders(true);
        const response = await this.get(`/default/${id}`, headers);
        return response;
    }
}

export default new MfaApi();
