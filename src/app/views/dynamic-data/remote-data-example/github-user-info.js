define([], () => class {
     
    async render(param, element) {
        let response = await fetch(`https://api.github.com/users/${param}`);        
        let result = String.html`
            <p>
                <h3>Github user data</h3>
                <div class='panel panel-default'>
                <div class='panel-heading'>${param}</div>
                <div class='panel-body'>
                    <ul>`;

        for (let [key, value] of Object.entries(await response.json())) {
            result += String.html`                
                        <li>
                            <span>${key}: </span>
                            <span>${value}</span>
                        </li>`;
        }

        result += String.html`
                    </ul>
                </div>
            </p>`
        return result;
    }
    
});