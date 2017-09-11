const fs = require('fs')
const _ = require('lodash')
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

const getHour = (raw) =>{
  const split = raw.split('h')
  return {
    hour: parseInt(split[0]),
    minute: parseInt(split[1])? parseInt(split[1]) : 0
  }
}

const getTimesFromString = (day, string) => {
  const split = string.split(' - '),
        start =  getHour(split[0]),
        end =  getHour(split[1])

  return {
    start: new Date(2017, 9, parseInt(day), start.hour, start.minute, 0),
    end: new Date(2017, 9, parseInt(day), end.hour, end.minute, 0)
  }
}

const saveUpsert = (Model, query, data, upsert = true) => new Promise((resolve, reject) => {
  const setData = {$set: data}
  setTimeout(function() {
    Model
    .findOneAndUpdate(query, setData, {new: true, upsert}).exec()
    .then(res => {
      if (res) return resolve(res.id)
    })
    .catch(reject)
  }, 1000 * Math.random())
})

const getSalaId = (sala) => {
  const query = {
    name: sala
  }
  return saveUpsert(Models.locals, query, query)
}

const toSpeakerId = (speaker) => {
  const split = speaker.split(' - '),
        speakerName = split[0],
        speakerInstituition = split[1]

  const query = {
    name: speakerName,
    institution: speakerInstituition
  }

  return saveUpsert(Models.speakers, query, query)
}


const normalizeEvents = (events, sala, day) => {
  // console.log(events)
  return _.mapValues(events, (event, timeString) => {
    const times = getTimesFromString(day, timeString)
    let speakers = event.speakers

    event.start = times.start
    event.end = times.end
    event.local = sala
    if (event.speakers) {
      event.speakers = event.speakers.map(toSpeakerId)
    } else {
      event.speakers = []
    }

    return event
  })
}

module.exports = {
  readFilesFromFolder,
  normalizeEvents,
  getSalaId
}
