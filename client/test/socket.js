const chai = require("chai");
let {  init, sendMessage, killConnection } = require("../socket");
//server = net.createServer()

describe("Client functions", function() {
    before(function () {
        //subindo o servidor para teste
        //server.listen(process.env.CHAT_PORT || 3000, () => console.log('Server bound'));
    });

    context('init client', function() {
        it('init client', function() {          
          //chai.expect(init()).to.be.equal(true)
        })
        it('write message', function() {          
         
        })
        it('remove client', function() {          
            
          })
    })

    after(function() {
        closeServer()
        process.exit();
    });

});