import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// https://vite-pwa-org.netlify.app/guide/service-worker-without-pwa-capabilities.html#registering-of-the-service-worker-in-your-app

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register(
// 		import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw'
// 	);
// }

// If you're using import statements inside your service worker (will work only on chromium based browsers) check injectManifest section for more info

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(
		import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw',
		{ type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
