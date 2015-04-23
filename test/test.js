var Plugin = require("../lib");
var should = require('should');

describe('Plugin', function () {

  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it("should be an object", function() {
    plugin.should.be.ok;
  });

});