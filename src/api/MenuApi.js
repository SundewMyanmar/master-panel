import ApiManager from '../util/ApiManager';

class MenuApi extends ApiManager {
    constructor() {
        super('admin/menus');
    }

    async getTree(filter) {
        const response = await this.get('/tree?filter=' + filter, this.getHeaders(true));
        return response;
    }

    async getCurrentUserMenu() {
        const response = await this.get('/me', this.getHeaders(true));
        return response;
    }
}

export default new MenuApi();
