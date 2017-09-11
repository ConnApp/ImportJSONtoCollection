const fs = require('fs')
const path = require('path')
const lib = require('../index.js')
const libPath = path.resolve(__dirname).replace('/utils', '')
const rootPath = libPath.replace('/lib', '')
const assetsPath = `${rootPath}/assets`
const Models = lib.mongoose.models

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

const hasH = (string) => string.indexOf > -1

const splitH = (string) => string.split('h')

const getTimesFromString = (day, string) => {
  const split = string.split(' - ')
  let startHour, startMinute, endHour, endMinute

  if (hasH(split[0])) {
    let hSplit = splitH(split[0])
    startHour = hSplit[0]
    startMinute = hSplit[1]
  } else {
    startHour = split[0]
  }

  if (hasH(split[1])) {
    let hSplit = splitH(split[1])
    endHour = hSplit[0]
    endMinute = hSplit[1]
  } else {
    endHour = split[1]
  }

}

const saveUpsert = (Model, query, data, upsert = true) => new Promise((resolve, reject) => {

  Model
    .find(query).exec()
    .then(res => {
      if (res.length) return resolve(res[0].id)

      const ModelToSave = new Model(data)
      return ModelToSave.save()
    })
    .then(doc => resolve(doc.id))
    .catch(reject)

})

const getSalaId = (sala) => {
  const query = {
    name: sala
  }
  return saveUpsert(Models.locals, query, query)
}

module.exports = {
  readFilesFromFolder,
  getSalaId
}
