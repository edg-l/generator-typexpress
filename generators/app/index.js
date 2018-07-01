'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    var pjson = require('../../package.json');
    this.log(
      yosay(
        `Welcome to the unreal ${chalk.red(
          'generator-typexpress'
        )} generator!\nVersion: ${pjson.version}`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name:',
        default: this.appname,
        filter: name => name.replace(/\s+/g, '_')
      },
      {
        type: 'list',
        name: 'engine',
        message: 'What template engine you want to use?',
        default: 'pug',
        choices: ['pug', 'hbs', 'dust', 'ejs', 'twig', 'vash', 'jade']
      },
      {
        type: 'list',
        name: 'css',
        message: 'What stylesheet engine you want to use?',
        default: 'css',
        choices: ['css', 'less', 'styl', 'sass']
      },
      {
        type: 'confirm',
        name: 'mongoose',
        message: 'Add mongoose?',
        default: false
      },
      {
        type: 'confirm',
        name: 'gitignore',
        message: 'Add ".gitignore" file?',
        default: true
      },
      {
        type: 'confirm',
        name: 'vscodeLaunchJson',
        message: 'Add vscode files?',
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your project must be inside a folder named ${
          this.props.name
        }\nI'll automatically create this folder.`
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  writing() {
    this.fs.copyTpl(this.templatePath('*.json'), this.destinationPath(''), {
      props: this.props
    });

    if (this.props.git) {
      this.fs.copyTpl(
        this.templatePath('gitignore.txt'),
        this.destinationPath('.gitignore'),
        { props: this.props }
      );
    }

    if (this.props.vscodeLaunchJson) {
      this.fs.copyTpl(
        this.templatePath('editors/vscode/launch.json'),
        this.destinationPath('.vscode/launch.json'),
        { props: this.props }
      );
    }

    if (this.props.mongoose) {
      this.fs.copyTpl(
        this.templatePath('schemas/user.ts'),
        this.destinationPath('src/schemas/user.ts'),
        { props: this.props }
      );
    }

    this.fs.copy(
      this.templatePath(`css/style.${this.props.css}`),
      this.destinationPath(`public/css/style.${this.props.css}`)
    );

    this.fs.copyTpl(
      this.templatePath('bin/www.ts'),
      this.destinationPath('src/bin/www.ts'),
      { props: this.props }
    );

    this.fs.copyTpl(this.templatePath('ts/app.ts'), this.destinationPath('src/app.ts'), {
      props: this.props
    });

    this.fs.copy(this.templatePath('ts/routes/*.ts'), this.destinationPath('src/routes'));

    this.fs.copy(
      this.templatePath(`views/*.${this.props.engine}`),
      this.destinationPath('views')
    );
  }

  install() {
    var deps = [];
    var depsDev = [];

    function addPkg(names) {
      names.forEach(element => {
        deps.push(element);
        depsDev.push('@types/' + element);
      });
    }

    addPkg(['express', 'debug', 'http-errors', 'morgan', 'cookie-parser']);

    if (this.props.mongoose) {
      addPkg(['mongoose']);
      deps.push('typegoose');
    }

    switch (this.props.engine) {
      case 'pug': {
        addPkg(['pug']);
        break;
      }
      case 'dust': {
        // No ts package
        deps.push('adaro');
        break;
      }
      case 'hbs': {
        addPkg(['hbs']);
        break;
      }
      case 'ejs': {
        addPkg(['ejs']);
        break;
      }
      case 'twig': {
        addPkg(['twig']);
        break;
      }
      case 'vash': {
        // No ts package
        deps.push('vash');
        break;
      }
      default: {
        break;
      }
    }

    switch (this.props.css) {
      case 'styl': {
        addPkg(['stylus']);
        break;
      }
      case 'less': {
        addPkg(['less-middleware']);
        break;
      }
      case 'sass': {
        addPkg(['node-sass-middleware']);
        break;
      }
      default: {
        break;
      }
    }

    this.npmInstall(deps, { save: true });
    this.npmInstall(depsDev, { 'save-dev': true });
  }
};
