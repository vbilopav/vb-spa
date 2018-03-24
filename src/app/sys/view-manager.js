define([], () => { 
    return class {
        constructor(options) {            
            this._mode = options.mode || "preserve";
            this._mode === "preserve" || this._hash === "recreate" || (() => {throw new Error()})();
            this._container = options.container || (() => {throw new Error()})();
        }
    }
 });
 