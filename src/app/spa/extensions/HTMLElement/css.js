define(["spa/test-prototype"], test => {
        
    test(HTMLElement, ["css", "_styles"]);
    
    const _toCamelCase = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

    HTMLElement.prototype.css = function(property, value) {
        if (!this._styles) {
            this._styles = {};
            const styles = window.getComputedStyle(this);
            for(let style in styles) {
                if (styles.hasOwnProperty(style)) {
                    if (!isNaN(style)) {
                        continue;
                    }
                    this._styles[style] = styles[style];
                }
            }
        }
        if (value !== undefined) {
            this._styles[property] = value;
            this.style[property] = value;
            return this;
        }
        const result = this._styles[property];
        if (result === undefined) {
            return this._styles[_toCamelCase(property)];
        }
        return result;
    }
});