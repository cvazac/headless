const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')
const timeout = require('delay')
const fs = require('fs')
const readline = require('readline')

if (process.argv.length < 3) {
  console.error('Usage: node index.js <path-to-js-code>')
  process.exit(1)
}

function launchChrome() {
  return chromeLauncher.launch({
    chromeFlags: [
      '--enable-experimental-web-platform-features',
      '--disable-gpu',
      '--headless',
    ],
  })
}

(async function() {
  const chrome = await launchChrome()
  let cdp = await CDP({
    port: chrome.port
  })
  function teardown() {
    cdp && cdp.close()
    chrome.kill()
  }

  try {
    const {Page, Runtime} = cdp
    await Promise.all([Page.enable(), Runtime.enable()])

    const code = fs.readFileSync(process.argv[2]).toString()
    const expression = `(function() {
      var out = []
      function log() { out.push(Array.prototype.slice.call(arguments)) }
      ;${code};
      return JSON.stringify(out)
    })()`

    const urls = fs.readFileSync(process.argv[3] || './urls/alexa.us.txt').toString().split('\n')
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      if (!url || url.indexOf('#') === 0) continue

      console.info(`navigating to ${url} ...`)
      await Page.navigate({url})

      await Page.loadEventFired()

      await timeout(1000)

      const out = await Runtime.evaluate({expression})
      if (out && out.result) {
        if (out.result.subtype === "error") {
          console.error(out.result.description)
        } else {
          JSON.parse(out.result.value).forEach(function (args) {
            console.info.apply(console, args)
          })
          console.info() //creates newline in output
        }
      }
    }

    teardown()
  } catch (e) {
    console.error('Exception caught:', e)
    teardown()
    process.exit(1)
  }
})()
