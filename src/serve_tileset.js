var http = require('http');
var fs = require('fs');
var path = require('path');

var dotenv = require('dotenv')
dotenv.config()

const rootDirPath = process.env.NODE_PATH_IN_DIR;
const fileUnifiedPath = `${process.env.NODE_PATH_OUT}/${process.env.NODE_FILE_UNIFIED}`;

console.log(`Serving from ${rootDirPath}`)

http.createServer(function (request, response) {
    console.log('request starting...');

    var filePath = path.join(rootDirPath, request.url);
    if (['/', '/tileset.json', '/tileset_unified.json'].includes(request.url)) {
        filePath = fileUnifiedPath;
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.json':
            contentType = 'application/json';
            break;
        case '.b3dm':
            contentType = 'application/octet-stream';
            break;
    }

    console.log(filePath)
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(3002);
console.log('Server running at http://localhost:3002/');