/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date: Nov 24th, 2021
 * Author: Raymond Lee
 *
 */


 
const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

IOhandler.unzip(zipFilePath, pathUnzipped)
.then((complete) => console.log(complete))
.then(() => IOhandler.readDir(pathUnzipped))
.then((png_array) => IOhandler.grayScale(png_array, pathProcessed))
.then((finish) => console.log(finish))
.catch((err) => console.log(err))

