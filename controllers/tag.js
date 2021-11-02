const tagModel = require('../models/tag')
const asyncTagModel = require('../models/asyncTag');

const tagController = {
  getAll: async (req, res) => {
    try {
      const results = await asyncTagModel.getAll();
      res.render('tags', {
        tags: results
      })
    } catch (error) {
      console.log(error);
    }
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

  getTree: async (req, res) => {
    const parseTags = (unparsedTags) => new Promise((resolve, reject) => {
      let parsedTags = [];
      let i = 1;

      unparsedTags.forEach(async tag => {
        tag.child = [];
        const childTags = await asyncTagModel.getChildTags(tag.id);
        if (childTags.length) {
          try {
            tag.child = await parseTags(childTags);
          } catch (error) {
            reject(error);
            return;
          }
        }

        parsedTags.push(tag);

        if (unparsedTags.length == i) {
          resolve(parsedTags);
        }
        
        i++;
      });
    });

    try {
      const allTags = await asyncTagModel.getAll();
      console.log(`Get all:${allTags.length}`);
      const parsedTags = await parseTags(allTags);
      console.log(`DONE ${parsedTags.length}`);

      res.render('tagsTree', {
        items: parsedTags
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = tagController