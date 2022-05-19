import ApiManager from '../util/ApiManager';
import faker, { random } from 'faker';
import FormatManager from '../util/FormatManager';

class ProductPricingApi extends ApiManager {
    constructor() {
        super('inventory/product/pricings');
    }

    async fakeOne() {
        return {
            type: ['Whole', 'Retail', 'Dealer'][FormatManager.randomInt(2)],
            startedAt: new Date(faker.date.past()).getTime(),
            endAt: new Date(faker.date.past()).getTime(),
            minQty: FormatManager.randomInt(20),
            pricePerUnit: FormatManager.randomInt(1000000),
            changedPercent: FormatManager.randomInt(99),
            includeDelivery: [true, false][FormatManager.randomInt(1)],
            includeTax: [true, false][FormatManager.randomInt(1)],
        };
    }

    async getOne() {
        return await this.fakeOne();
    }

    async fakeList(count) {
        let data = [];
        for (let i = 0; i < count; i++) {
            let fakeData = await this.fakeOne();
            fakeData.id = i + 1;
            data.push(fakeData);
        }
        return data;
    }

    async fakePaging(page, size, sort, filter) {
        let data = await this.fakeList(size);
        return {
            total: size * (page + 1),
            currentPage: page,
            data: data,
            pageSize: size,
            sort: 'id:ASC',
        };
    }
}

export default new ProductPricingApi();