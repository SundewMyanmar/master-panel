import ApiManager from '../util/ApiManager';
import faker from 'faker';

class UnitOfMeasurementApi extends ApiManager {
    constructor() {
        super('inventory/uoms');
    }
}

export default new UnitOfMeasurementApi();
