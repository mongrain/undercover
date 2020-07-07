// bot.ts
import { Contact, Wechaty } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import { token, name } from '../config/config'

import onScan from './handler/on-scan'
import onMessage from './handler/on-message'
import onFriendship from './handler/on-friendship'
import onRoomInvite from './handler/on-room-invite'
import onRoomJoin from './handler/on-room-join'
import onRoomLeave from './handler/on-room-leave'

const puppet = new PuppetPadplus({
  token,
})

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
  .on('scan', onScan)
  .on('login', (user: Contact) => console.log(`login success, user: ${user}`))
  .on('friendship', onFriendship)
  .on('room-invite', onRoomInvite)
  .on('room-join', onRoomJoin)
  .on('room-leave', onRoomLeave)
  .on('message', onMessage)
  .on('logout', (user: Contact, reason: string) => {
    console.log(`logout user: ${user}, reason : ${reason}`)
  })
  .start()

