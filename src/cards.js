'use strict'

const dbs = require('./db')
const db = dbs.register('cards')

exports.add = function (item, callback) {
  let created = new Date().getTime()

  let obj = {
    description: item.value && item.value.description,
    created: created
  }

  let opts = [
    {
      type: 'put',
      key: 'feed~' + created,
      value: obj
    }
  ]

  db.batch(opts, (err) => {
    if (err) {
      console.log('Could not save card: ', err)
      return callback(err)
    }

    callback(null, JSON.stringify({
      type: 'card.feed',
      value: [obj]
    }))
  })
}

exports.list = function (ws, broadcast) {
  let rs = db.createValueStream({
    gte: 'feed~',
    lte: 'feed~\xff',
    reverse: true,
    limit: 12
  })

  rs.on('data', (item) => {
    broadcast({
      type: 'card.feed',
      value: [item]
    }, ws)
  })

  rs.on('error', (err) => {
    console.log('Card retrieval error ', err)
  })
}
