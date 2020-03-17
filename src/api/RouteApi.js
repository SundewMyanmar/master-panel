import ApiManager from '../util/ApiManager';

class RouteApi extends ApiManager {
    constructor() {
        super('admin/routes');
    }

    async savePermissionByRole(roleId, data) {
        const response = await this.post('/role/' + roleId, data, this.getHeaders(true));
        return response;
    }

    async getPermissionByRole(roleId) {
        const response = await this.get('/role/' + roleId, this.getHeaders(true));
        return response;
    }
}

export default new RouteApi();
