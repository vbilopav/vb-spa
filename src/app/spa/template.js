/*
The MIT License (MIT)
Copyright (c) 2018 Vedran Bilopavlović
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define([
    "module", 
    "sys/template-helpers"
], (
    _, 
    helper
) => {

    const
        _search = "{this.template.import(",
        _length = _search.length;
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            if (helper._usingPreloaded()) {
                return req(["text!" + name], text => onload((data, locale) => helper.parse(name, text, data, locale)))
            }
            return req(["text!" + name], text => {
                let from = 0, found = [], length = text.length;
                while (from > -1) {
                    let index = text.indexOf(_search, from)
                    if (index === -1) {
                        break;
                    }
                    index = index + _length
                    from = text.indexOf(")", index);
                    if (from !== -1) {
                        let quoted = text.substring(index, from);
                        found.push(quoted.substring(1, quoted.length-1));
                    }
                }
                if (found.length) {
                    require(found, () => onload((data, locale) => helper.parse(name, text, data, locale))); 
                } else {
                    onload((data, locale) => helper.parse(name, text, data, locale));
                }
            });
        }
    };

});
