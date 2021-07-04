import ApiManager from '../util/ApiManager';

class NotificationApi extends ApiManager {
    constructor() {
        super('notifications');
    }

    async getMyNotifications(page, size, category) {
        let url = '/me?page=' + page + '&size=' + size;
        if (category) url += '&category=' + category;

        const response = await this.get(url, this.getHeaders(true));
        return response;
    }

    async getMyNotificationById(id) {
        const response = await this.get('/me/' + id, this.getHeaders(true));
        return response;
    }

    async readAllMyNotifications(category) {
        let url = '/me/readAll';
        if (category) url += '?category=' + category;
        const response = await this.put(url, {}, this.getHeaders(true));
        return response;
    }
}

export default new NotificationApi();
