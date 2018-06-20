'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-typexpress:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'testapp',
      engine: 'pug',
      css: 'css',
      gitignore: true,
      vscodeLaunchJson: true
    });
  });

  it('creates files', () => {
    assert.file([
      'src/app.ts',
      'views/layout.pug',
      'src/routes/index.ts',
      'src/bin/www.ts',
      'public/css/style.css',
      '.vscode/launch.json'
    ]);
  });
});
