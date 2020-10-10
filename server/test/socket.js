const chai    = require("chai");
let { init, server, closeServer } = require("../socket");

describe("Start server", function() {
    context('init server', function() {
        it('should return true', function() {          
            // specification code
            chai.expect(init()).to.equal(true)
            closeServer()
        })
    })
});