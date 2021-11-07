const tagModel = require('../models/tag')
const asyncTagModel = require('../models/asyncTag');

const parseTags = (unparsedTags, isRoot = true) => new Promise((resolve, reject) => {
  let parsedTags = [];
  let i = 1;

  unparsedTags.forEach(async tag => {
    tag.child = [];
    try {
      const parentTags = await asyncTagModel.getParentTags(tag.id);
      if (!parentTags.length || !isRoot) {
        const childTags = await asyncTagModel.getChildTags(tag.id);
        if (childTags.length) {
          tag.child = await parseTags(childTags, false);
        }
        parsedTags.push(tag);
      }
    } catch (error) {
      reject(error);
      return;
    }

    if (unparsedTags.length == i) {
      resolve(parsedTags);
    }
    i++;
  });
});

const tagController = {
  index: async (req, res) => {
    const allTags = await asyncTagModel.getAll();
    const parsedTags = await parseTags(allTags);

    res.render('index', {
      page: 'empty',
      tags: parsedTags,
      id: undefined,
      childTags: undefined,
      childFiles: undefined,
      childFolders: undefined
    });
  },

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

  get: async (req, res) => {
    const id = req.params.id
    try {
      const allTags = await asyncTagModel.getAll();
      const thisTag = await asyncTagModel.get(id);
      const parsedTags = await parseTags(allTags);
      const childTags = await asyncTagModel.getChildTags(id);
      const childFiles = await asyncTagModel.getChildFiles(id);
      const childFolders = await asyncTagModel.getChildFolders(id);

      res.render('index', {
        page: 'item',
        tags: parsedTags,
        thisTag,
        id,
        childTags,
        childFiles,
        childFolders
      });
    } catch (error) {
      console.log(error);
    }
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
    try {
      const allTags = await asyncTagModel.getAll();
      const parsedTags = await parseTags(allTags);
      res.render('tagsTree', {
        items: parsedTags
      });
    } catch (error) {
      console.log(error);
    }
  },

  addTags: async (req, res) => {
    try {
      const id = req.params.id;
      const allTags = await asyncTagModel.getAll();
      const parsedTags = await parseTags(allTags);
      res.render('addTags', {
        items: parsedTags,
        id
      })
    } catch (error) {
      console.log(error);
    }
  },

  addTagsRes: async (req, res) => {
    const id = req.body.id;
    const thisId = req.body.thisTagId || [];

    const pParentTagIds = req.body.parentTagIds || [];
    let parentTagIds = Array.isArray(pParentTagIds) ? pParentTagIds : [pParentTagIds];

    const pParentFileIds = req.body.parentFileIds || [];
    const parentFileIds = Array.isArray(pParentFileIds) ? pParentFileIds : [pParentFileIds];

    const pParentFolderIds = req.body.parentFolderIds || [];
    const parentFolderIds = Array.isArray(pParentFolderIds) ? pParentFolderIds : [pParentFolderIds];

    const pChildTagIds = req.body.childTagIds || [];
    const childTagIds = Array.isArray(pChildTagIds) ? pChildTagIds : [pChildTagIds];

    if (thisId.length) {
      parentTagIds.push(thisId);
    }

    childTagIds.forEach(async childTagId => {
      parentTagIds.forEach(async parentTagId => {
        await asyncTagModel.addTagRelation(parentTagId, childTagId);
      });
      parentFileIds.forEach(async parentFileId => {
        await asyncTagModel.addFileRelation(parentFileId, childTagId);
      });
      parentFolderIds.forEach(async parentFolderId => {
        await asyncTagModel.addFolderRelation(parentFolderId, childTagId);
      });
    });

    res.redirect(`/tags/${id}`);
  }
}

module.exports = tagController