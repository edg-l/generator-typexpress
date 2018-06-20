'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-typexpress:app-common-files', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'app-common-files',
      engine: 'pug',
      css: 'css',
      gitignore: true,
      vscodeLaunchJson: true
    });
  });

  it('creates common files', () => {
    assert.file([
      'src/app.ts',
      'src/routes/index.ts',
      'src/routes/users.ts',
      'src/bin/www.ts',
      'public/css/style.css',
      '.vscode/launch.json'
    ]);
  });
});

describe('generator-typexpress:app-pug-files', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'app-pug-files',
      engine: 'pug',
      css: 'css'
    });
  });

  it('creates pugjs files', () => {
    assert.file(['views/layout.pug', 'views/index.pug', 'views/error.pug']);
  });
});

describe('generator-typexpress:app-stylus-file', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'app-stylus-file',
      engine: 'pug',
      css: 'styl'
    });
  });

  it('creates stylus files', () => {
    assert.file(['public/css/style.styl']);
  });
});
