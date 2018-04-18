define([], () => class {
     
    async render(param, element) {
        let response = await fetch(`https://api.github.com/users/${param}`);
        let result = "<div>";
        for (let [key, value] of Object.entries(await response.json())) {
            result += `<div><span>${key}</span><span>${value}</span><div>`;
        }
        return result;
    }
    
});