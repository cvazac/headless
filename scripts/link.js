var links = {}
    ;[].forEach.call(document.getElementsByTagName('link'), function(link) {
  links[link.href] = link
})

log('LINKS', Object.keys(links).length)

window.performance.getEntriesByType('resource').forEach(function({name, initiatorType}) {
  if (initiatorType !== 'link') return;
  var link = links[name]
  if (link) {
    log('REL', link.rel, name)
  }
})

log('done', window.location.href)