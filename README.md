# VBSPA Single-Page Application Framework

**VBSPA** is JavaScript Framework that offers simple and easy way to create amazing fast and slick **Single-Page Web Applications** [SPA](https://en.wikipedia.org/wiki/Single-page_application).

SPA web applications don't require and don't do any reload on view request. As result they are extremly fast and slick and user session is preserved. 

That means that SPA applications can offer **full, native, desktop-like user experience** - without annoying reloads and without loosing user session or work.

This Framework was built from ground-up for simplicity and speed - with having primarly on mind building **web-based tools** and web apps with desktop-like experince.

However, that doesn't mean that SPA applications in general, and this Framework in particular - arn't suitable for large and complex web sites like news portals or blogs that need to server thousands of pages. Views can be loaded dynamically and when needed. 

It supports cross-domain views, so it can be also used for microservice-based composite web UI's that can be scaled to the moon and back.

Runtime code, when minified is around stable **8.4KB**. Entire Framework can be minified and bundled - build tools provided)- together with the rest of the application. 

Demo app in this repository have **30 views** with various feature demos and minified and bundled with Framework is less then **60KB**.

New syntax or special markup is virtually none-existing. That means shallow learning curve and you can start quickly. For example, if you already know JavaScript [ES6 template strings syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) then you already know template syntax for this framework. If want to bind data model to html, also, no markup or new syntax is required. Simplicity is important as speed.

Framework relays heavily on new JavaScript ECMA6 (JS ES6) features. On certain places, they are used dynamically to achieve simplicity and speed. That also means that it cannot be transpiled into JavaScript ES5. Good news is that doesn't have to. Here is curent [compatibility table for ES6](https://kangax.github.io/compat-table/es6/). This means that this framework doesn't support Internet Explorer. It works perfecly fast and slick on latest Chrome, Firefox, Edge and Safari. Internet Explorer users will have to use different browser. 


> **If your application have any, any value whatsoever - users would go extra three clicks and 20 seconds of their time to install better browser!**  

#nomoretranspiling


## Feature list

#### JavaScript modularity without transpilation

It just uses RequireJS module loader directly. AMD (Asynchronous Module Definition), and its most popular implementation RequireJS is favored to CommonJS because of its asynchronous features to achieve effeciency. This is only dependency (6KB).

#### Templating engine with familiar syntax. 

It uses ES6 template string which are supported nativly by browsers. Templating includes processing custom data and template composition  - ability to import another template into specific place. See wiki for more information.

#### Client side router 

With hashes or with hashbangs. For example `yourwebsite.com#/route1/param1/.../` is hash route. That is how single page applications work, since they have to implement entire framework, including routing on client. There is also possibility of hasbangs, for example `yourwebsite.com#!/route1/param1/.../`. Hashbang routes have better search engine optimization. More info in wiki...

####  View engine that works seamlessly with router to map:

- Appropriate HTML text template.
- Parametrized HTML text template that can process custom data parameters.
- Code module that is your JavaScript ES6 class.
- Remote, crossdomain module or remote, crossdomain template that uses CORS internally and works like any other module or template to support **extreme vertical scalability** with composite web pages and microservices.
- View engine can resolve promises, so you can use `async` and `await` with easy to build state machines when working with async opreations like fetching data from remote server.
- Dependency injection of another template or module too decouple your front-end arhitecture.

For more details see wiki pages...

#### Declarative programming model - mixing of JavaScript and HTML inside module

Yes, language support (hints, autocomplete, etc) for both JavaScript and HTML at the same time.
Declarative programming model is awesome, it lets you focus on what, rather then why. Very much lean thinking.


#### Bi-directional model binding

Model binding means that you can declare some data model that can be binded to your UI easily. When you change the something in the UI, model changes too. When you change your model, UI changes too. 

That is awesome.

More info on wiki...

#### Build tool

Build tool is also included that allows you to:

- Minify and copy your modules, html and css
- Create bundles for your your modules, html or css
- Lazy load html or css modules
- Fine tune and tweak your SPA application

Bundling is important process in SPA applications because of its complex and modular nature. 
Modular fronted application need to be bundled to avoid high netowork traffic when loading all of those bundles. On the other side, you don't want everything to be bundled, perhaps you want
something to be loaded on demand or you just want to left out some portions of application used rarely. In other words - fine tuning. More info on this on wiki. 

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
