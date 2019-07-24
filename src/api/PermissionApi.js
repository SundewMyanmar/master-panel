import ApiManager from '../util/APIManager';

const API_URL='permissions/';

class PermissionApi extends ApiManager{
    async insertMulti(datas){
        try{
            var url=API_URL+"create";
            const response=await this.post(url,datas,true);
            
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        }catch(error){
            console.error(error);
            throw error;
        }

        return null;
    }

    async getAvailableRoutes(){
        try{
            var url=API_URL+"routes";

            const response = await this.get(url,true);
            
            if(response){
                return response;
            }
        }catch(error){
            console.error(error);
            throw error;
        }

        return null;
    }

    async getPermissionByRoles(role){
        try{
            var url=API_URL+role+"/role/";

            const response=await this.get(url,true);

            if(response.code >= 200 && response.code < 300){
                return response.content.data;
            }
        }catch(error){
            console.error(error);
            throw error;
        }

        return null;
    }
}

export default new PermissionApi();