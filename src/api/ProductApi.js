import ApiManager from '../util/ApiManager';
import faker, { random } from 'faker';

class ProductApi extends ApiManager {
    constructor() {
        super('inventory/product');
    }

    async fakeOne() {
        return {
            code: faker.datatype.string(5),
            name: faker.datatype.string(20),
            relatedUom: faker.datatype.number(10),
            relation: faker.datatype.float(2),
            group: faker.datatype.string(10),
        };
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
        let data = await this.fakerList(size);
        return {
            total: size * (page + 1),
            currentPage: page,
            data: data,
            pageSize: size,
            sort: 'id:ASC',
        };
    }
}

export default new ProductApi();
