 Here is Markdown formatted code for yielding to the main thread using scheduler.yield:

```js
// Check if scheduler.yield is supported
if ('scheduler' in window && 'yield' in scheduler) {

  // Define async function
  async function doWork() {

    // Do some work
    console.log('Work 1');
    
    // Yield to main thread
    await scheduler.yield(); 

    // Do more work 
    console.log('Work 2');

  }

  // Call function
  doWork();

} else {

  // Fallback for browsers without scheduler.yield
  function doWork() {

    // Do some work
    console.log('Work 1');
    
    // Yield using setTimeout 
    setTimeout(() => {

      // Do more work
      console.log('Work 2');

    }, 0);

  }

  // Call function
  doWork();

}
```

This checks if scheduler.yield is supported, and if so, uses it to yield in an async function. If not, it falls back to using setTimeout.