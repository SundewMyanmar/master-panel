import ApiManager from '../util/ApiManager';
import faker from 'faker';
import FormatManager from '../util/FormatManager';

class CategoryApi extends ApiManager {
    constructor() {
        super('inventory/categories');
    }

    async getParentPaging(parent, page, size, sort, filter) {
        let url = '?page=' + page + '&size=' + size;
        if (sort && sort !== '') url += '&sort=' + sort;
        if (filter && filter !== '') url += '&filter=' + filter;
        if (parent) url = "&parent=" + parent;

        const response = await this.get(url + '/parent', this.getHeaders(true));
        return response;
    }
}

export default new CategoryApi();
