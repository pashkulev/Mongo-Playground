const fs = require("fs");
const qs = require("querystring");
const url = require("url");

let Image = require("../models/ImageSchema");
let Tag = require("../models/TagSchema");

const htmlPlaceholder = "<div class='replaceMe'></div>";

function getTagNames(formTags) {
  return new Promise((resolve, reject) => {
    if (formTags === "" || formTags === "Write tags separted by ,") {
      Tag.find().then((tags) => {
        resolve(tags.map(tag => tag.name));
      });
    } else {
      let tagNames = formTags.split(/[\s,]+/)
      .filter(tag => tag !== "")
      .map(tag => tag.trim());

      resolve(tagNames);
    }
  });
}

module.exports = (req, res) => {
  if (req.pathname.startsWith('/search')) {
    fs.readFile("./views/results.html", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      let formData = qs.parse(url.parse(req.url).query);
      
      getTagNames(formData.tagName).then((tagNames) => {
        let afterDate = formData.afterDate === "" ? new Date(0) : Date.parse(formData.afterDate);
        let beforeDate = formData.beforeDate === "" ? new Date() : Date.parse(formData.beforeDate);
        let limit = formData.Limit === "" ? 10 : Number(formData.Limit);
  
        Image.find()
          .where('tags').in(tagNames)
          .where('creationDate').lt(beforeDate).gt(afterDate)
          .sort("-creationDate")
          .limit(limit)
          .then((images) => {

            let replacementHtml = '';

            for (let image of images) {
              replacementHtml += `
                <fieldset>
                  <legend>${image.imageTitle}:</legend> 
                  <img src="${image.imageUrl}" />
                  <p>${image.description}<p/>
                  <button onclick='location.href="/delete?id=${image._id}"' class='deleteBtn'>Delete</button> 
              </fieldset>`;
            }
  
            let html = data.toString().replace(htmlPlaceholder, replacementHtml);
            res.writeHead(200, {
              "content-type": "text/html"
            });
            res.write(html);
            res.end();
        }).catch(err => {
          console.log(err);
          res.writeHead(302, {
            Location: "/"
          });
          res.end();
        });
      });
    });
  } else {
    return true
  }
}
