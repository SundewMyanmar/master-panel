import ApiManager from '../util/APIManager';

const API_URL = 'menus/';

class MenuApi extends ApiManager{

    async getAll(page, size, sort, filter){
        try{
            const url = API_URL + "?page=" + page + "&size=" + size + "&sort=" + sort + "&filter=" + filter;
            const response = await this.get(url, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        }catch(error){
            console.error(error);
            throw error;
        }
        return null;
    }

    async getById(id){
        try {
            const url = API_URL + id;
            const response = await this.get(url, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async getByRole(){
        try {
            const url = API_URL + "roles";
            const response = await this.get(url, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async insert(data){
        try {
            const response = await this.post(API_URL, data, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async update(id, data){
        try {
            const url = API_URL + id;
            const response = await this.put(url, data, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

    async delete(id){
        try {
            const url = API_URL + id;
            const response = await this.deleteItem(url, {}, true);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error.response);
            throw error;
        }
        return null;
    }
}

export default new MenuApi();