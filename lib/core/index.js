const _ = require('lodash')
const lib = require('../index.js')
const utils = lib.utils
const Models = lib.mongoose.models


let count = 0

utils
  .readFilesFromFolder()
  .then(eventDays => {
    eventDays = eventDays.map(eventDay => eventDay.data)
    return Promise.all(eventDays.map(eventDay =>
      Promise.all(eventDay.map(sala =>
        utils
          .getSalaId(sala.Sala)
          .then(salaId => utils.normalizeEvents(sala.events, salaId, sala.Dia))
          .then(utils.getEventTypes)
          .then(utils.saveEvents)
          .then(savedEvent => {
            console.log(savedEvent)
          })
        )
      )
    ))
  })
  .then(result => {
    console.log('Finished')
  })
  .catch(err => {
    console.log(err)
  })
