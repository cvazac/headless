const CDP = require('chrome-remote-interface')
const timeout = require('delay')
const fs = require('fs')
const readline = require('readline')

if (process.argv.length < 3) {
  console.error('Usage: node index.js <path-to-js-code>')
  process.exit(1)
}

init()

async function init() {
  let cdp
  try {
    cdp = await CDP()

    const {Page, Runtime} = cdp

    const code = fs.readFileSync(process.argv[2]).toString()
    const expression = '(function() {' +
      'var out = [];' +
      'function log() { out.push(Array.prototype.slice.call(arguments)) };' +
      code + ';' +
      'return JSON.stringify(out)' +
    '})()'

    const urls = fs.readFileSync('./urls.js').toString().split('\n')
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      if (!url) continue

      await Page.navigate({url})

      await Page.loadEventFired()

      await timeout(1000)

      const out = await Runtime.evaluate({expression})
      if (out && out.result) {
        console.info(`results from: ${url}`)
        JSON.parse(out.result.value).forEach(function (args) {
          console.info.apply(console, args)
        })
        console.info() //creates newline in output
      }
    }

    cdp.close()
  } catch (e) {
    cdp && cdp.close()
    console.error('Exception caught:', e)
    process.exit(1)
  }
}
