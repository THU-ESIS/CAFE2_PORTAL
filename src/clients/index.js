import CafeClient from './CafeClient';
// 1. Import the named instance directly from RemoteTaskClient.js
import { remoteTaskClient } from './RemoteTaskClient';

const cafeClient = new CafeClient();

// 2. Export the existing cafeClient and the imported remoteTaskClient.
//    No need to create a new instance of RemoteTaskClient here.
export { cafeClient, remoteTaskClient };
