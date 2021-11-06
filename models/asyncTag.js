const db = require('../db')

const tagModel = {
  /**
   * @returns {Promise<any[]>}
   */
  getAll: () => new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM tags', (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  /**
   * @param {number} id 
   * @returns {Promise<any[]>}
   */
  get: (id) => new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM tags WHERE id = ?', [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  /**
   * @param {number} id 
   * @returns {Promise<any[]>}
   */
  getChildTags: (id) => new Promise((resolve, reject) => {
    const options =
      'SELECT t.*, tr.parent_tag_id FROM tags AS t JOIN tag_relation AS tr ON tr.child_tag_id = t.id WHERE tr.parent_tag_id = ?';
    db.query(
      options, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  /**
   * @param {number} id 
   * @returns {Promise<any[]>}
   */
  getParentTags: (id) => new Promise((resolve, reject) => {
    const options =
      'SELECT t.*, tr.child_tag_id FROM tags AS t JOIN tag_relation AS tr ON tr.parent_tag_id = t.id WHERE tr.child_tag_id = ?';
    db.query(
      options, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  /**
   * @param {number} id 
   * @returns {Promise<any[]>}
   */
  getChildFiles: (id) => new Promise((resolve, reject) => {
    const options =
      'SELECT f.*, fr.parent_tag_id FROM files AS f JOIN file_relation AS fr ON fr.child_file_id = f.id WHERE fr.parent_tag_id = ?';
    db.query(
      options, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  /**
   * @param {number} id 
   * @returns {Promise<any[]>}
   */
  getChildFolders: (id) => new Promise((resolve, reject) => {
    const options =
      'SELECT f.*, fr.parent_tag_id FROM folders AS f JOIN folder_relation AS fr ON fr.child_folder_id = f.id WHERE fr.parent_tag_id = ?';
    db.query(
      options, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    )
  }),

  createTag: (name,
    type = 1,
    alias = null,
    remark = null,
    thumbnallPath = null,
    fontColor = null,
    backColor = null) => new Promise((resolve, reject) => {
      const options = 'INSERT INTO `tags` (`id`, `name`, `type`, `alias`, `remark`, `thumbnail_path`, `font_color`, `back_color`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
      const params = [name, type, alias, remark, thumbnallPath, fontColor, backColor];
      db.query(
        options,
        params,
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
        }
      )
    }),

  addTagRelation: (parentId, childId) => new Promise((resolve, reject) => {
    const options = 'INSERT INTO `tag_relation` (`id`, `parent_tag_id`, `child_tag_id`) VALUES (NULL, ?, ?)';
    db.query(options, [parentId, childId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    })
  })
}

module.exports = tagModel