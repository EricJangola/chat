const chai = require("chai");
let { init, server, closeServer, validNickName, sendMessage, writeMessage } = require("../socket");
client1 = require('net').Socket();
client2 = require('net').Socket();

describe("Start server", function() {
    context('init server', function() {
        it('should return true', function() {          
            // specification code
            init(res => {
                chai.expect(res).to.equal(true)
                closeServer((res)=>{})})
        })
    })
});

describe("Server functions", function() {
    before(function () {
        init(res => {
        //conectando cliente 1
        client1.connect(process.env.CHAT_PORT || 3000, process.env.CHAT_URL || '127.0.0.1', function() {});
        client1.write(JSON.stringify({id: 0, nickname: null, message: 'take', private: false }))

        client2.connect(process.env.CHAT_PORT || 3000, process.env.CHAT_URL || '127.0.0.1', function() {});
        client2.write(JSON.stringify({id: 0, nickname: null, message: 'take2', private: false }))
        })
    });

    context('socket size', function() {
        it('validate nickname', function() { 
            validNickName('take', res => {
                chai.expect(res).to.equal(false)    
            })
            validNickName('takeuser', res => {
                chai.expect(res).to.equal(true)    
            })         
        })
        it('write message', function() {      
            writeMessage(0, 'teste', res => {
                chai.expect(res).to.be.equal('{"message":"teste","id":0}')
            })    
        })
        it('remove client', function() {  
            // esse teste executa internamento a função removeNickname
                    
            client2.destroy()
            validNickName('take2', res => {
                chai.expect(res).to.equal(true)
            })
          })
    })

    after(function() {
        closeServer( () => {
            process.exit();
        })
    });

});