import ApiManager from '../util/ApiManager';

class MenuApi extends ApiManager {
    constructor() {
        super('menus');
    }

    async getByRole(data) {
        const response = await this.get('roles?ids=' + data, this.getHeaders(true));
        return response;
    }
}

export default new MenuApi();
