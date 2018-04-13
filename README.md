# VBSPA Single-Page Application Framework

VBSPA is JavaScript framework that allows you to easily create amazing fast and slick Single-Page Web Applications [SPA](https://en.wikipedia.org/wiki/Single-page_application).

SPA web applications don't require reload on every request. As result they are extremly fast and slick and user session is preserved. 
That means that SPA application provide user with full, native, desktop-like user experiencem, without annoying reloads and without loosing user session or work.

That doesn't mean that SPA applications are not suitable for large and complex webs like news portals or blogs that need to server thousands 
of pages. That is common myth about SPA applications. Views (text templates and/or modules) can be loaded dynamically and when needed.

This framework is built for simplicity and speed. Doesn't need or use any transpiling or parsing. Runtime code, when minified is around **7.5KB**.

It also doesn't introduce any new syntax, special markup or anything like that. So learning curve should be shallow and you can get started fast. For example, if you already know JavaScript [ES6 template strings syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) then you already know template syntax for this framework.

To achieve all of this - framework relays heavily on new JavaScript ECMA6 (JS ES6) features. On certain places, they are used dynamically, 
again, to achieve simplicity and speed. But that also means that it cannot be transpiled into old JavaScript ES5. Good news is that doesn't have to. Here is curent [compatibility table for ES6](https://kangax.github.io/compat-table/es6/). This means that this framework doesn't support Internet Explorer. It works perfecly fast and slick on latest Chrome, Firefox, Edge and Safari. Internet Explorer users will have to 
use different browser. 

## Feature list

#### JavaScript modularity without transpilation

It just uses RequireJS module loader directly. AMD (Asynchronous Module Definition), and its most popular implementation RequireJS is favored to CommonJS because of its asynchronous features to achieve effeciency. This is only dependency (6KB).

#### Templating engine with familiar syntax. 

It uses ES6 template string which are supported nativly by browsers. Templating includes processing custom data and template composition (ability to import another template into specific place. See wiki for more information.

#### Client side router 

With hashes or with hashbangs. For example `yourwebsite.com#/route1/param1/.../` is hash route. That is how single page applications work, since they have to implement entire framework, including routing on client. There is also possibility of hasbangs, for example `yourwebsite.com#!/route1/param1/.../`. Hashbang routes have better search engine optimization. More info in wiki...

####  View engine that works seamlessly with router to map:

- Appropriate html text template, 
- Parametrized html text template that can process custom data parameters from router using templating engine,
- Custom module that can be JavaScript object or class. That module can then import other modules or templates, etc.
- Remote, crossdomain module or remote, crossdomain template that uses cors internally and works like any other module or template to support extreme
vertical scalability with composite web pages and microservices.

It also supports dependency injection of another template or module trough router definition. For more details see wiki pages.

#### Mixing of JavaScript and HTML inside module

If you prefer this style of frontend architecture (I do), there is ability to seamlessly mix your JavaScript code with HTML without 
having to use JSX parsing and still have full languague support for HTML (for Visual Studio Code and JetBrains development enviorments).
Wiki pages...

#### Bi-directional model binding

Model binding means ability to declare some data model in you model and when you change some value in your data model, 
some UI should change also. That means that model and UI model are bind. Bi-directional means when you change value in your 
UI element, model should change too. This can be achieved declaratively (trough HTML, without any special syntax) or 
programmatically (trough code telling your model with whom to bind). More info on wiki...

#### Build tool

Build tool is also included that allows you to:

- Minify and copy your modules, html and css
- Create bundles for your your modules, html or css
- Fine tune and tweak your SPA application

Bundling is important process in SPA applications because of its modular nature. 
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
