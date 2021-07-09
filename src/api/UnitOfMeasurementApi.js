import ApiManager from '../util/ApiManager';
import faker from 'faker';

class UnitOfMeasurementApi extends ApiManager {
    constructor() {
        super('inventory/uom');
    }

    static fakeData() {
        return {
            code: faker.random.alpha({ count: 3 }),
            name: faker.lorem.words(3),
            relatedUom: {
                code: faker.random.alpha({ count: 3 }),
                name: faker.lorem.words(3),
                relatedUom: faker.datatype.number(10),
                relation: faker.datatype.float(2),
                group: faker.datatype.string(10),
            },
            relation: faker.datatype.float(2),
            group: faker.datatype.string(10),
        };
    }

    async getPaging(page, size, sort, filter) {
        let data = [];
        for (let i = 0; i < size; i++) {
            let fakeData = UnitOfMeasurementApi.fakeData();
            fakeData.id = i + 1;
            data.push(fakeData);
        }

        return {
            total: size * (page + 1),
            currentPage: page,
            data: data,
            pageSize: size,
            sort: 'id:ASC',
        };
    }
}

export default new UnitOfMeasurementApi();
