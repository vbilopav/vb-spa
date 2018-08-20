define(["sys/models/test-proto"], test => {
        
    test(String, ["toCamelCase"]);

    String.prototype.toCamelCase = function() {
        return this.replace(/-([a-z])/g, g => g[1].toUpperCase());
    }
});