import ApiManager from '../util/ApiManager';

class UserApi extends ApiManager {
    constructor() {
        super('admin/users');
    }

    async cleanToken(userId: number) {
        const response = await this.delete('/cleanToken/' + userId, {}, this.getHeaders(true));
        return response;
    }

    async resetPassword(userId: number, request: Object) {
        const response = await this.put('/resetPassword/' + userId, request, this.getHeaders(true));
        return response;
    }
}

export default new UserApi();
