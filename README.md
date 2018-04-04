# Single-Page Application (SPA) Template

This is a application template for your building custom, amazing and fast JavaScript/HTML5 - Single-Page Applications (SPA)[https://en.wikipedia.org/wiki/Single-page_application] 

No transpiling, no trans-transpiling, no parsing, preparsing, pre-preparsing, compiling, no pre-tans-comp-iling, no gigantic cryptic configuration and only one small external depency. No nothing. Just pure JavaScript love in ES6. Core infrastructure part, when minified and bundled is only 7K! If this was framework, I think it would be smallest and fastest. Maybe one day it will. But I don't think world needs another framework. Or does it?

It works amazingly smooth on latest Chrome, Firefox and Edge. IE is not supported nor it will be. Ever.

You may use this template to build your own apps without frameworks as you please. It is built with having on mind buidling of web-based tools with desktop feel, so it is perfect for that purpose.

### Synopsis

Run this application to go trough examples. 

Every view (or page) is demonstration of another feature. If you want use it in you project, just copy what you need and that is it. You may customize it or adapt it to your specific need. 

Entire application logic, that might be considered as "framework" when minified is under **7K**. See [sys dir](https://github.com/vbilopav/vb-spa/tree/master/src/app/sys)

Feature list includes:

- Templating engine with familiar syntax. It uses ES6 template string which are supported nativly by browsers, so it should be as fast as possible. Templating includes composition, iterators, and more...

- Client side router that uses hashes or hashbangs. Hashless client side router is with normal url's is not implemented because I don't know how to do that on client side. Any help would be appritiated.

- View engine that that can map routes to text html files, paramatrized templates, class or object modules, and knows how to remember view state and scroll position. It also supports dependency injection for view modules and templates.

- Mixing of JavaScript and HTML inside same file with languague support for vs code without JSX and related parsing.

- Model binding. Bi-directional - programmatic as well as declarative (inside HTML).

- Demo also include comprehensive examples for every feature (that I've used for testing and development) and as well one more complex example with master/detail remote data fetching.

## Still under construction: 

- Custom module loader to get rid of RequireJS dependency. It should be faster and smaller and it will have 0 dependencies.

- Build tool for minifying and bundling. Custom build tool needs to include fine tuning option. Menaing, there has to be way to bundle region of application separatly (once used frequently from those that will be loaded when needed.) Also, I want to make it as simple as possible. It will be probably another SPA web app that will run build tool.

- Feature detection script so that older browser and IE users can see nice little message to upgrade their browsers or quit using IE.

## About transpiling

As far as I understand - transpiling is a process of automatically converting JavaScript code from ECMA6 (ECMAScript 2015 or ES6) syntax to older ECMA5 syntax, usually with help of other JAvaScript frameworks for that purpose, such as Babel for example. 

This template/framework doesn't use any transpiling, it doesn't need to.

This current browser (compatibility table for ES6)[https://kangax.github.io/compat-table/es6/].

So, only reason why people still doing transpiling is to support for Internet Explorer. There are couple of reasons, in my opinion, why there no need to do that, for example:

- If you are building web based tools like I do, then users need you tools, not the other way around. I can understand need to be available for every user with every old browser on planet - if you are, for example, news portal or that kind of web site. But if you are not, perhaps it is much easier to have feature detection script, and if user browser is not compatible, simply show him or her kindly the meesage to update their browser to stop using IE.

- I am aware that (March 2018) desktop browser market share is still pretty significant for Internet Explorer. Second place with 12.46%. That is unlikely going to change very fast in future if everybody keeps transpiling. Users won't switch browser if they don't have to. Stop appease it, and it (IE) will go away! 

- I'm not sure that some features in this template/frameork even can be transpiled into ECMA5. They are using ECMA6 features dynamically to achieve speed and simlicity. So, transpiler would probably interpret those as just another string and it wouldn't work. However, if somone like to give it a try, I'd like to see that.

## Getting Started

To run this this demo, you'll have to have local web server. Just clone the repo and point the web server to /src folder and this it.
If you don't have web server, you can use node's [http-server](https://www.npmjs.com/package/http-server)

```
git clone https://github.com/vbilopav/vb-spa
npm install
```

To install http server and open in browser:

```
npm install http-server -g
cd .\src\
http-server -o
```

## Contribution

Feel free to create pull requests.

## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.
