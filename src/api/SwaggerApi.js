import ApiManager from '../util/ApiManager';

class SwaggerApi extends ApiManager {
    constructor() {
        super('');
    }

    async getCategories() {
        const response = await this.get('swagger-resources', this.getHeaders(false));
        return response;
    }

    async getOpenApiV2(url = 'v2/api-docs?group=All') {
        const data = await this.get(url, this.getHeaders(false));
        //Clean and modified response
        if (data) {
            let modules = data.tags;
            for (const path in data.paths) {
                const route = data.paths[path];
                for (const method in route) {
                    const { tags, ...info } = route[method];
                    for (let i = 0; i < tags.length; i++) {
                        const cleanPath = path.replace(/\{\?[^}/]+}/g, '');
                        const idx = modules.findIndex((m) => m.name === tags[i]);
                        if (idx >= 0) {
                            let module = modules[idx];
                            if (!module.count) {
                                module.count = 0;
                            }
                            if (!module.routes) {
                                module.routes = [];
                            }
                            module.count = module.count + 1;
                            const supportedMethod = { http: method, ...info };
                            const routeIdx = module.routes.findIndex((r) => r.path === cleanPath);
                            if (routeIdx >= 0) {
                                const existRoute = module.routes[routeIdx];
                                existRoute.supportedMethods.push(supportedMethod);
                            } else {
                                module.routes.push({ path: cleanPath, supportedMethods: [supportedMethod] });
                            }
                        }
                    }
                }
            }
            return modules;
        }
        return [];
    }
}

export default new SwaggerApi();
