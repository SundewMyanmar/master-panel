import ApiManager from '../util/ApiManager';
import faker from 'faker';
import { CONTACT_TYPES } from '../form/ContactForm';

class UserApi extends ApiManager {
    constructor() {
        super('admin/users');
    }

    async fakeContacts(count) {
        const contacts = [];
        for (let j = 0; j < count; j++) {
            const rndContact = faker.random.arrayElement(Object.keys(CONTACT_TYPES));
            let contact = {
                type: rndContact,
                label: rndContact.toLowerCase(),
                color: faker.commerce.color(),
            };
            switch (rndContact.toLowerCase()) {
                case 'URL':
                    contact.value = faker.internet.url();
                    break;
                case 'LAT_LON':
                    contact.value = `${faker.address.latitude}:${faker.address.longitude}`;
                    break;
                case 'EMAIL':
                    contact.value = faker.internet.email();
                    break;
                case 'address':
                    contact.value = faker.address.streetAddress();
                    break;
                default:
                    contact.value = faker.phone.phoneNumber();
            }
            contacts.push(contact);
        }
        return contacts;
    }

    async cleanToken(userId: number) {
        const response = await this.delete('/cleanToken/' + userId, {}, this.getHeaders(true));
        return response;
    }

    async resetPassword(userId: number, request: object) {
        const response = await this.put('/resetPassword/' + userId, request, this.getHeaders(true));
        return response;
    }
}

export default new UserApi();
