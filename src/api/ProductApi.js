import ApiManager from '../util/ApiManager';
import faker, { random } from 'faker';
import FormatManager from '../util/FormatManager';
import { BARCODE_TYPES } from '../config/Constant';

class ProductApi extends ApiManager {
    constructor() {
        super('inventory/products');
    }

    async getBarcodeTypes() {
        const response = await this.get('/barcodes', this.getHeaders(true));
        return response;
    }

    // async randomImage() {
    //     if (FormatManager.randomInt(2) % 2 == 0) {
    //         return await faker.image.food();
    //     } else
    //         return await faker.image.fashion();
    // }

    // async fakeImageOne() {
    //     let result1 = await this.randomImage();
    //     let result2 = await this.randomImage();
    //     return {
    //         image: {
    //             id: faker.datatype.uuid(),
    //             publicAccess: true,
    //             name: "image",
    //             urls: {
    //                 private: result1,
    //                 public: result2,
    //             }
    //         }
    //     }
    // }

    // async fakeImages(len) {
    //     let result = [];
    //     for (let i = 0; i < len; i++) {
    //         result.push(await this.fakeImageOne());
    //     }

    //     return result;
    // }

    // async fakeOne() {
    //     return {
    //         code: faker.datatype.number(1000000),
    //         images: await this.fakeImages(FormatManager.randomInt(5)),
    //         barcode: faker.datatype.number(1000000),
    //         barcodeType: BARCODE_TYPES[FormatManager.randomInt(BARCODE_TYPES.length)],
    //         name: faker.commerce.product(),
    //         brand: { id: FormatManager.randomInt(1000), name: faker.commerce.department() },
    //         category: { id: FormatManager.randomInt(1000), name: faker.commerce.productMaterial() },
    //         shortDescription: faker.commerce.productAdjective(),
    //         description: faker.lorem.paragraph(),
    //         tags: faker.company.suffixes(),
    //         currentBal: FormatManager.randomInt(1000),
    //         minBal: FormatManager.randomInt(50),
    //         maxBal: FormatManager.randomInt(500),
    //         reorderBal: FormatManager.randomInt(50),
    //         balanceUom: faker.lorem.slug(),
    //         status: ['Available', 'Out Of Stock', 'Cancelled'][FormatManager.randomInt(2)],
    //         isBestSelling: FormatManager.randomInt(2) % 2 == 0,
    //         activeAt: faker.date.between(new Date('2022-01-01'), new Date('2022-12-12')),
    //         remark: faker.lorem.sentences()
    //     };
    // }

    // async fakeList(count) {
    //     let data = [];
    //     for (let i = 0; i < count; i++) {
    //         let fakeData = await this.fakeOne();
    //         fakeData.id = i + 1;
    //         data.push(fakeData);
    //     }
    //     return data;
    // }

    // async fakePaging(page, size, sort, filter) {
    //     let data = await this.fakeList(size);
    //     return {
    //         total: size * (page + 1),
    //         currentPage: page,
    //         data: data,
    //         pageSize: size,
    //         sort: 'id:ASC',
    //     };
    // }
}

export default new ProductApi();
