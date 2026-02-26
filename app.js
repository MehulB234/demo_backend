var http = require ("http");
const port = process.env.PORT || 3001;

http
    .createServer(function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello Guys!");
    })
    .listen(port);