import {EventEmitter} from 'events'
import * as bowser from 'bowser'

enum UDPBrowserTypes {
  ChromeSocketUDP,
  ChromeSocketsUDP,
  FirefoxUDP
}
declare const chrome : any;
declare const navigator : any;

let browserUDP: UDPBrowserTypes | false = false

if (bowser.chrome) {
  if (chrome.sockets.tcp) {
    browserUDP = UDPBrowserTypes.ChromeSocketsUDP
  } else if (chrome.socket) {
    browserUDP = UDPBrowserTypes.ChromeSocketUDP
  }
}

if (bowser.firefox) {
  if (navigator.mozUDPSocket) {
    browserUDP = UDPBrowserTypes.FirefoxUDP
  }
}

class NotInThisBrowserError extends Error {
  constructor (message?: string, inner_error?: Error) {
    message = `Method not implemented in this browser: ${message ? message : ""}`
    super(message)
  }
}

export interface RemoteInfo {
  address: string
  family: string
  port: number
}

export interface AddressInfo {
  address: string
  family: string
  port: number
}

export interface BindOptions {
  port: number
  address?: string
  exclusive?: boolean
}

export interface SocketOptions {
  type: 'udp4' | 'udp6'
  reuseAddr?: boolean
}

/**
 * @since Chrome 33
 */
export class Socket extends EventEmitter {
  private _chromeSocketId: number | null = null
  private _firefoxSocket: navigator.UDPSocket | null = null

  private _addressInfo: AddressInfo | null = null

