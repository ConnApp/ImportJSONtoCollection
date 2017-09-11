const _ = require('lodash')
const lib = require('../index.js')
const utils = lib.utils
const Models = lib.mongoose.models

utils
  .readFilesFromFolder()
  .then(eventDays => {

    eventDays= eventDays.map(eventDay => eventDay.data)
    eventDays.forEach(eventDay => {

      eventDay.forEach(sala => {
        // console.log(sala)
        utils
          .getSalaId(sala.Sala)
          .then(salaId => utils.normalizeEvents(sala.events, salaId, sala.Dia))
          .then(events => new Promise(resolve => {
            // console.log(events)
            console.log(`-----------------------------------------------------------`)

          })
          .then(newObject => {

          })
        )
      })
    })
  })
  .catch(err => {
    console.log(err)
  })
