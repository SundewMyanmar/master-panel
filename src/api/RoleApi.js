import ApiManager from '../util/ApiManager';

class RoleApi extends ApiManager {
    constructor() {
        super('admin/roles');
    }
}

export default new RoleApi();
