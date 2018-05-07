# VBSPA Single-Page Application Framework

> **VBSPA** is JavaScript Framework that offers simple and easy way to create amazing fast and slick [**Single-Page Web Applications**](https://en.wikipedia.org/wiki/Single-page_application).

SPA web applications don't require and don't do any reload on view request. As result they are extremly fast and slick and user session is preserved. 

That means that SPA applications can offer **full, native, desktop-like user experience** - without annoying reloads and without loosing user session or work.

This Framework was built from ground-up for simplicity and speed - with having primarly on mind building **web-based tools** and other web apps that would like to have desktop-like experince.

However, that doesn't mean that SPA applications in general, and this Framework in particular - arn't suitable for large and complex web sites like news portals or blogs that need to server thousands of pages. Views can be loaded dynamically (lazy loading) and only when they are needed. 

IFramework supports cross-domain views, so it can be also used for microservice-based composite web UI's  - that can be **scaled to the moon and back.**

Runtime code, when minified is around stable **8.4KB**. 

Entire Framework can be simply minified and bundled - build tools are provided together with the rest of the application. 

Demo app in this repository have **30 views** with various feature demos and minified and bundled with Framework is less then **60KB**.

**New syntax or special markup is virtually none-existing.** 

That means shallow learning curve and you can start quickly. For example, if you already know JavaScript [ES6 template strings syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) then you already know template syntax for this framework. If want to bind data model to HTML, also, no new markup or new syntax is required. 

Simplicity is important as it is speed.

Framework relays heavily and takes advantage of new JavaScript ECMA6 (JS ES6) features and it cannot be transpiled to ECMA5. 

Good. It doesn't have to. Here is curent [compatibility table for ES6](https://kangax.github.io/compat-table/es6/). This means that this **framework doesn't support Internet Explorer.** It works perfecly fast and slick on latest Chrome, Firefox, Edge and Safari. Internet Explorer users will have to use different browser. Feature detection script is provided.

> **If your application have any, any value whatsoever - users would go extra three clicks and 20 seconds of their time to install better browser!**  

#nomoretranspiling


## Feature list

### JavaScript modularity without transpilation

### Templating engine with familiar syntax. 

### Client side router 

###  View engine that works seamlessly with router that can:

    #### - Map HTML text templates.
    #### - Map parametrized HTML text templates.
    #### - Map code modules.
    #### - Map remote, cross-domain modules or HTML templates    .
    #### - View engine can resolve promises, so you can use `async` and `await`.
    #### - Dependency injection of another template or module too decouple your front-end arhitecture.

### Declarative programming model - mixing of JavaScript and HTML inside module

#### Bi-directional model binding

#### Build tool that can

    #### - Minify and copy your modules, html and css
    #### - Create bundles for your your modules, html or css
    #### - Lazy load html or css modules
    #### - Fine tune and tweak your SPA application


## Getting Started

### Prerequisite

#### Node.js

- [Intstall node.js](https://nodejs.org/en/download/) to restore dependend modules and to run build tool

#### Local web server

- If you don't have one, install node's [http-server](https://www.npmjs.com/package/http-server) with
```
npm install http-server -g
```

### Steps:

- Clone this repo:

```
$ git clone https://github.com/vbilopav/vb-spa
```

- Restore npm modules:

```
$ npm install
```

- To open source code example web site in you browser just point your local web server to
`src` dir, or using http-server:

```
$ cd src/
$ http-server -o
```

- To build and open minified and bundled version:
```
$ cd src/_build-system/
$ node build.js --target=mybuild

...

build.js >
build.js > finished!

$ cd build/mybuild/
$ http-server -o
```

## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.
