# headless
sequentially inject script into websites using headless chrome

# install
```
git clone git@github.com:cvazac/headless.git
cd headless
npm i
```

# usage

```
# run against a single url
node index.js ./scripts/example.js http://www.example.com

# run against a list of urls
node index.js ./scripts/example.js ./urls/alexa.us.txt
```

# details
For each url, `headless` does the following:
* loads the page
* waits for the `onload` event
* injects the Javascript found at the path you supplied
* echos all arguments passed to `log()` back to the console 

# async
If you want to inject asyncronous Javascript, define your script like:
```javascript
  new Promise(function(fulfill) {
    ...
    fulfill() // ... some time later
    ...
  })
```