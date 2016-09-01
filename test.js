'use strict';
const Plugin = require('./index');
const fs = require('fs');
const should = require('should');
const Mocha = require('mocha');

describe ('Tests', () => {
   const blankOpts = { reporter: function(){} }; // no output
   it('should fail', done => {
      const failingTest = new Mocha.Test('failing Test', () => {
         const data = fs.readFileSync('fixtures/sample.css', 'utf-8');
         const expected = "this is actually not expected";
         return plugin.process({data}).then(actual => {
            actual.data.should.eql(expected);
         });
      });
      const mocha = new Mocha(blankOpts);
      mocha.suite.addTest(failingTest);
      mocha.run(failures => {
         failures.should.equal(1);
         done();
      })
   });
});


describe('Plugin', () => {

  let plugin, config;

  beforeEach(() => {
    config = {
      paths: {root: '.'},
      plugins: {
        postcss: {
          processors: [
            require('autoprefixer')({browsers: 'last 99 versions'}),
            require('css-mqpacker'),
            require('csswring')
          ]
        }
      }
    };
    plugin = new Plugin(config);
  });

  it('should be an object', () => {
    plugin.should.be.an.Object;
  });

  // it('uses processors', () => {
  //   plugin.processors.should.be.an.Array().with.length(3);
  // });

  it('compile', () => {
    const data = 'a{a:a}';
    return plugin.compile({path: 'a.css', data}).then(file => {
      file.data.should.be.eql(data);
    });
  });

  it('compile with options', () => {
     const data = fs.readFileSync('fixtures/sample.css', 'utf-8');
     const expected = fs.readFileSync('fixtures/sample.out.css', 'utf-8');
     return plugin.compile({path: 'a.css', data}).then(actual => {
       actual.data.should.eql(expected);
     });
  });

  it('compile with sourcemaps', () => {
    const data = fs.readFileSync('fixtures/sample.css', 'utf-8');
    const map = {
      version: 3,
      sources: [ 'fixtures/sample.css' ],
      names: [],
      mappings: 'AAKA,QACE,oBAAc,AAAd,qBAAc,AAAd,iBAAc,AAAd,oBAAc,AAAd,YAAc,CACf,AAPD,cACE,GACE,UAAY,CACb,AAMD,GACE,UAAY,CACb,CAPF',
      file: 'sample.css'
    };
    return plugin.compile({data, path: 'fixtures/sample.css'}).then(file => {
      file.map.should.be.eql(map);
    });
  });

});
