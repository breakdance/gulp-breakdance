'use strict';

var through = require('through2');
var PluginError = require('plugin-error');
var Breakdance = require('breakdance');

module.exports = function(options) {
  options = options || {};
  var bd = options.breakdance || new Breakdance(options);

  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    try {
      file.contents = new Buffer(bd.render(file.contents.toString(), options));
      file.extname = '.md';
    } catch (err) {
      this.emit('error', new PluginError('gulp-breakdance', err, {fileName: file.path}));
      return;
    }

    next(null, file);
  });
};
