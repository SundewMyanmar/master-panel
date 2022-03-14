import ApiManager from '../util/ApiManager';

class FolderApi extends ApiManager {
    constructor() {
        super('folders');
    }

    async getTree(filter, guild) {
        let url = '/root?filter=';
        if (filter) url += filter;
        if (guild) url += '&guild='+guild;
        const response = await this.get(url, this.getHeaders(true));
        return response;
    }
}
export default new FolderApi();
