import ApiManager from '../util/APIManager';
import { API_URL } from "../config/Constant";
import Axios from 'axios';

class FileApi extends ApiManager{
    async upload(file) {
        let headers = await this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';

        const formData = new FormData();
        formData.append('uploadedFile', file);
        formData.append('isPublic',true);

        try {
            const url = API_URL + "files/upload/";
            console.log("Upload url => ", url);
            console.log('form data =>',formData);

            const response = await Axios.post(url, formData, { headers: headers });
            console.log("Response => ", response);

            const responseJson = response.data;
            if (responseJson.content && (responseJson.code >= 200 && responseJson.code <= 300)) {
                return responseJson.content;
            }
        } catch (error) {
            console.log("Upload Error => ", error);
            throw error;
        }
        return null;
    }

    async multiUpload(files) {
        let headers = await this.getHeaders(true);
        headers['Content-Type'] = 'multipart/form-data';

        const formData = new FormData();
        for(var i=0;i<files.length;i++){
            formData.append('uploadedFile', files[i]);
        }
        
        formData.append('isPublic',true);
        
        try {
            const url = API_URL + "files/multi/upload/";
            console.log("Upload url => ", url);
            console.log('form data =>',formData);
            const response = await Axios.post(url, formData, { headers: headers });
            console.log("Response => ", response);

            const responseJson = response.data;
            if (responseJson.content && (responseJson.code >= 200 && responseJson.code <= 300)) {
                return responseJson.content;
            }
        } catch (error) {
            console.log("Upload Error => ", error);
            throw error;
        }
        return null;
    }
}

export default new FileApi();