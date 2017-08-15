['navigation', 'resource']
  .forEach(function(entryType) {
    performance.getEntriesByType(entryType).forEach(function(e) {
      const {name: url, serverTiming = []} = e
      serverTiming.forEach(function({duration}) {
        log('server-timing entry =',
          JSON.stringify({url, entryType, duration}, null, 2))
      })
    })
})