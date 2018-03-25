define([], () => { 
    return class {
        constructor(options) {
            this._navigate = options.navigate || (() => {});
            this._leave = options.leave || (() => {});
            this._error = options.error || (() => {});
            this._hash = options.hash || "#";
            this._hash === "#" || this._hash === "#!" || (() => {throw new Error()})();
            this._test = options.test || (route => /^[ A-Za-z0-9_@()/.-]*$/.test(route));            
            this._root = options.root; 
            this._test(this._root) || (() => {throw new Error()})(); 
            let routes = options.routes || (() => {throw new Error()})();
            this._routes = {};    
            for(let route in routes) {
                let data = routes[route];
                this._test(route) || (() => {throw new Error()})();    
                this._routes[route] = {
                    id: data.id || route,
                    name: route,
                    view: data.view,
                    paramsMap: data.paramsMap || ((...args) => args.length === 0),
                    data: data.data
                }
            }
            this._current = undefined; 
            this._manager = {
                navigate: ()=>{} //...
            };
        }
        useViewManager(manager=(() => {throw new Error()})()) {
            this._manager = manager;
            return this;
        }
        start() {
            this._onChangeEvent(undefined, true);
            var that = this;
            window.addEventListener('hashchange', event => {
                that._onChangeEvent.call(that, event)
            });
            return this;
        }
        getData() {
            return Object.keys(this._routes).map(name => {
                let route = this._routes[name],
                    data = route.data || {};                
                data.url = "/" + this._hash + (this._root ? this._root + "/" : "") + name;
                data.id = route.id
                if (this._current !== undefined) {
                    data.active = name === this._current;
                }                
                return data;
            })
        }
        _getRouteData(hash) {
            let route, params;
            hash = hash.replace(this._hash, "");
            if (hash.endsWith("/")) {
                hash = hash.substring(0, hash.length-1);
            }
            let pieces = hash.split("/").map(item => decodeURIComponent(item));             
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
        _handleLeave(event) {
            let 
                oldHash = event.oldURL.replace(event.newURL.replace(document.location.hash, ""), ""), 
                [route, params] = this._getRouteData(oldHash);
            this._leave({ router: this, route: route, params: params, hash: oldHash });
        }
        _onChangeEvent(event, starting=false) {            
            if (!starting) {                
                this._handleLeave(event);
            }

            let hash = document.location.hash,
                [route, params] = this._getRouteData(hash);
            
            if (route === undefined || !params) {
                this._current = undefined;
                this._error({router: this, hash: hash});
                return;
            }                                    
            this._current = route.name;

            //if (route.view) ...

            require([route.view], view => {
                let template;
                if (typeof view === "string") {
                    template = view;
                } else if (typeof view === "function") {
                    if (route.view.startsWith("template!")) {
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

            //endif
        }        
    }
 });
 