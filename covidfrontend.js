const config_private = require('./.iddqd1993/config_private.js')
const commons = require('./commons')
const router = require('./router')
const fs = require('fs')
const http = require('http')
const stringDecoder = require('string_decoder').StringDecoder

const httpServer = http.createServer(function(req,res){
  const response = function (payload, contentType, statusCode) {

    payload = payload.lenght < 1 ? 'null' : payload
    contentType = typeof(contentType) == 'string' ? contentType : 'text/plain'
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200

    res.setHeader('Content-Type', contentType)
    res.statusCode = statusCode
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(statusCode,{'Content-Type': contentType})
    res.end(payload)
  }

  const responseStream = function (file, contentType, statusCode) {
    contentType = typeof(contentType) == 'string' ? contentType : 'text/plain'
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200
    var stream = fs.createReadStream(file)

    stream.on('open', function () {
      res.writeHead(statusCode,{'Content-Type': contentType})
      stream.pipe(res)
      })

    stream.on('error', function(err) {
      response('404 Not Found','plain/text',404)
    })
  }
  
  const reqData = commons.getReqData(req)
  const handlers = {}

  handlers.staticResources = function(reqData, response, responseStream){   // Static resources (non-html) handled by NGINX
    if(['get'].indexOf(reqData.method) == -1){//['post','get','put','delete'] 
      response('<h1>405 Method Not Allowed</h1>', 'text/html', 405)
    }else{
      var contentType = typeof(commons.contentTypes[reqData.basenameext]) == 'undefined' ? 'text/plain' : commons.contentTypes[reqData.basenameext]
      responseStream('./_views/'+reqData.url.pathname, contentType, 200)
    }
  }

  handlers.home = function(reqData, response, responseStream){    //HP
    var acceptableMethods = ['get']  
    if(acceptableMethods.indexOf(reqData.method) == -1){
      response('<h1>405x Method Not Allowed</h1>', 'text/plain', 405)
    } else {
        responseStream('./_views/default.html', 'text/html', 200)
    }
  }

  handlers.static200 = function(reqData, response, responseStream){               //existing 200 static pages
    if(['get'].indexOf(reqData.method) == -1){//['post','get','put','delete'] 
      response('<h1>405 Method Not Allowed</h1>', 'text/html', 405)
    }else{
      responseStream(/*path.join(__dirname,*/'./_views/'+reqData.basename+'.html'/*)*/, 'text/html', 200)
    }
  }

  handlers.non200 = function(response){                           //401, 410, 301
          response('401 Unauthorized', 'text/plain', 401)
          response('301 Moved Permanently', 'text/plain', 301)
  }

  var decoder = new stringDecoder('utf-8')
  var buffer = ''

  req.on('data', function(data) {
    buffer += decoder.write(data)
  })

  req.on('end', async function() {
    buffer += decoder.end()
    var pageData
    
    if (reqData.basename.length > 0 && reqData.basenameext.length > 0) {            //static resources (non-html) handled by NGINX
        handlers.staticResources(reqData, response, responseStream)

    } else if (reqData.basename.length == 0 && reqData.basenameext.length == 0){    //HP
        handlers.home(reqData, response, responseStream)    

    } else if (router.static200.indexOf(reqData.basename) !== -1){                  //existing 200 static pages
        handlers.static200(reqData, response, responseStream)

    } else if (typeof(router.non200[reqData.basename]) !== 'undefined'){            //401, 410, 301
        handlers.non200[reqData.basename](response, responseStream)

    } else {                                                                        //do 404
        response('404 Not Found', 'text/plain', 404)
    }
  })
})
  
httpServer.listen(config_private.localPort, function (err){
  if (err) {process.exit()}
})

