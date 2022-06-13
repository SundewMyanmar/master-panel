import ApiManager from '../util/ApiManager';

class ReportApi extends ApiManager {
    constructor() {
        super('/reports');
    }

    buildViewUrl(id, params) {
        let url = this.customLink(`/view/${id}`, false);
        for (const key in params) {
            url += `&${key}=${params[key]}`;
        }
        return url;
    }

    buildPrintUrl(id, params) {
        let url = this.customLink(`/print/${id}`, false);
        for (const key in params) {
            url += `&${key}=${params[key]}`;
        }
        return url;
    }

    async addNew(report) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const formData = this.buildFormData(report);
        const response = await this.post('/', formData, headers);
        return response;
    }

    async modifyById(id, report) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const formData = this.buildFormData(report);
        const response = await this.put('/' + id, formData, headers);
        return response;
    }
}

export default new ReportApi();
