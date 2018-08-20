define(
    ["sys/view-manager/reveal"], reveal => 
        id => 
            reveal(
                {view: _app.config.view, elementOrId: document.getElementById(id).html("")}
            )
);
