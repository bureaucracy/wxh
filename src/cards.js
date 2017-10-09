'use strict'

const dbs = require('./db')
const db = dbs.register('cards')
const concat = require('concat-stream')

exports.add = function (item, callback) {
  let created = new Date().getTime()

  let obj = {
    description: item.value && item.value.description,
    url: item.value,
    created: created
  }

  if (!obj.url || !obj.url.match(/^http(s?):\/\/\w+/i)) {
    return callback(new Error('Invalid url'))
  }

  if (!obj.url.match(/youtube\.com|youtu\.be/gi) &&
      !obj.url.match(/vimeo\.com/gi) &&
      !obj.url.match(/\.(jpg|jpeg|gif|png)$/i)) {
    return callback(new Error('Url must be one of: youtube/vimeo/image'))
  }

  let link = item.value.split('://')[1].trim()

  db.get('link~' + link, (err, lk) => {
    if (err || !lk) {
      let opts = [
        {
          type: 'put',
          key: 'link~' + link,
          value: obj
        },
        {
          type: 'put',
          key: 'feed~' + created + '~' + link,
          value: obj
        }
      ]

      db.batch(opts, (err) => {
        if (err) {
          console.log('Could not save link: ', err)
          return callback(err)
        }

        callback(null, JSON.stringify({
          type: 'card.feed',
          value: [{
            url: item.value,
            created: created
          }]
        }))
      })
    } else {
      callback(null, JSON.stringify({
        type: 'card.feed',
        value: [lk]
      }))
    }
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
    console.log('Link retrieval error ', err)
  })
}
