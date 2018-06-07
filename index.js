const http = require('http');
const url = require('url');
const qs = require('querystring')
const port = process.env.PORT || 5000;
const handlers = require('./handlers/handlerBlender');

require('./config/db')().then(() => {
  http
  .createServer((req, res) => {
    req.pathname = url.parse(req.url).pathname;
    req.pathquery = qs.parse(url.parse(req.url).query);

    res.redirectToHome = () => {
      res.writeHead("302", {
        Location: "/"
      });
      res.end();
    };

    res.sendHtml = (html) => {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(html);
      res.end();
    };

    for (let handler of handlers) {
      if (!handler(req, res)) {
        break
      }
    }
  })
  .listen(port)
}).catch(err => {
  console.log(err.message);
});


