/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov 24th, 2021
 * Author: Raymond Lee
 *
 */



const { resolve } = require("path");
const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

  

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => { 
    fs.createReadStream(`${pathIn}`)
    .pipe(unzipper.Extract({ path: `${pathOut}` }))
    resolve('Extraction Operation Complete') // MAKE SURE TO ONLY CONSOLE.LOG AFTER CREATING THE FOLDER
  })
};


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  let png = []
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        files.forEach(file => {
          if (path.extname(`${file}`).includes('.png')){
            png.push(`${dir}/${file}`)
          } 
        })
        resolve(png)
      }
    })
  })
  
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  // console.log(pathIn)
  return new Promise((resolve, reject) => {
    pathIn.forEach(pngPath => {
      fs.createReadStream(pngPath)
      .pipe(new PNG())
      .on("parsed", function () {
    
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
     
            // invert color
            this.data[idx] = 255 - this.data[idx];
            this.data[idx + 1] = 255 - this.data[idx + 1];
            this.data[idx + 2] = 255 - this.data[idx + 2];
     
            // and reduce opacity
            this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
     
        this.pack().pipe(fs.createWriteStream(pathOut))
        
      });
    })
  })
};


// const grayScale = (pathIn, pathOut) => {
  
 
//   // console.log(pathOut)
//   return new Promise((resolve, reject) => {
//     pathIn.forEach(image => {
//       fs.createReadStream(image)
//       .pipe(
//         new PNG({
//           filterType: 4,
//         })
//       )
//       .on("parsed", function () {
//         for (var y = 0; y < this.height; y++) {
//           for (var x = 0; x < this.width; x++) {
//             var idx = (this.width * y + x) << 2;
     
//             // invert color
//             this.data[idx] = 255 - this.data[idx];
//             this.data[idx + 1] = 255 - this.data[idx + 1];
//             this.data[idx + 2] = 255 - this.data[idx + 2];
     
//             // and reduce opacity
//             this.data[idx + 3] = this.data[idx + 3] >> 1;
//           }
//         }
     
//         this.pack().pipe(fs.createWriteStream(pathOut))
//         resolve('done')
//       });
//     })
  
//   })
// };

module.exports = {
  unzip,
  readDir,
  grayScale,
};
