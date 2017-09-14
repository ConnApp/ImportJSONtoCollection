const _ = require('lodash')
const lib = require('../index.js')
const utils = lib.utils
const Models = lib.mongoose.models



utils
  .readFilesFromFolder()
  .then(eventDays => {

    eventDays= eventDays.map(eventDay => eventDay.data)
    let count = 0
    Promise.all(eventDays.map(eventDay =>
      Promise.all(eventDay.map(sala =>
        utils
          .getSalaId(sala.Sala)
          .then(salaId => utils.normalizeEvents(sala.events, salaId, sala.Dia))
          .then(utils.getEventTypes)
          .then(utils.saveEvents)
      ))
    ))
    .then(result => {
      console.log('finish')
    })
  })
  .catch(err => {
    console.log(err)
  })
