module.exports = function() {

  var Examples = function(options) {
    var that = this;
    var _ = require('lodash');
    var fs = require('fs');
    var esprima = require('esprima');
    var escodegen = require('escodegen');
    var docuPaths = options.src;
    var testTemplates = options.testTemplates;
    
    var commentWithExampleRegexp = new RegExp("```(?:javascript|js)\\s*\\n+//(.|\\n|\\s)*?Example:(.|\\n|\\s)*?```", "g");
    var commentRegexp = new RegExp("```(?:javascript|js)\\s*//.*", "g");
    var exampleNameRegexp = new RegExp("(?://).*?(?=:)", "g");
    var exampleInTestRegexp = new RegExp("\\/\\*\\s*beginning of the example\\s*\\*\\/\\s*\\n(.|\\n|\\s)*?(?=\\n\\s*\\/\\*\\s*end of the example\\s*\\*\\/)", "g");

    this.push = function(docuPaths) {
      _.each(docuPaths, function(path) {
        var docuText = fs.readFileSync(path).toString();
        var examples = that.parseExamplesFromDocuFile(docuText);
        _.each(examples, function(ex) {  
          var exampleName = that.findExampleName(ex);  
          var exampleFromTest = that.parseExampleFromTest(exampleName);
          var jsAndComment = ex.match(commentRegexp).toString();
          exampleFromTest = that.addCodeFenceAndCommentToExample(exampleFromTest, jsAndComment);
          docuText = that.pasteExampleToDocs(exampleFromTest, docuText, jsAndComment);
        });
        fs.writeFileSync(path, docuText);
      });
    };

    this.pull = function(docuPaths) {
      _.each(docuPaths, function(path) {
        var docuText = fs.readFileSync(path).toString();
        var examples = that.parseExamplesFromDocuFile(docuText);
        _.each(examples, function(ex) { 
          var jsAndComment = ex.match(commentRegexp).toString();
          var exampleName = that.findExampleName(ex);
          var testPath = options.tests + exampleName + 'Test';
          var testText = that.readOrCreateTestFile(testPath, testTemplates);
          testText = that.pasteNameAndDescriptionToCreatedFiles(testText, jsAndComment);
          testText = that.pasteExampleToTest(testText, ex, jsAndComment);
          fs.writeFileSync(testPath + '.js', testText);
        });
      });
    };

    this.pasteExampleToTest = function(test, example, jsAndComment) {
      var examplePlace = test.match(exampleInTestRegexp).toString();
      examplePlace = examplePlace.replace(/\/\*\s*beginning of the example\s*\*\/\s*\n/, "");
      example = example.replace(jsAndComment, '').replace("```", '');
      test = test.replace(examplePlace, example);

      var esprimaOptions = {
        range: true, 
        tokens: true, 
        comment: true
      };

      var escodegenOptions = {
        format: {
          indent: {
            style: '  ',
            base: 0
          },
          quotes: 'double'
        },
        comment: true
      };

      var ast = esprima.parse(test, esprimaOptions);
      ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
      test = escodegen.generate(ast, escodegenOptions);

      return test;
    };

    this.readOrCreateTestFile = function(path, testTemplates) {
      var fileText;
      if (fs.existsSync(path + '.js')) {
        fileText = fs.readFileSync(path + '.js').toString();
      } else {
        var templateJs = fs.readFileSync(testTemplates + 'docuTestTemplate.js').toString();
        fs.writeFileSync(path + '.js', templateJs);
        fileText = templateJs;
      }
      return fileText;
    };

    this.pasteNameAndDescriptionToCreatedFiles = function(test, jsAndComment) {
      
      var name = jsAndComment.match(/\/\/(.|\n|\s)*?(?=Example)/g).toString().replace('//', '').trim();
      var descr = jsAndComment.match(/Example:(.|\n|\s)*?$/g).toString().replace('Example:', '').replace('```', '').trim();

      var nameReg = new RegExp('"<exampleName>"', "g");
      var descrReg = new RegExp('"<exampleDescription>"', "g");

      test = test.replace(nameReg, '"' + name + '"');
      test = test.replace(descrReg, '"' + descr + '"');

      return test;
    };

    this.parseExamplesFromDocuFile = function(docuText) {
      var examples = docuText.match(commentWithExampleRegexp);
      return examples;
    };

    this.findExampleName = function(example) {
      var exampleName = example.match(exampleNameRegexp);
      exampleName = exampleName.toString().split("//").join("").trim();
      return exampleName; 
    };

    this.parseExampleFromTest = function(exampleName) {
      var testPath = options.tests + exampleName + 'Test.js';
      var testCode = fs.readFileSync(testPath).toString();
      var example = testCode.match(exampleInTestRegexp);
      example = example.toString().replace(/\/\*\s*beginning of the example\s*\*\/\s*\n/, "");
      return example;
    };

    this.addCodeFenceAndCommentToExample = function(exampleFromTest, fence){ 
      var esprimaOptions = {
        range: true, 
        tokens: true, 
        comment: true
      };

      var escodegenOptions = {
        format: {
          indent: {
            style: '  ',
            base: 0
          },
          quotes: 'double'
        },
        comment: true
      };

      var ast = esprima.parse(exampleFromTest, esprimaOptions);
      ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
      exampleFromTest = escodegen.generate(ast, escodegenOptions);
      
      exampleFromTest = fence + "\n" + exampleFromTest + "```";

      return exampleFromTest;
    };

    this.pasteExampleToDocs = function(exampleFromTest, docuText, fenceAndComment) {
      var exampleDocsRegexp = new RegExp(fenceAndComment + "(.|\\n|\\s)*?```", "g");
      exampleFromTest = docuText.toString().replace(exampleDocsRegexp, exampleFromTest);
      return exampleFromTest;
    };
  };

  return Examples;
};