import { ReactNode } from 'react';
import "~/components/App.css";
import { BreadboardComponent } from "~/components/BreadboardComponent.tsx";

// const channel = new BroadcastChannel(SW_BROADCAST_CHANNEL);
// channel.onmessage = (e) => {
// 	console.debug(e.data);
// };
function App(): ReactNode {
	return <BreadboardComponent />;
}

export default App;
