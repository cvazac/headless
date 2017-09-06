const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')
const fs = require('fs')
const readline = require('readline')

if (process.argv.length < 4) {
  console.error(`Usage: 

single url:
node index.js ./path/to/script.js http://www.example.com

url list:
node index.js ./path/to/script.js ./path/to/urls.list`)
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
  async function loadUrl(url) {
    console.info(`navigating to ${url} ...`)
    await Page.navigate({url})

    await Page.loadEventFired()

    const out = await (async function() {
      return await Runtime.evaluate({
        expression,
        awaitPromise: true
      })
    })()
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

  const {Page, Runtime} = cdp
  await Promise.all([Page.enable(), Runtime.enable()])

  const code = fs.readFileSync(process.argv[2]).toString()
  const expression = `(function() {
    var out = [];
    function log() { out.push(Array.prototype.slice.call(arguments)) };

    var result = ${code};
    return new Promise(function(fulfill) {
      function done() {
        return fulfill(JSON.stringify(out))
      }
      result && result.constructor && result.constructor.name === 'Promise' ? result.then(done) : done()
    })
  })()`

  const urlArg = process.argv[3]
  try {
    if (urlArg.startsWith('http')) {
      await loadUrl(urlArg)
    } else {
      const urls = fs.readFileSync(urlArg).toString().split('\n')
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        if (url && !url.startsWith('#')) {
          await loadUrl(url)
        }
      }
    }

    teardown()
    process.exit(0)
  } catch (e) {
    console.error('Exception caught:', e)
    teardown()
    process.exit(1)
  }

})()
