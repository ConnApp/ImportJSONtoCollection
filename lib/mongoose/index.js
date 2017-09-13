const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed
const mongoAddress = 'mongodb://localhost'
mongoose.connect(mongoAddress)

//Models
const models = {
  events: () => {
    //Model info
    const collectionName = 'events'
    const modelName = 'events'
    const model =  {
      name: {
        type: String,
        required: true
      },
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      local: {
        type: ObjectId
      },
      order: {
        type: Number,
        required: false
      },
      eventType: {
        type: ObjectId
      },
      speakers: [{
        type: ObjectId
      }],
      likes: {
        type: Number,
        required: false
      },
      active: {
        type: Boolean,
        default: true
      },
      lastUpdate: {
        type: Date,
        default: Date.now,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  locals: () => {
    //Model info
    const collectionName = 'locals'
    const modelName = 'locals'
    const model =  {
      name: {
        type: String,
        required: true
      },
      mapImage: {
        type: String,
        required: false
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  eventType: () => {
    //Model info
    const collectionName = 'eventType'
    const modelName = 'eventType'
    const model =  {
      name: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  speakers: () => {
    //Model info
    const collectionName = 'speakers'
    const modelName = 'speakers'
    const model =  {
      name: {
        type: String,
        required: true
      },
      institution: {
        type: String,
        required: false
      },
      image: {
        perfil: {
          type: String
        },
        cover: {
          type: String
        },
        type: Object
      },
      profession: {
        type: String
      },
      about: {
        type: String
      },
      media: {
        type: String
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  }
}

module.exports = () => {

  console.log(models)
  const compiled = _.mapValues(models, (value, key) => {
    const model = value()
    return mongoose.model(model.name, model.schema)
  })

  return {
    models: compiled,
    mongoose: mongoose
  }
}
