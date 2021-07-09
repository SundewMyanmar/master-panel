import ApiManager from '../util/ApiManager';
import faker from 'faker';

class CategoryApi extends ApiManager {
    constructor() {
        super('inventory/category');
    }

    static fakeData() {
        return {
            name: faker.commerce.productMaterial(),
            description: faker.lorem.lines(2),
            parent: {
                id: faker.datatype.number(),
                name: faker.commerce.productMaterial(),
                description: faker.lorem.lines(2),
                icon: faker.lorem.word(1),
            },
            icon: faker.lorem.word(1),
        };
    }

    async getPaging(page, size, sort, filter) {
        let data = [];
        for (let i = 0; i < size; i++) {
            let fakeData = CategoryApi.fakeData();
            fakeData.id = i + 1;
            data.push(fakeData);
        }

        return {
            total: size * (page + 1),
            currentPage: page,
            data: data,
            pageSize: size,
            sort: 'id:DESC',
        };
    }
}

export default new CategoryApi();
