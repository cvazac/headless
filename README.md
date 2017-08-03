# headless
sequentially inject script into websites using headless chrome

# install
```
git clone git@github.com:cvazac/headless.git
cd headless
npm i
node index.js ./example.js
```

# details
For each url in `urls.txt`, `headless` does the following:
* loads the page
* waits for the `onload` event
* waits another second, just for fun
* injects the Javascript found at the path you supplied
* echos all arguments passed to `log()` back to the console 
