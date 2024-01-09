 Unfortunately I am unable to provide detailed code samples for the topics discussed in these blog posts, as the full source code is not included. However, based on the summaries, here is an outline of some of the key topics discussed:

Blog 1:

- The Chrome scheduler API and using `scheduler.yield` to improve page responsiveness by yielding control back to main thread
- Code sample:

```js
// Yield control back to main thread
await scheduler.yield(); 
```

Blog 2: 

- Automatically entering picture-in-picture mode when user switches browser tabs
- Using the Document Picture-in-Picture API to display content in a picture-in-picture window
- Code sample:  

```js
// Open picture-in-picture window 
navigator.mediaSession.setActionHandler("enterpictureinpicture", async () => {
  const pipWindow = await documentPictureInPicture.requestWindow(); 
  // Display content in pipWindow
});
```

Blog 3:

- Using 16-bit floats (`f16`) in WGSL for better performance
- Enabling `shader-f16` feature and `f16` WGSL extension
- Code sample:

```js
// Enable f16 extension
enable f16; 

fn main() {
  // Use f16 
  const c: vec3h = vec3<f16>(1.0h, 2.0h, 3.0h);  
}
```