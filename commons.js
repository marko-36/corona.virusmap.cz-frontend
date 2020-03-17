var url = require('url');
var path = require('path');
var commons = {};

commons.getReqData = function(req) {
    var reqData = {};
    reqData.url = url.parse(req.url, true);
    reqData.basename = path.basename(reqData.url.pathname);
    reqData.basenameext = path.extname(reqData.url.pathname);
    reqData.headers = req.headers;
    reqData.method = req.method.toLowerCase();
    return reqData;
};

commons.contentTypes = { 
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',   
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.js': 'application/javascript',
    '.gif': 'image/gif',
    '.css': 'text/css',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.avi': 'video/avi',
    '.m1v': 'video/mpeg',
    '.m2v': 'video/mpeg',
    '.mpeg': 'video/mpeg',
    '.weba': 'audio/webm',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
    '.xml': 'application/xml'
}

module.exports = commons;