define([], () => { 
    return class {
        constructor(options) {
            this._routes = options.routes || (() => {throw new Error()})();
            this._navigate = options.navigate || (() => {});
            this._leave = options.leave || (() => {});
            this._error = options.error || (() => {});
            this._hash = options.hash || "#!";
            this._hash === "#" || this._hash === "#!" || (() => {throw new Error()})();
            this._test = options.test || (route => /^[ A-Za-z0-9_@()/.-]*$/.test(route));            
            this._root = options.root; 
            this._test(this._root) || (() => {throw new Error()})(); 
            this._createRoutes(options.routes);
            this._current = undefined; 
        }
        start() {            
            this._onChange(undefined, true);
            var that = this;
            window.addEventListener('hashchange', event => {
                that._onChange.call(that, event)
            });
            return this;
        }
        getData() {
            return Object.keys(this._routes).map(name => {
                let data = this._routes[name].data || {};                
                data.url = "/" + 
                    this._hash + 
                    (this._root ? this._root + "/" : "") +
                    name
                if (this._current !== undefined) {
                    data.active = name === this._current;
                }                
                return data;
            })
        }
        _createRoutes(routes) {
            this._routes = {};
            for(let route in routes) {
                let data = routes[route];
                this._test(route) || (() => {throw new Error()})();    
                this._routes[route] = {
                    name: route,
                    view: data.view || (() => {throw new Error()})(),
                    paramsMap: data.paramsMap || ((...args) => args.length === 0),
                    data: data.data
                }
            }
        }
        _getRouteData(hash) {
            let route, params,
                pieces = hash.replace(this._hash, "").split("/");
            if (this._root) {
                [root, route, ...params] = pieces;
                if (root !== this._root) {
                    return [undefined];
                }                
            }
            [route, ...params] = pieces;
            let found = this._routes[route];
            if (!found) {
                return [undefined];
            }
            return [found, found.paramsMap(...params)]
        }
        _onChange(event, starting=false) {
            let route, params;
            if (!starting) {                
                let oldHash = event.oldURL.replace(
                    event.newURL.replace(document.location.hash, ""), 
                    ""
                ), 
                [route, params] = this._getRouteData(oldHash);
                this._leave({router: this, route: route, params: params, hash: oldHash});
            }
            let hash = document.location.hash;
            [route, params] = this._getRouteData(hash);
            if (route === undefined || !params) {
                this._current = undefined;
                this._error({router: this, hash: hash});
                return;
            }                                    
            this._current = route.name;
            require([route.view], view => {
                let template;
                if (typeof view === "string") {
                    template = view;
                } else if (typeof view === "function") {
                    if (route.view.startsWith("template!") || route.view.startsWith("composite!")) {
                        template = view(params);
                    } else {
                        let instance = new view(params);
                        template = view.render();
                    }                        
                } else if (typeof view === "object") {
                    view.init(params);
                    template = view.render();
                }
                this._navigate({router: this, route: route, view: view, template: template, params: params});                
            })
        }
    }
 });
 