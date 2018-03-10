var base64 = require('base64-img')

var Log = require('log');
var nameModule = '[Picture Helper]';
var log = new Log('debug');

function imageToBase64(param){
    return new Promise((resolve, reject)=>{
        base64.base64(param, function(err, data) {
            if(err){
                log.error(`-----> ${nameModule} ${imageToBase64.name} Error encoding img`)
                reject(err)
            }
            log.debug(`-----> ${nameModule} ${imageToBase64.name} Img encoded`)
            resolve(data)
        })       
    })   
}
module.exports = {
    imageToBase64
}
