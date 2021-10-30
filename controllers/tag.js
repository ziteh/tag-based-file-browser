const { getChildFiles } = require('../models/tag');
const tagModel = require('../models/tag')

const tagController = {
  getAll: (req, res) => {
    tagModel.getAll((err, results) => {
      if (err) return console.log(err);
      res.render('tags', {
        tags: results
      })
    })
  },

  get: (req, res) => {
    const id = req.params.id
    var allTags
    var thisTag
    var childTags
    var childFiles
    tagModel.getAll((err, results) => {
      if (err) return console.log(err);
      allTags = results
    });
    tagModel.get(id, (err, results) => {
      if (err) return console.log(err);
      thisTag = results[0]
    });
    tagModel.getChildTags(id, (err, results) => {
      if (err) return console.log(err);
      childTags = results
    });
    tagModel.getChildFiles(id, (err, results) => {
      if (err) return console.log(err);
      childFiles = results

      res.render('tag', {
        tag: thisTag,
        childTags,
        childFiles,
        allTags
      })
    });
  },

  add: (req, res) => {
    tagModel.add(req.body, (err, results) => {
      if (err) return console.log(err);
      res.redirect('/');
    })
  },

  getChildTags: (req, res) => {
    const id = req.params.id
    tagModel.getChildTags(id, (err, results) => {
      if (err) return console.log(err);
      res.send(results);
    })
  },

  getTree: (req, res) => {
    var test = [
      {
        name: "a1",
        child: [
          { name: "aa1", child: [] },
          {
            name: "aa2", child: [
              { name: "aaa1" }
            ]
          }
        ]
      },
      {
        name: "a2",
        child: [
          { name: "bb1", child: [] }
        ]
      },
      {
        name: "a3",
        child: []
      }
    ];

    var allTags = [];

    const render = (tags) => {
      res.render('tagsTree', {
        items: tags
      });
    }

    const getChild = (id, cb) => {
      tagModel.getChildTags(id, (err, results) => {
        if (err) return console.log(err);
        cb(results);
      });
    };

    const parseTags = (tags, cb) => {
      tags.forEach(tag => {
        console.log(`Tag Name: ${tag.name}`);
        getChild(tag.id, (childTags) => {
          if (childTags.length) {
            console.log(`Name:${tag.name},Length: ${childTags.length}`)
            parseTags(childTags,(pTags)=>{
              tag.child = [];
              tag.child.push(pTags);
            })
          }
        });
        cb(tag);
      });
    };

    tagModel.getAll((err, results) => {
      if (err) return console.log(err);
      var parsedTags = [];
      parseTags(results, (pTags) => {
        parsedTags.push(pTags);
      });
      render(parsedTags);
    });

  }
}

module.exports = tagController