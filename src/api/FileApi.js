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
        } else if (file && file.name) {
            return file.name;
        }

        return null;
    }

    async upload(files, isPublic) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        if (files.name) {
            console.log('files =>', files);
            formData.append('uploadedFile', files);
        } else {
            for (let i = 0; i < files.length; i++) {
                formData.append('uploadedFile', files[i]);
            }
        }

        formData.append('isPublic', isPublic);
        const response = await this.post('/upload', formData, headers);
        if (response.count === 1) {
            return response.data[0];
        }

        return response;
    }
}

export default new FileApi();
