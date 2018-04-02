define([], () => {
     
    return async () => {
        const response = await fetch("/remote-data-example/frameworks.json", {cache: "no-store"});
        return await response.json();        
    }
     
})
