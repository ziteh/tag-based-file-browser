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

    const childTagIdsSource = req.body.childTagIds || [];
    const childTagIds = Array.isArray(childTagIdsSource) ? childTagIdsSource : [childTagIdsSource];

    const childFileIdsSource = req.body.childFileIds || [];
    const childFileIds = Array.isArray(childFileIdsSource) ? childFileIdsSource : [childFileIdsSource];

    const childFolderIdsSource = req.body.childFolderIds || [];
    const childFolderIds = Array.isArray(childFolderIdsSource) ? childFolderIdsSource : [childFolderIdsSource];

    const parentTagIdsSource = req.body.parentTagIds || [];
    const parentTagIds = Array.isArray(parentTagIdsSource) ? parentTagIdsSource : [parentTagIdsSource];

    parentTagIds.forEach(async parentTagId => {
      childTagIds.forEach(async childTagId => {
        await asyncTagModel.addTagRelation(parentTagId, childTagId);
      });
      childFileIds.forEach(async childFileId => {
        await asyncTagModel.addFileRelation(parentTagId, childFileId);
      });
      childFolderIds.forEach(async childFolderId => {
        await asyncTagModel.addFolderRelation(parentTagId, childFolderId);
      });
    });

    res.redirect(`/tags/${id}`);
  }
}

module.exports = tagController