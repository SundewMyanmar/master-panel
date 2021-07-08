import ApiManager from '../util/ApiManager';
import faker, { random } from 'faker';

class ProductApi extends ApiManager {
    constructor() {
        //TODO: change route
        super('products');
    }

    async getRelatedPaging(id, page, size, sort, filter) {
        let url = '/related/' + id + '/paging?page=' + page + '&size=' + size;
        if (sort && sort !== '') url += '&sort=' + sort;
        if (filter && filter !== '') url += '&filter=' + filter;
        const response = await this.get(url, this.getHeaders(true));
        return response;
    }

    async getRelatedByProductId(id) {
        const response = await this.get('/related/' + id, this.getHeaders(true));
        return response;
    }

    async fakerBatch() {
        let len = faker.random.number(5);
        let result = [];
        for (let i = 0; i < len; i++) {
            result.push({
                id: i,
                batchCode: faker.address.zipCode(),
                manufactureDate: faker.date.past(),
                expiredDate: faker.date.future(),
                currentBalance: faker.random.number(500),
            });
        }

        return result;
    }

    async fakerPricing() {
        let len = faker.random.number(5);
        let result = [];
        for (let i = 0; i < len; i++) {
            result.push({
                product: {
                    name: faker.commerce.productName(),
                },
                customerClass: {
                    name: ['PLATINUM', 'SILVER', 'GOLD', 'DIAMOND'][faker.random.number(3)],
                },
                startDate: faker.date.past(),
                endDate: faker.date.future(),
                pricePerUnit: faker.random.number(500000),
            });
        }
        return result;
    }

    async fakerDiscount() {
        let len = faker.random.number(5);
        let result = [];
        for (let i = 0; i < len; i++) {
            result.push({
                product: {
                    name: faker.commerce.productName(),
                },
                startDate: faker.date.past(),
                endDate: faker.date.future(),
                minQty: faker.random.number(50),
                discountAmount: faker.random.number(10000),
                discountPercent: faker.random.number(50),
                remark: faker.commerce.productAdjective(),
            });
        }
        return result;
    }

    async faker() {
        let batches = await this.fakerBatch();
        let pricings = await this.fakerPricing();
        let discounts = await this.fakerDiscount();

        return {
            image1: {
                id: faker.random.uuid(),
                url: faker.image.food(128, 128),
                urls: {
                    public: faker.image.food(128, 128),
                },
                publicAccess: true,
            },
            image2: {
                id: faker.random.uuid(),
                url: faker.image.food(128, 128),
                urls: {
                    public: faker.image.food(128, 128),
                },
                publicAccess: true,
            },
            code: faker.address.zipCode(),
            name: faker.commerce.productName(),
            brand: {
                name: faker.company.companyName(),
            },
            type: {
                name: faker.commerce.productAdjective(),
            },
            group: {
                name: faker.commerce.productMaterial(),
            },
            supplementInfos: [
                {
                    id: 1,
                    name: faker.commerce.color(),
                    value: faker.commerce.productAdjective(),
                    sorting: '1',
                    isBold: true,
                    isNewLine: true,
                    isItem: true,
                },
                {
                    id: 1,
                    name: faker.commerce.color(),
                    value: faker.commerce.productAdjective(),
                    sorting: 1,
                    isBold: true,
                    isNewLine: true,
                    isItem: true,
                },
                {
                    id: 1,
                    name: faker.commerce.color(),
                    value: faker.commerce.productAdjective(),
                    sorting: 0,
                    isBold: true,
                    isNewLine: true,
                    isItem: true,
                },
            ],
            supplementFacts: [
                {
                    id: 1,
                    name: faker.commerce.color(),
                    value: faker.commerce.productMaterial(),
                    dataRow: 2,
                    dataColumn: 1,
                    isHeader: true,
                },
                {
                    id: 2,
                    name: faker.commerce.color(),
                    value: faker.commerce.productMaterial(),
                    dataRow: 0,
                    dataColumn: -1,
                    isHeader: false,
                },
            ],
            description: faker.commerce.department(),
            shippingWeight: faker.random.number(1000),
            reorderLevel: faker.random.number(50),
            packageQuantity: faker.random.number(500),
            dimension: `${faker.random.number(50)}x${faker.random.number(50)}x${faker.random.number(50)} cm`,
            /*dimension (...x...x... cm) */
            isBatch: faker.random.boolean(),
            remark: faker.commerce.productAdjective(),
            needAttachment: faker.random.boolean(),
            isBestSelling: faker.random.boolean(),
            /*Attach when order product */
            status: 'ACTIVE',
            batches: batches,
            prices: pricings,
            discounts: discounts,
        };
    }

    async fakerList(count) {
        let data = [];
        for (let i = 0; i < count; i++) {
            let fakeData = await this.faker();
            fakeData.id = i + 1;
            data.push(fakeData);
        }

        return data;
    }

    async fakerPaging(count) {
        let data = await this.fakerList(count);
        return {
            total: 100,
            currentPage: 0,
            data: data,
            pageSize: 5,
            sort: 'id:ASC',
        };
    }
}

export default new ProductApi();
