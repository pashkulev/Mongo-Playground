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
          res.redirectToHome();
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
              throw err;
            }
  
            Tag.find().then((tags) => {
              let replacementHtml = "";
              for (let tag of tags) {
                replacementHtml += `<div class='tag' id=${tag._id}">${tag.name}</div>`
              }
  
              let html = data.toString().replace(replacementPlaceholder, replacementHtml);
              res.sendHtml(html);
            });
          });
        }).catch(err => {
          console.log(err.message);
          res.redirectToHome();
        });
    });
  } else {
    return true
  }
}
