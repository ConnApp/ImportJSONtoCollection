const fs = require('fs')
const path = require('path')
const libPath = path.resolve(__dirname).replace('/utils', '')
const rootPath = libPath.replace('/lib', '')
const assetsPath = `${rootPath}/assets`

const stringToJson = (jsonString) => JSON.parse(jsonString)

const readFile = (filePath) => new Promise((resolve, reject) => {
  if (!filePath) return reject(new Error('No path provided'))

  fs.readFile(filePath, (err, file) =>
    err? reject(err) : resolve(stringToJson(file))
  )
})

const readFilesFromFolder = () => new Promise((resolve, reject) => {
  fs.readdir(assetsPath, (err, files) => {
    if (err) return reject(err)

    let promiseArray = files.map(file => readFile(`${assetsPath}/${file}`))

    Promise
      .all(promiseArray)
      .then(resolve)
      .catch(reject)

  })
})



module.exports = {
  readFilesFromFolder
}
