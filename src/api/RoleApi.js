import ApiManager from '../util/APIManager';

const API_URL = 'roles/';

class RoleApi extends ApiManager{

    async getAll(){
        try{
            var url = API_URL + "list";
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

    async getPaging(page, size, sort, filter){
        try{
            const url = API_URL + "paging?page=" + page + "&size=" + size + "&sort=" + sort + "&filter=" + filter;
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

export default new RoleApi();