import { watchEmits, watchRemote, watchRequests } from 'redux-saga-sc'

// the 'socketcluster-client' package throws an exception if WebSocket does not exist
 const socketCluster = global.WebSocket ? require('socketcluster-client') : false


let socket = socketCluster && socketCluster.connect({
                  secure:true,
                     autoReconnect: true,
                      path:'/socketCommunicate/sc/',
                         ackTimeout: 10000, // server should never take this long to ping back
                        })



    export default function *scsagas() {
   yield [watchRemote(socket), watchRequests(socket),watchEmits(socket)]
}