  /**
   * Note that in Node's `dgram`, you're not supposed to ever do
   * `new dgram.Socket()` (presumably for legacy compatibility reasons). Here
   * we have no problem including a constructor.
   */
  constructor (type: 'udp4' | 'udp6', reuseAddr: boolean = false) {
    super()

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      this._onReceiveChrome = this._onReceiveChrome.bind(this)
      this._onReceiveErrorChrome = this._onReceiveErrorChrome.bind(this)

      chrome.sockets.udp.onReceive.addListener(this._onReceiveChrome)
      chrome.sockets.udp.onReceiveError.addListener(this._onReceiveErrorChrome)

      chrome.sockets.udp.create({}, (createInfo: chrome.sockets.udp.CreateInfo) => {
        this._chromeSocketId = createInfo.socketId
      })
    }
  }

  private _onReceiveChrome(info: {socketId: number, data: ArrayBuffer, remoteAddress: string, remotePort: number}) {
    if (info.socketId === this._chromeSocketId) {
      this.emit('message', Buffer.from(info.data), {address: info.remoteAddress, port: info.remotePort})
    }
  }

  private _onReceiveErrorChrome(info: {socketId: number, resultCode: number}) {
    if (info.socketId === this._chromeSocketId) {
      this.emit('error', new Error(`Bad socket result code: ${info.resultCode}`))
    }
  }

  send (msg: Buffer | string | Buffer[] | string[],
        port: number,
        address: string,
        callback?: (errorOrBytes: Error | number) => void): void
  send (msg: Buffer,
        offset: number,
        length: number,
        port: number,
        address: string,
        callback?: (errorOrBytes: Error | number) => void): void
  send (msg: Buffer | string | Buffer[] | string[],
        portOrOffset: number,
        addressOrLength: string | number,
        callbackOrPort?: Function | number,
        address: string = 'localhost',
        callback?: (errorOrBytes: Error | number) => void): void {
    let length: number | null = null
    let offset: number = 0
    let port: number = 0

    if (typeof addressOrLength === 'string') {
      port = portOrOffset
      address = addressOrLength
      callback = callbackOrPort as (errorOrBytes: Error | number) => void
    } else {
      offset = portOrOffset
      length = addressOrLength
      port = callbackOrPort as number
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) {
        throw new Error('Socket not created')
      }

      if (!this._addressInfo) {
        this._addressInfo = {address: '0.0.0.0', 'port': 0, 'family': 'udp4'}
        this.bind(this._addressInfo.port, this._addressInfo.address)
      }

      if (Array.isArray(msg) && msg.length === 0) {
        throw new Error('Array argument must have at least one item')
      }

      if (Array.isArray(msg)) {
        if (typeof msg[0] === 'string') {
          msg = (msg as string[]).reduce((accumulator: string, item: string): string => {
            return accumulator += item
          }, '')
        } else {
          msg = Buffer.concat(msg as Buffer[])
        }
      }

      if (typeof msg === 'string') {
        msg = Buffer.from(msg)
      }

      if (length) {
        msg = msg.slice(offset, length)
      }

      chrome.sockets.udp.send(
        this._chromeSocketId,
        msg.buffer,
        this._addressInfo.address,
        this._addressInfo.port,
        (sendInfo) => {
          if (sendInfo.resultCode < 0) {
            let error = new Error(`Bad network result code: ${sendInfo.resultCode}`)
            if (callback) {
              callback(error as Error)
            } else {
              this.emit('error', error)
            }
          }

          if (callback) {
            callback(sendInfo.bytesSent as number)
          }
        }
      )
      return
    }

    throw new Error('No available ways to send.')
  }

  /**
   * For UDP sockets, causes the dgram.Socket to listen for datagram messages on
   * a named port and optional address. If port is not specified, the operating
   * system will attempt to bind to a random port. If address is not specified,
   * the operating system will attempt to listen on all addresses. Once binding
   * is complete, a 'listening' event is emitted and the optional callback
   * function is called.
   *
   * Note that specifying both a 'listening' event listener and passing a
   * callback to the socket.bind() method is not harmful but not very useful.
   *
   * A bound datagram socket keeps the Node.js process running to receive
   * datagram messages.
   *
   * If binding fails, an 'error' event is generated. In rare case (e.g.
   * attempting to bind with a closed socket), an Error may be thrown.
   *
   * @param portOrOptions.exclusive The options object may contain an additional
   *                                exclusive property that is use when using
   *                                dgram.Socket objects with the cluster
   *                                module. When exclusive is set to false (the
   *                                default), cluster workers will use the same
   *                                underlying socket handle allowing connection
   *                                handling duties to be shared. When exclusive
   *                                is true, however, the handle is not shared
   *                                and attempted port sharing results in an
   *                                error.
   */
  bind (port?: number,
        address?: string,
        callback?: () => void): void
  bind (options: BindOptions,
        callback?: Function): void
  bind (portOrOptions?: number | BindOptions,
        addressOrCallback?: string | Function,
        callback?: () => void): void {
    let address: string
    let port: number
    let exclusive: boolean

    if (typeof portOrOptions === 'object') {
      port = portOrOptions.port
      address = portOrOptions.address || '0.0.0.0'
      exclusive = portOrOptions.exclusive || false
      callback = addressOrCallback as () => void
    } else {
      port = portOrOptions || 0
      address = addressOrCallback as string || '0.0.0.0'
    }

    this._addressInfo = {
      address,
      port,
      family: 'udp4'
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) {
        throw new Error('Socket not created')
      }

      chrome.sockets.udp.bind(
        this._chromeSocketId,
        address,
        port,
        (result: number) => {
          if (result < 0) {
            this.emit('error', new Error(`Bad network result code: ${result}`))
          } else {
            if (callback) {
              callback()
            }
            this.emit('listening')
          }
        }
      )
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Close the underlying socket and stop listening for data on it. If a
   * callback is provided, it is added as a listener for the 'close' event.
   */
  close (callback?: () => void): void {
    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) {
        throw new Error('Socket not created')
      }

      chrome.sockets.udp.close(this._chromeSocketId, () => {
        if (callback) {
          this.addListener('close', callback)
        }
        this.emit('close')
      })
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Returns an object containing the address information for a socket. For UDP
   * sockets, this object will contain address, family and port properties.
   */
  address (): AddressInfo {
    if (!this._addressInfo) {
      throw new Error('No address info is available')
    }

    return this._addressInfo as AddressInfo
  }

  /**
   * When set to true, UDP packets may be sent to a local interface's broadcast
   * address.
   *
   * @since Chrome 44
   */
  setBroadcast (flag: boolean): void {
    if (!flag) {
      throw new Error('setBroadcast requires an argument')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')
      chrome.sockets.udp.setBroadcast(this._chromeSocketId, flag)
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Sets the IP_TTL socket option. While TTL generally stands for "Time to
   * Live", in this context it specifies the number of IP hops that a packet is
   * allowed to travel through. Each router or gateway that forwards a packet
   * decrements the TTL. If the TTL is decremented to 0 by a router, it will not
   * be forwarded. Changing TTL values is typically done for network probes or
   * when multicasting.
   *
   * @param ttl A number of hops between 1 and 255. The default on most systems
   * is 64 but can vary.
   */
  setTTL (ttl: number): void {
    if (!ttl) {
      throw new Error('setTTL requires an argument')
    }

    if (ttl < 1 || ttl > 255) {
      throw new Error('ttl for setTTL should be between 1 and 255.')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')
      throw new Error('Method not implemented in Chrome.')
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Sets the IP_MULTICAST_TTL socket option. While TTL generally stands for
   * "Time to Live", in this context it specifies the number of IP hops that a
   * packet is allowed to travel through, specifically for multicast traffic.
   * Each router or gateway that forwards a packet decrements the TTL. If the
   * TTL is decremented to 0 by a router, it will not be forwarded.
   *
   * The argument passed to to socket.setMulticastTTL() is a number of hops
   * between 0 and 255. The default on most systems is 1 but can vary.
   */
  setMulticastTTL (ttl: number): void {
    if (!ttl) {
      throw new Error('setMulticastTTL requires an argument')
    }

    if (!ttl || ttl < 1 || ttl > 255) {
      throw new Error('ttl for setTTL should be between 1 and 255.')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')
      chrome.sockets.udp.setMulticastTimeToLive(this._chromeSocketId, ttl, result => {
        if (result < 0) {
          this.emit('error', new Error('Bad network result code:' + result))
        }
      })
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Sets or clears the IP_MULTICAST_LOOP socket option. When set to true,
   * multicast packets will also be received on the local interface.
   */
  setMulticastLoopback (flag: boolean): void {
    if (!flag) {
      throw new Error('setMulticastLoopback requires an argument')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')

      /**
       * Note: the behavior of setMulticastLoopbackMode is slightly different
       * between Windows and Unix-like systems. The inconsistency happens only
       * when there is more than one application on the same host joined to the
       * same multicast group while having different settings on multicast
       * loopback mode. On Windows, the applications with loopback off will not
       * RECEIVE the loopback packets; while on Unix-like systems, the
       * applications with loopback off will not SEND the loopback packets to
       * other applications on the same host. See MSDN: http://goo.gl/6vqbj
       */
      chrome.sockets.udp.setMulticastLoopbackMode(this._chromeSocketId, flag, () => {})
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Join a multicast group.
   *
   * @param multicastInterface Included for interface compatibility, but does
   *                           nothing.
   */
  addMembership (multicastAddress: string, multicastInterface?: string): void {
    if (!multicastAddress) {
      throw new Error('An address must be provided')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')
      chrome.sockets.udp.joinGroup(this._chromeSocketId, multicastAddress, result => {
        if (result < 0) {
          this.emit('error', new Error('Bad network result code:' + result))
        }
      })
      return
    }

    throw new NotInThisBrowserError()
  }

  /**
   * Leave a multicast group. This happens automatically when the socket is
   * closed, so it's only needed when reusing sockets.
   *
   * @param multicastInterface Included for interface compatibility, but does
   *                           nothing.
   */
  dropMembership (multicastAddress: string, multicastInterface?: string): void {
    if (!multicastAddress) {
      throw new Error('An address must be provided')
    }

    if (browserUDP === UDPBrowserTypes.FirefoxUDP) {
      throw new Error('Method not implemented in Firefox.')
    }

    if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
      if (!this._chromeSocketId) throw new Error('Socket not created')
      chrome.sockets.udp.leaveGroup(this._chromeSocketId, multicastAddress, result => {
        if (result < 0) {
          this.emit('error', new Error('Bad network result code:' + result))
        }
      })
      return
    }

    throw new NotInThisBrowserError()
  }

  ref(): this {
    throw new Error('Method not implemented in this browser')
  }

  unref(): this {
    throw new Error('Method not implemented in this browser')
  }

  //////////////////////////////////////////////////////////////////////////////
  // Events and listeners
  //////////////////////////////////////////////////////////////////////////////

  addListener(event: string, listener: Function): this
  addListener(event: 'close', listener: () => void): this
  addListener(event: 'error', listener: (err: Error) => void): this
  addListener(event: 'listening', listener: () => void): this
  addListener(event: 'message', listener: (msg: string, rinfo: AddressInfo) => void): this
  addListener(event: string, listener: Function): this {
    return super.addListener(event, listener)
  }

  emit(event: string, ...args: any[]): boolean
  emit(event: 'close'): boolean
  emit(event: 'error', err: Error): boolean
  emit(event: 'listening'): boolean
  emit(event: 'message', msg: string, rinfo: AddressInfo): boolean
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, args)
  }

  on(event: string, listener: Function): this
  on(event: 'close', listener: () => void): this
  on(event: 'error', listener: (err: Error) => void): this
  on(event: 'listening', listener: () => void): this
  on(event: 'message', listener: (msg: string, rinfo: AddressInfo) => void): this
  on(event: string, listener: Function): this {
    return super.on(event, listener)
  }

  once(event: string, listener: Function): this
  once(event: 'close', listener: () => void): this
  once(event: 'error', listener: (err: Error) => void): this
  once(event: 'listening', listener: () => void): this
  once(event: 'message', listener: (msg: string, rinfo: AddressInfo) => void): this
  once(event: string, listener: Function): this {
    return super.once(event, listener)
  }

  prependListener(event: string, listener: Function): this
  prependListener(event: 'close', listener: () => void): this
  prependListener(event: 'error', listener: (err: Error) => void): this
  prependListener(event: 'listening', listener: () => void): this
  prependListener(event: 'message', listener: (msg: string, rinfo: AddressInfo) => void): this
  prependListener(event: string, listener: Function): this {
    return super.prependListener(event, listener)
  }

  prependOnceListener(event: string, listener: Function): this
  prependOnceListener(event: 'close', listener: () => void): this
  prependOnceListener(event: 'error', listener: (err: Error) => void): this
  prependOnceListener(event: 'listening', listener: () => void): this
  prependOnceListener(event: 'message', listener: (msg: string, rinfo: AddressInfo) => void): this
  prependOnceListener(event: string, listener: Function): this {
    return super.prependOnceListener(event, listener)
  }
}