
import {Socket, RemoteInfo, SocketOptions} from './Socket'

/**
 * Creates a Socket object of the specified type.
 *
 * @param type     The type argument can be either udp4 or udp6.
 * @param callback An optional callback function can be passed which is added as
 *                 a listener for 'message' events.
 */
function createSocket(type: string, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket

/**
 * Creates a dgram.Socket object. Once the socket is created, calling
 * socket.bind() will instruct the socket to begin listening for datagram
 * messages. When address and port are not passed to socket.bind() the method
 * will bind the socket to the "all interfaces" address on a random port (it
 * does the right thing for both udp4 and udp6 sockets). The bound address and
 * port can be retrieved using socket.address().address and
 * socket.address().port.
 *
 * @param options.type      either udp4 or udp6
 * @param options.reuseAddr When reuseAddr is true socket.bind() will reuse the
 *                          address, even if anotherprocess has already bound a
 *                          socket on it. reuseAddr defaults to false.
 * @param callback          An optional callback function can be passed
 *                          specified which is added as a listener for 'message'
 *                          events.
 */
function createSocket(options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket

function createSocket(typeOrOptions: string | SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket {
  let type: 'udp4' | 'udp6', reuseAddr: boolean = false

  if (typeof typeOrOptions === 'string') {
    type = typeOrOptions === 'udp6' ? 'udp6' : 'udp4'
  } else {
    type = typeOrOptions.type === 'udp6' ? 'udp6' : 'udp4'
    reuseAddr = typeOrOptions.reuseAddr || false
  }

  if (callback) {
    this.addListener('message', callback)
  }

  let socket = new Socket(type, reuseAddr)
  return socket
}

export default {
  createSocket,
  Socket
}