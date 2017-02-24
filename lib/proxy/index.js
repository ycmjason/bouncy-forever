var bouncy = require('bouncy');

function defaultRes(req, res){
  res.statusCode = 404;
  res.end('404 Not Found');
}

module.exports = function(ports, defaultResponse){
  // ports contains {subdomain: port}
  if(!defaultResponse) defaultResponse = defaultRes;
  return bouncy(function(req, res, bounce){
    if(ports[req.headers.host]) bounce(ports[req.headers.host]);
    else defaultResponse(req, res);
  });
}
