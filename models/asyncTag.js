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
const getChildFiles = (id) => new Promise((resolve, reject) => {
  const options =
    'SELECT * FROM files INNER JOIN file_relation ON file_relation.child_file_id = files.id WHERE file_relation.parent_tag_id = ?';
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
  getAll, get, getChildTags, getChildFiles,
}

module.exports = tagModel