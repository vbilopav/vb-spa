# Single-Page Application Template

Application template for building your custom, amazing JavaScript/HTML5 - Single-Page Applications that have desktop look and feel and without any of the overbolated frameworks. No transpiling, no transtranspiling, no preparsing, prepreparsing, complinig and then transpiling, no gigantic cryptic configuration files or external depencies (well, just one actually, for loading modules, and it is small). No nothing. Just JavaScript ES6.

It works amazingly smooth on latest Chrome, Firefox and Edge. IE is not supported nor it will be.

You may use this template to build your own apps without frameworks as you please. It is built with having on mind buidling of web-based tools with desktop feel, so it is perfect for that purpose.

### Synopsis

Run this application to go trough examples. Every view (or page) is demonstration of another feature. If you want use it in you project, just copy what you need and that is it. You may customize it or adapt it to your specific need. 

Entire application logic, that might be considered as "framework" when minified is under 7K. See [sys dir](https://github.com/vbilopav/vb-spa/tree/master/src/app/sys)

Feature list includes:

- Templating engine with familiar syntax. It uses ES6 template string which are supported nativly by browsers, so it should be as fast as possible. Templating includes composition, iterators, and more...

- Client side router that uses hashes or hashbangs. Hashless client side router is with normal url's is not implemented because I don't know how to do that on client side. Any help would be appritiated.

- View engine that that can map routes to text html files, paramatrized templates, class or object modules, and knows how to remember view state and scroll position. It also supports dependency injection for view modules and templates.

- Mixing of JavaScript and HTML inside same file with languague support for vs code without JSX and related parsing.

- Model binding. Bi-directional - programmatic as well as declarative (inside HTML).

- Demo also include comprehensive examples for every feature (that I've used for testing and development) and as well one more complex example with master/detail remote data fetching.

### Motivation

JavaScript is a mess

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities

To run this demo, you will just need local web server.

## Features

Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* Dropwizard - Bla bla bla
* Maven - Maybe
* Atom - ergaerga

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **John Doe** - *Initial work* - [JohnDoe](https://github.com/JohnDoe)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the **BSD License** - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
