# grunt-docu-examples-tester [![Build Status](https://travis-ci.org/ybobkova/grunt-docu-examples-tester.png?branch=master)](https://travis-ci.org/ybobkova/grunt-docu-examples-tester)

This grunt plugin is written in order to help developers test examples, that they use in their documemtation.


## Installation

`npm install grunt-docu-examples-tester`


## Usage

`grunt pull-examples` takes examples out of the documentation files, creates a test for each example, if it does not already exist.
If it exists, the actual example will be pasted in it.

`grunt push-examples` takes examples from the tests and pastes them into the documentation files


## Settings

```
"pull-examples": {
  def: {
    src: ["docs/**/*.md"], // path to the documentation files
    templates: ["lib/tasks/files/"], // path to the test-templates
    tests: ["tests/Cojoko/examples/"]  //path to the tests
  }
}

"push-examples": {
  def: {
    src: ["docs/**/*.md"], //path to the documentation files
    tests: ["tests/Cojoko/examples/"]  //path to the test files  
  }
}
```

### examples format

The examples in the documentation files (provided as `src`) should be written in the format:


    ```javascript
    //<exampleName>Example: <exampleDescription>
    ...
    ```


For example:


    ```js
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
    ```

> it does not matter if you use `js` or `javascript` on the code fence


### test template format

* The template can contain the lines `<exampleName>` and `<exampleDescription>`. They will be changed correspondingly.

* The test template must contain lines 
```
/* beginning of the example */
// Place for the example
/* end of the example */
```

so that the tasks can paste and parse an example correctly.


For example a test template could look like this:

```js
describe("<exampleName>", function () {
  it("<exampleDescription>", function () {
    /* beginning of the example */
    // Place for the example
    /* end of the example */

    assert.equal(true, true);
  });
});
```


And the replaced test would look like this:

```js
describe("basicClassExample", function () {
  it("Classes can be created", function () {
    /* beginning of the example */
    Cojoko.Class("ACME.Exchange.Share", {
      properties: { 
        title: { is: "rw", required: true, isPrivate: true }
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
```
## Migration

### 1.0.0 => 1.1.0

* The examples are now correctly indented, new template rules

## License

Copyright (c) 2013 ps-webforge.com, Yulia Bobkova

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
