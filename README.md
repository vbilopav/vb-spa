# Single-Page Application Template

This is a application template for building custom, amazing and fast JavaScript/HTML5 - Single-Page Applications that have desktop look and feel and without any of the overbloated frameworks. 

No transpiling, no trans-transpiling, no parsing, preparsing, pre-preparsing, compiling, no pre-tans-comp-iling, no gigantic cryptic configuration and only one small external depency. No nothing. Just pure JavaScript love in ES6. Core infrastructure part, when minified and bundled is only 7K! If this was framework, I think it would be smallest and fastest. Maybe one day it will. But I don't think world needs another framework. Or does it?

It works amazingly smooth on latest Chrome, Firefox and Edge. IE is not supported nor it will be. Ever.

You may use this template to build your own apps without frameworks as you please. It is built with having on mind buidling of web-based tools with desktop feel, so it is perfect for that purpose.

### Synopsis

Run this application to go trough examples. 

Every view (or page) is demonstration of another feature. If you want use it in you project, just copy what you need and that is it. You may customize it or adapt it to your specific need. 

Entire application logic, that might be considered as "framework" when minified is under 7K. See [sys dir](https://github.com/vbilopav/vb-spa/tree/master/src/app/sys)

Feature list includes:

- Templating engine with familiar syntax. It uses ES6 template string which are supported nativly by browsers, so it should be as fast as possible. Templating includes composition, iterators, and more...

- Client side router that uses hashes or hashbangs. Hashless client side router is with normal url's is not implemented because I don't know how to do that on client side. Any help would be appritiated.

- View engine that that can map routes to text html files, paramatrized templates, class or object modules, and knows how to remember view state and scroll position. It also supports dependency injection for view modules and templates.

- Mixing of JavaScript and HTML inside same file with languague support for vs code without JSX and related parsing.

- Model binding. Bi-directional - programmatic as well as declarative (inside HTML).

- Demo also include comprehensive examples for every feature (that I've used for testing and development) and as well one more complex example with master/detail remote data fetching.

- Features still under construction: build tool for minifying and bundling, and feature detection script so that older browser and IE users can see nice little message to upgrade their browsers or quit using IE.


## Getting Started

To run this this demo, you'll have to have local web server. Just clone the repo and point the web server to /src folder and this it.
If you don't have web server, you can use node's [http-server](https://www.npmjs.com/package/http-server)

```
git clone https://github.com/vbilopav/vb-spa
npm install http-server -g
cd .\src\
http-server -o
```

## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.
