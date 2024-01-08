 Here is Markdown formatted code for achieving the discussed topic based on the summary:

```js
// Check if scheduler.yield is supported
if ('scheduler' in window && 'yield' in scheduler) {

  // Define an async function
  async function doWork() {

    // Do some work
    console.log('Doing some work...');

    // Yield control back to main thread
    await scheduler.yield();

    // Do some more work
    console.log('Doing some more work...');

  }

  // Call the function
  doWork();

} else {

  // Fallback for browsers that don't support scheduler.yield
  function doWork() {

    // Do some work
    console.log('Doing some work...');

    setTimeout(() => {

      // Do some more work
      console.log('Doing some more work...');

    }, 0);

  }

  // Call the fallback function
  doWork();

}
```

This checks if `scheduler.yield` is supported, and if so calls an async function that yields with it. If not, it falls back to using `setTimeout` to yield instead.