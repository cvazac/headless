// go to: http://www.alexa.com/topsites
// execute the following:

[].reduce.call(document.getElementsByClassName('listings table')[0].getElementsByTagName('a'), function(array, a) {
  if (a.href.indexOf('siteinfo') !== -1)
    array.push('http://' + a.textContent.toLowerCase())
  return array
}, []).join('\n')
