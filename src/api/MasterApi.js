import ApiManager from '../util/APIManager';

export default class MasterApi extends ApiManager {
    constructor(api) {
        super();
        this.api = api;
    }

    async getPaging(page, size, sort, filter) {
        try {
            var url = this.api + '?page=' + page + '&size=' + size;
            if (sort && sort !== '') url += '&sort=' + sort;
            if (filter && filter !== '') url += '&filter=' + filter;

            const response = await this.get(url, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async getById(id) {
        try {
            const url = this.api + id;
            const response = await this.get(url, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error.response);
            throw error;
        }
        return null;
    }

    async insert(data) {
        try {
            const response = await this.post(this.api, data, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async update(id, data) {
        try {
            const url = this.api + id;
            const response = await this.put(url, data, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async delete(id) {
        try {
            const url = this.api + id;
            const response = await this.deleteItem(url, {}, true);
            if (response.code >= 200 && response.code < 300) {
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }
}
