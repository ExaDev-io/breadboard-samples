 Here are the outlines and code samples for each blog post in markdown format:

## Blog 1 - Scheduler origin trial

Discussed topics:

- The problem with current yielding strategies
  - Yielding with `setTimeout` sends remaining work to the back of the task queue
- Introduction to `scheduler.yield`
  - Returns a Promise when called so you can `await` it
  - Sends remaining work to the front of the queue by default

```js
// Yield with scheduler.yield
async function yieldy() {
  await scheduler.yield(); 
}
```

## Blog 2 - Automatic picture-in-picture

Discussed topics:

- Allowing web apps to automatically enter PiP
  - Must be capturing camera/mic via getUserMedia
  - User must allow "automatic PiP" setting
- Using the "enterpictureinpicture" media session action

```js
// Request camera access
navigator.mediaDevices.getUserMedia({video: true}); 

// Register action handler
navigator.mediaSession.setActionHandler("enterpictureinpicture", () => {
  video.requestPictureInPicture();
});
```

## Blog 3 - Third-party cookie deprecation trial

Discussed topics:

- Chrome's plan to deprecate third-party cookies
- Offering a deprecation trial for non-advertising use cases
- Providing a token to temporarily re-enable third-party cookies
- Grace period for implementing tokens

```js
// Inject token via JavaScript 
const otMeta = document.createElement('meta');
otMeta.httpEquiv = 'origin-trial';
otMeta.content = 'TOKEN'; 
document.head.append(otMeta);
```