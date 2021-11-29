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
const { Stream } = require("stream");
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
    if (fs.existsSync(pathOut)) {
      resolve(`${pathOut} DIR exists moving to the readDir function...`) 
    } else {
      fs.createReadStream(`${pathIn}`)
      .pipe(unzipper.Extract({ path: `${pathOut}` }))
      .on('finish', () =>  resolve('Extraction Operation Complete'))
    }

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
  
  return new Promise((resolve, reject) => {
    
    pathIn.forEach(pngPath => {
      
      fs.createReadStream(pngPath)
      .pipe(new PNG())
      .on("parsed", function () {
    
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            
            var i = (y * 4) * this.width + x * 4;
            var avg = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
            // invert color
            this.data[idx] = avg;
            this.data[idx + 1] = avg;
            this.data[idx + 2] = avg;

            
            // and reduce opacity
            this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
        
        this.pack().pipe(fs.createWriteStream(`${pathOut}/grayscaled${x}.png`))
       
      });
    })
  })
};


module.exports = {
  unzip,
  readDir,
  grayScale,
};
