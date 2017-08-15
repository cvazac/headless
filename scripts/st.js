['navigation', 'resource']
  .forEach(function(entryType) {
    const entries = performance.getEntriesByType(entryType)
    log('entries', entryType, entries.length)
    entries.forEach(function({name: url, serverTiming}) {
      serverTiming.forEach(function({duration}) {
        log('server-timing entry =',
          JSON.stringify({url, entryType, duration}, null, 2))
      })
    })
})