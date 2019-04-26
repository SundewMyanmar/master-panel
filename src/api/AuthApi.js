import APIManager from '../util/APIManager';

const AUTH_URL = 'auth/';

class AuthApi extends APIManager{

    async Authenticate(request){
        try {
            const response = await this.post(AUTH_URL, request, false);
            if(response.code >= 200 && response.code < 300){
                return response.content;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
        return null;
    }

}

export default new AuthApi();

// if(response.data.code === 200){ //Success
//     const data =  response.data.content;
//         return data;
//     }
//     if(response.data.code === 401){
//         //Unauthorized
//         return null;
//     }
//     if(response.data.code === 403){
//         //Forbidden
//         return null;
//     }
//     if(response.data.code === 404){
//         //Not Found
//         return null;
//     }