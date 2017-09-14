const _ = require('lodash')
const lib = require('../index.js')
const utils = lib.utils
const Models = lib.mongoose.models



utils
  .readFilesFromFolder()
  .then(eventDays => {

    eventDays= eventDays.map(eventDay => eventDay.data)
    let count = 0
    eventDays.forEach(eventDay => {

      eventDay.forEach(sala => {
        count += Object.keys(sala.events).length
        utils
          .getSalaId(sala.Sala)
          .then(salaId => utils.normalizeEvents(sala.events, salaId, sala.Dia))
          .then(utils.getEventTypes)
          .then(utils.saveEvents)
          .then(savedEvents => {
            console.log(savedEvents.length)
            setTimeout(function() {
              console.log(count)
            }, 5000)
          })
          .catch(err => console.log(err))
      })
    })
  })
  .catch(err => {
    console.log(err)
  })
