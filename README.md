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
Every time you call `log(...)` from your code, we collect all the arguments you pass in and log it back out to the node CLI using `console.info`.
