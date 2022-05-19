import ApiManager from '../util/ApiManager';
import faker from 'faker';

class AttributeApi extends ApiManager {
    constructor() {
        super('inventory/attributes');
    }

    async getAttributeTypes() {
        const response = await this.get('/types', this.getHeaders(true));
        return response;
    }

    async getAttributesByGuild(guild) {
        const response = await this.get(`/${guild}/guild`, this.getHeaders(true));
        return response;
    }

    async getAllAttribute() {
        const response = await this.get('/all-attrs', this.getHeaders(true));
        return response;
    }

    async getAttributesByProduct() {
        return this.getAttributesByGuild('Product');
    }
}

export default new AttributeApi();
