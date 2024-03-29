import ApiManager from '../util/ApiManager';

class FileApi extends ApiManager {
    constructor() {
        super('files');
    }

    async getPagingByFolder(folder, page, size, sort, filter, isPublic, isHidden, guild) {
        if (!folder) folder = 0;

        let url = '/' + folder + '/folder?page=' + page + '&size=' + size;
        if (sort && sort !== '') url += '&sort=' + sort;
        if (filter && filter !== '') url += '&filter=' + filter;
        if (isPublic && isPublic !== '') url += '&public=' + isPublic;
        if (isHidden && isHidden !== '') url += '&hidden=' + isHidden;
        if (guild && guild !== '') url += '&guild=' + guild;

        const response = await this.get(url, this.getHeaders(true));
        return response;
    }

    downloadLink(file, size = '') {
        if (file && file.id) {
            if (file.publicAccess) {
                return file.urls.public + (size ? '?size=' + size : '');
            } else {
                const user = this.getUserInfo();
                return file.urls.private + '?accessToken=' + user.currentToken + (size ? '&size=' + size : '');
            }
        }
        return null;
    }

    async upload(files, isPublic, isHidden, folder, guild) {
        let headers = this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        if (files.name) {
            formData.append('uploadedFile', files);
        } else {
            for (let i = 0; i < files.length; i++) {
                formData.append('uploadedFile', files[i]);
            }
        }

        formData.append('isPublic', isPublic);
        if (isHidden) formData.append('isHidden', isHidden);
        if (folder) formData.append('folder', folder);
        if (guild) formData.append('guild', guild);

        const response = await this.post('/upload', formData, headers);
        if (response.count === 1) {
            return response.data[0];
        }

        return response;
    }
}

export default new FileApi();
