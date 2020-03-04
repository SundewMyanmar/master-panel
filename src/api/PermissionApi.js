import ApiManager from '../util/ApiManager';

class PermissionApi extends ApiManager {
    constructor() {
        super('permissions');
    }

    async insertMulti(datas) {
        var url = API_URL + 'create';
        const response = await this.post(url, datas, this.getHeaders(true));

        return response;
    }

    async getAvailableRoutes() {
        var url = API_URL + 'routes';

        const response = await this.get(url, this.getHeaders(true));
        return response;
    }

    async getPermissionByRoles(role) {
        var url = API_URL + role + '/role/';

        const response = await this.get(url, this.getHeaders(true));

        return response;
    }
}

export default new PermissionApi();
