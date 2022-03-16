import ApiManager from '../util/ApiManager';

class UserApi extends ApiManager {
    constructor() {
        super('system/config');
    }

    async loadSetting(name) {
        const response = await this.get('?fileName='+name, this.getHeaders(true));
        return response;
    }

    async saveSetting(data, name) {
        const response = await this.post('?fileName=' +name, data, this.getHeaders(true));
        return response;
    }
}

export default new UserApi();
