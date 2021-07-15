import ApiManager from '../util/ApiManager';

class FolderApi extends ApiManager {
    constructor() {
        super('folders');
    }

    async getTree(filter) {
        let url = '/root?filter=';
        if (filter) url += filter;
        const response = await this.get(url, this.getHeaders(true));
        return response;
    }
}
export default new FolderApi();
