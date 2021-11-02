const db = require('../db')

/**
 * @returns {Promise<any[]>}
 */
const getAll = () => new Promise((resolve, reject) => {
  db.query(
    'SELECT * FROM tags', (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    }
  )
});

/**
 * @param {number} id 
 * @returns {Promise<any[]>}
 */
const get = (id) => new Promise((resolve, reject) => {
  db.query(
    'SELECT * FROM tags WHERE id = ?', [id], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    }
  )
});

/**
 * @param {number} id 
 * @returns {Promise<any[]>}
 */
const getChildTags = (id) => new Promise((resolve, reject) => {
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
});

/**
 * @param {number} id 
 * @returns {Promise<any[]>}
 */
const getParentTags = (id) => new Promise((resolve, reject) => {
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
});

/**
 * @param {number} id 
 * @returns {Promise<any[]>}
 */
const getChildFiles = (id) => new Promise((resolve, reject) => {
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
});

const tagModel = {
  getAll, get, getChildTags, getParentTags, getChildFiles,
}

module.exports = tagModel