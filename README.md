# grunt-docu-exmaples-tester

This grunt plugin is written in order to help developers test examples, that they use in their documemtation.


## Installation

`grunt docu-exmaples-tester`


## Usage

`grunt pull-examples` takes examples out of the documentation files, creates a test for each example

`grunt push-examples` takes examples from the tests and pastes them into the documentation files


## Settings

    
'pull-examples': {
  def: {
    src: ['docs/**/*.md'], // path to the documentation files
    templates: ['lib/tasks/files/'], // path to the test-templates
    tests: ['tests/Cojoko/examples/']  //path to the tests
  }
},

'push-examples': {
  def: {
    src: ['docs/**/*.md'], //path to the documentation files
    tests: ['tests/Cojoko/examples/']  //path to the test files     
  }
}


### Notice to the examples in the documentation files

Examples should be written in the format:

'```js(/javascript)
//<exampleName>Example: <exampleDescription>
...

```'

For example:

'```js
// basicClassExample: Classes can be created
  
    Cojoko.Class('ACME.Exchange.Share', {

      properties: {
        title: { is: 'rw', required: true, isPrivate: true },
        isin: { is: 'rw', required: true, isPrivate: true },
        wkn: { is: 'rw', required: true, isPrivate: true },
        price: { is: 'rw', required: true, isPrivate: true, type: 'ACME.Exchange.Price' }
      },

      methods: {
        toString: function () {
          return this.title+' ('+this.isin+'/'+this.wkn+')';
        }
      }
    });

```'


### Notices to the template

1. The template can contain placeholders <exampleName> and <exampleDescription>. Thay will be changed correspondingly.

2. The test template should contain lines /*beginning of the example*/ and /*end of the example*/, so the tasks can paste and parse an example correctly.

For example:

'```js
describe("Classes", function () {
  it("can be created", function () {
    /* beginning of the example */
    Cojoko.Class("ACME.Exchange.Share", {
      properties: {
        title: {
          is: "rw",
          required: true,
          isPrivate: true
        }
      },
      methods: {
        toString: function () {
          return this.title + " (" + this.isin + "/" + this.wkn + ")";
        }
      }
    });
    /* end of the example */
    
    assert.equal(true, true);
  });
});
```'

## License

Copyright (c) 2013 ps-webforge.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
