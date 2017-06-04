'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var assert = require('assert');
var bd = require('../');

function read(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}
function fixture(name) {
  return path.resolve(__dirname, 'fixtures', name + '.html');
}
function expected(name) {
  return read(path.resolve(__dirname, 'expected', name + '.md'));
}

describe('gulp-breakdance', function() {
  it('should export a function(sound check)', function() {
    assert.equal(typeof bd, 'function');
  });
});

describe('plugin', function() {
  it('should return an object', function() {
    assert(bd());
    assert.equal(typeof bd(), 'object');
    assert.equal(typeof bd().pipe, 'function');
  });

  it('should not fail on non-existent files', function(cb) {
    var stream = bd();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/fooooo.txt'
    }));

    stream.on('data', function(file) {
      buffer.push(file);
    });

    stream.on('end', function() {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].relative, 'fooooo.txt');
      cb();
    });

    stream.end();
  });

  it('should convert headings to markdown', function(cb) {
    unit('headings', {}, cb);
  });

  it('should convert a document', function(cb) {
    unit('doc', {}, cb);
  });
});

function unit(filename, options, cb) {
  var stream = bd(options);
  var buffer = [];

  var filepath = fixture(filename);

  stream.write(new File({
    base: __dirname,
    path: filepath,
    contents: fs.readFileSync(filepath)
  }));

  stream.on('data', function(file) {
    buffer.push(file);
  });

  stream.on('end', function() {
    assert.equal(buffer.length, 1);
    assert.equal(buffer[0].contents.toString(), expected(filename));
    cb();
  });

  stream.end();
}
