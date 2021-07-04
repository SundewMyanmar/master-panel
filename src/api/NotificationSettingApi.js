import ApiManager from '../util/ApiManager';
import faker from 'faker';

class NotificationSettingApi extends ApiManager {
    constructor() {
        super('notification/settings');
    }

    async getNotificationFields() {
        const response = await this.get('/fields', this.getHeaders(true));
        return response;
    }

    async getSetting() {
        const response = await this.get('', this.getHeaders(true));
        return response;
    }

    async updateSetting(data) {
        const response = await this.put('', data, this.getHeaders(true));
        return response;
    }
}

export default new NotificationSettingApi();
