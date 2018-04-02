# Single-Page Application Template

Application template for building your custom, amazing JavaScript/HTML5 - Single-Page Applications that have desktop look and feel and without any of the overbolated frameworks. 

No transpiling, no transtranspiling, no preparsing, prepreparsing, complinig and then transpiling, no gigantic cryptic configuration files or external depencies (well, just one actually, for loading modules, and it is small). No nothing. Just pure JavaScript love in ES6.

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

### Motivation

JavaScript world is a mess. Read this classic article: [How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f).

2017 isn't getting any better - [The Stateof JS 2017](https://stateofjs.com/2017/introduction/)

You can also hear from framework author himself, Adrian Holovaty, Django Web Frameork Author - [A Framework Author's Case Against Frameworks](https://www.youtube.com/watch?v=k7n2xnOiWI8)

And it is already 2018... I just wanted to have some set of stable, reliable tools to build fast web-based tools that would be indistinguishable from normal desktop applications, so that only way you can tell it is web app - if it is running inside browser. 

Cool thing about having template instead of framework is that is much easier to change. If you need to adapt soemthing to you specific need. For example event parameter is missing that forces you to change you entire app structure. No problem, you can add it easily. Bug fixing should be easier too. Code is fairly readable, so I hpe noone should have any problems in changing anything they need.


## Getting Started

To run this this demo, you'll have to have local web server. Just clone the repo and point the web server to /src folder and this it.
If you don't have web server, you can use node's [http-server](https://www.npmjs.com/package/http-server)

```
git clone https://github.com/vbilopav/vb-spa
npm install http-server -g
cd .\src\
http-server -o
```

And that is it, you browser should open immediately.

### Features

## Templating engine

## router

## View engine

## Mixing of JavaScript and HTML

## Model binding

## Author

* **Vedran Bilopavlović** - *Initial work* - [vbilopav](https://github.com/vbilopav/)


## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
