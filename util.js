const fs = require("fs");

/**
 * Wraps fs.readFile as a Promise.
 * @param {string} fileName Path of the file to load.
 * @param {string} type Type of the file to load.
 */
const readFile = (fileName, type) =>
  new Promise((resolve, reject) =>
    fs.readFile(fileName, type, (err, data) => {
      // If has error reject, otherwise resolve
      return err ? reject(err) : resolve(data);
    })
  );

module.exports = {
  readFile
};
