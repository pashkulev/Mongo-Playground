const qs = require("querystring");
const url = require("url");

let Image = require("../models/ImageSchema");
let Tag = require("../models/TagSchema");

function addImage(req, res) {
  let body = "";
  req.on("data", (data) => {
      body += data;
  });

  req.on("end", () => {
      let formImage = qs.parse(body);

      if (formImage.imageUrl === "" 
        || formImage.imageUrl === "Your URL" 
        || formImage.imageTitle === "") {
          res.writeHead(302, {
            Location: "/"
          });
          res.end();
          return;
      }
      
      let tagNames = formImage.tags.split(/[\"\s,]+/);

      let imageEntity = {
        imageUrl: formImage.imageUrl,
        imageTitle: formImage.imageTitle,
        description: formImage.description,
        creationDate: new Date(),
        tags: tagNames.filter((item, pos) => tagNames.indexOf(item) == pos && item !== "")
      }

      Image.create(imageEntity).then((insertedImage) => {
        for (let tagName of insertedImage.tags) {
          Tag.findOne({name: tagName}).then((tag) => {
            tag.images.push(insertedImage._id);
            tag.save();
          });
        }

        res.writeHead(302, {
          Location: "/"
        });
        res.end();
      }).catch(err => {
        console.log(err.message);
        res.writeHead(302, {
          Location: "/"
        });
        res.end();
      });
  });
}

function deleteImg(req, res) {
  let imageId = qs.parse(url.parse(req.url).query).id;
  Image.deleteOne({_id: imageId}).then(() => {
    Tag.find({}).then((tags) => {
      for (let tag of tags) {
        let imageIndex = tag.images.indexOf(imageId);
        if (imageIndex > -1) {
            tag.images.splice(imageIndex, 1);
            tag.save();
        }
      }

      res.writeHead("302", {
        Location: "/"
      });
      res.end();
    });
  }).catch(err => {
    console.log(err);
    res.writeHead("302", {
      Location: "/"
    });
    res.end();
  });
}

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res)
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res)
  } else {
    return true
  }
}
