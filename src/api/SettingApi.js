import ApiManager from '../util/ApiManager';

class UserApi extends ApiManager {
    constructor() {
        super('system/config');
    }

    async getStruct(){
      const response = await this.get('/struct', this.getHeaders(true));
      return response;
    }

    async loadSetting(name) {
        const response = await this.get('?className='+name, this.getHeaders(true));
        return response;
    }

    async saveSetting(data, name) {
        const response = await this.post('?className=' +name, data, this.getHeaders(true));
        return response;
    }
}

export default new UserApi();
