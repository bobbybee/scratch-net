var scratchnet = new(require("./scratchnet"));

scratchnet.JITScratch.fetchScratchProject(10297480, function() {
    scratchnet.compile("./10297480.js");
    scratchnet.run(8080);
});