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

const saveUpsert = (Model, query, data, upsert = true, returnAll = false) =>
  new Promise((resolve, reject) => {

    const setData = {
      $set: {
        ...data,
        likes: 0,
        lastUpdate: new Date(),
        createA0t: new Date()
      }
    }

    setTimeout(function() {
      Model
        .findOneAndUpdate(query, setData, {new: true, upsert}).exec()
        .then(res => {
          // console.log(`${res.name} added successfully`)

            if (res && !returnAll) return resolve(res.id)
            if (res) return resolve(res)
        })
        .catch(reject)
    }, 1000 * Math.random())
  }
)

const getSalaId = (sala) => {
  const query = {
    name: sala
  }
  return saveUpsert(Models.places, query, query)
}

const eventTypeId = (eventType) => {
  const query = {
    name: eventType
  }
  return saveUpsert(Models.eventtypes, query, query, true, true)
}

const saveSpeaker = (speaker) => {
  const split = speaker.split(' - '),
        speakerName = split[0],
        speakerInstituition = split[1]

  const query = {
    name: speakerName,
    institution: speakerInstituition
  }

  return saveUpsert(Models.speakers, query, query, true, true)
}

const toSpeakerName = (speaker) => speaker.split(' - ')[0]

const mapEventsToIds = (events, sala, day, speakers) =>
  _.mapValues(events, (event, timeString) => {
    const times = getTimesFromString(day, timeString)

    event.start = times.start
    event.end = times.end
    event.place = sala

    if (event.speakers) {
      let speakerNames = event.speakers.map(toSpeakerName)
      const nameArray = speakers.map(speaker => speaker.name)
      const idArray = speakers.map(speaker => speaker.id)

      event.speakers = speakerNames.map(speakerName => {
        const index = nameArray.indexOf(speakerName)
        if (index > -1) {
          return idArray[index]
        }
        return speakerName
      })
    } else {
      event.speakers = []
    }

    return event
  })

const normalizeEvents = (events, sala, day) => new Promise((resolve, reject) => {
  // console.log(events)
  const speakersToSave =
    _.chain(events)
    .mapValues(event => {
      if (event.speakers && event.speakers.length) {
        return event.speakers
      }
      return null
    })
    .filter(speakers => speakers) // Remove invalids
    .flatMap(speakers => speakers) // Join into single array
    .value()

  if (speakersToSave.length) {
    Promise
      .all(speakersToSave.map(saveSpeaker))
      .then(speakersId => {
        events = mapEventsToIds(events, sala, day, speakersId)
        resolve(events)
      })
      .catch(reject)
  } else {
    events = mapEventsToIds(events, sala, day)
    resolve(events)
  }
})

const saveEventTypes = (events) => Promise.all(
  _.values(_.mapValues(events, event => event.eventType)).map(eventTypeId)
)

const getEventTypes = (events) => new Promise((resolve, reject) => {
  saveEventTypes(events)
    .then(eventTypeDocs => {
      const idArray = eventTypeDocs.map(eventType => eventType.id)
      const nameArray = eventTypeDocs.map(eventType => eventType.name)

      events = _.mapValues(events, event => {
        const index = nameArray.indexOf(event.eventType)
        if (index > -1) {
          event.eventType = idArray[index]
        }
        return event
      })

      resolve(events)
    })
    .catch(reject)
})

const toSaveEvent = (event) =>
  saveUpsert(Models.events, event, event, true, true)


const saveEvents = (events) =>
  Promise.all(_.values(events).map(toSaveEvent))


module.exports = {
  readFilesFromFolder,
  getEventTypes,
  normalizeEvents,
  saveEvents,
  getSalaId
}
