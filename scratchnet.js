var http = require('http');
var fs = require('fs');
var JITScratch = require("jitscratch");

function ScratchNet() {
    this.JITScratch = new JITScratch();
    this.Server = null;
    this.procDefs = [];
    this.clientSource = "";
}

ScratchNet.prototype.genClientSource = function() {
    var src = "new (function(){var ext=this;ext._shutdown=function(){};ext._getStatus=function(){return{status:2,msg:\"Ready\"}};";
    
    var extName = "ScratchNet";
    var extURL = "https://github.com/bobbybee/scratch-net";
    
    var descriptor = {
        blocks: [
        
        ],
        menus : {
            
        },
        url: extURL
    };
    
    src += "ScratchExtensions.register(\""+extName+"\", "+JSON.stringify(descriptor)+", ext);})";
    this.clientSource = src;
}

ScratchNet.prototype.compile = function(filename) {
    this.procDefs = this.JITScratch.getProcDefs();
    
    fs.writeFileSync(filename, this.JITScratch.generateSourceCode());
    this.Server = require("./"+filename);

    this.genClientSource();
}

ScratchNet.prototype.run = function(port) {
    var _this = this;
    
    http.createServer(function(req, res) {
        res.writeHead(200, {"Content-Type" : "application/javascript"});        
        res.end(_this.clientSource);
    }).listen(port);
}

module.exports = ScratchNet;