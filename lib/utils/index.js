const fs = require('fs')
const path = require('path')
const libPath = path.resolve(__dirname).replace('/utils', '')
const rootPath = libPath.replace('/lib', '')

const readFiles = () => new Promise((resolve, reject) => {
  console.log(rootPath)
})

module.exports = {
  readFiles
}
