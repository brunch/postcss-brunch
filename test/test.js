'use strict';
const Plugin = require('../lib');
const fs = require('fs');
const should = require('should');

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

  it('uses processors', () => {
    plugin.processors.should.be.an.Array.with.lengthOf(3);
  });

  it('compile', () => {
    const data = 'a{a:a}';
    return plugin.compile({data}, file => {
      file.data.should.be.eql(data);
    });
  });

  it('compile with options', () => {
    const data = fs.readFileSync('test/fixtures/sample.css', 'utf-8');
    const expected = fs.readFileSync('test/fixtures/sample.out.css', 'utf-8');
    return plugin.compile({data}, actual => {
      actual.data.should.be.eql(expected);
    });
  });

  it('compile with sourcemaps', () => {
    const data = fs.readFileSync('test/fixtures/sample.css', 'utf-8');
    const map = {
      version: 3,
      sources: [ 'sample.css' ],
      names: [],
      mappings: 'AAKA,QACE,oBAAc,AAAd,qBAAc,AAAd,iBAAc,AAAd,oBAAc,AAAd,YAAc,CACf,AAPD,cACE,GACE,UAAY,CACb,AAMD,GACE,UAAY,CACb,CAPF',
      file: 'sample.css'
    };
    return plugin.compile({data, path: 'test/fixtures/sample.css'}, file => {
      file.map.should.be.eql(map);
    });
  });

});
