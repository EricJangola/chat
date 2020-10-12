const chai = require("chai");
const socket = require("../socket");
let {  init, sendMessage, killConnection } = require("../socket");
server = require("../../server/socket")

describe("Client functions", function() {
    before(function () {
        //subindo o servidor para teste
        server.init(res => {  
        })
    });

    context('init client', function() {
        it('init client', function() {      
            init( res => {
                chai.expect(res).to.be.equal(true)
            })
        })
        it('write message', function() {          
            sendMessage(0, null, 'take', false, res => {
                chai.expect(res).to.be.equal(true)
            })
        })
        it('remove client', function() {          
            killConnection(res => {
                chai.expect(res.destroyed).to.be.equal(true)
            })
          })
    })

    after(function() {
        server.closeServer()
        process.exit();
    });

});