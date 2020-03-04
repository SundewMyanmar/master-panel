import ApiManager from '../util/ApiManager';

class FileApi extends ApiManager {
    constructor() {
        super('files');
    }

    downloadLink(file) {
        if (file && file.id) {
            if (file.publicAccess) {
                return file.urls.public;
            } else {
                const user = this.getUserInfo();
                return file.urls.private + '?accessToken=' + user.currentToken;
            }
        }
        return null;
    }

    async upload(file, isPublic) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const data = new FormData();
        data.append('uploadedFile', file);
        data.append('isPublic', isPublic);
        const response = await this.post('/upload', data, headers);
        return response;
    }

    async multiUpload(files) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';

        const data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append('uploadedFile', files[i]);
        }

        data.append('isPublic', true);
        const response = await this.post('/multi/upload', data, headers);
        return response;
    }
}

export default new FileApi();
