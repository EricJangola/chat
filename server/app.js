const { init } = require("./socket")
init(res => {
    if(res) console.log('server started')
})