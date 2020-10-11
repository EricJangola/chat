const chai = require("chai");
const socket = require("../socket");
let {  init, sendMessage, killConnection } = require("../socket");
server = require("../../server/socket")

describe("Client functions", function() {
    before(function () {
        //subindo o servidor para teste
        server.init()
    });

    context('init client', function() {
        it('init client', function() {          
          chai.expect(init()).to.be.equal(true)
        })
        it('write message', function() {          
            chai.expect(sendMessage(0, null, 'take', false)).to.be.equal(true)
        })
        it('remove client', function() {          
            const clientSocket = killConnection()
            chai.expect(clientSocket.destroyed).to.be.equal(true)
          })
    })

    after(function() {
        server.closeServer()
        process.exit();
    });

});