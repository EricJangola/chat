const chai = require("chai");
let { init, server, closeServer, validNickName, sendMessage, writeMessage } = require("../socket");
client1 = require('net').Socket();
client2 = require('net').Socket();

describe("Start server", function() {
    context('init server', function() {
        it('should return true', function() {          
            // specification code
            chai.expect(init()).to.equal(true)
            closeServer()
        })
    })
});

describe("Server functions", function() {
    before(function () {
        init()
        //conectando cliente 1
        client1.connect(process.env.CHAT_PORT || 3000, process.env.CHAT_URL || '127.0.0.1', function() {});
        client1.write(JSON.stringify({id: 0, nickname: null, message: 'take', private: false }))

        client2.connect(process.env.CHAT_PORT || 3000, process.env.CHAT_URL || '127.0.0.1', function() {});
        client2.write(JSON.stringify({id: 0, nickname: null, message: 'take2', private: false }))
    });

    context('socket size', function() {
        it('validate nickname', function() {          
            chai.expect(validNickName('take')).to.equal(false)
            chai.expect(validNickName('takeuser')).to.equal(true)
        })
        it('write message', function() {          
          chai.expect(writeMessage(0, 'teste')).to.be.equal('{"message":"teste","id":0}')
        })
        it('remove client', function() {          
            client2.destroy()
            chai.expect(validNickName('tatake2euser')).to.equal(true)
          })
    })

    after(function() {
        closeServer()
        process.exit();
    });

});