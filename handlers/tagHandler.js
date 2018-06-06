const fs = require("fs");
const qs = require("querystring");
const Tag = require("../models/TagSchema");

const replacementPlaceholder = "<div class='replaceMe'></div>";

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') {
    let body = "";

    req.on("data", (data) => {
      body += data;
    });

    req.on("end", () => {
        let tagName = qs.parse(body).tagName;

        if (tagName === "" || tagName === "Your tag") {
          res.writeHead(302, {
            Location: "/"
          });
          res.end();
          return;
        }

        let tag = {
          name: tagName,
          creationDate: new Date(),
          images: []
        };

        Tag.create(tag).then(() => {
          fs.readFile('./views/index.html', (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
  
            Tag.find().then((tags) => {
              let replacementHtml = "";
              for (let tag of tags) {
                replacementHtml += `<div class='tag' id=${tag._id}">${tag.name}</div>`
              }
  
              let html = data.toString().replace(replacementPlaceholder, replacementHtml);
              res.writeHead(200, {
                'Content-Type': 'text/html'
              });
              res.write(html);
              res.end();
            });
          });
        }).catch(err => {
          console.log(err.message);
          res.writeHead(302, {
            Location: "/"
          });
          res.end();
        });
    });
  } else {
    return true
  }
}
