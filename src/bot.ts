// bot.ts
import { Contact, Message, Wechaty } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import onScan from './handler/onScan'
import onMessage from './handler/onMessage'
import { token, name } from '../config/config.js'

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
  .on('message', onMessage)
  .on('logout', (user: Contact, reason: string) => {
    console.log(`logout user: ${user}, reason : ${reason}`)
  })
  .start()

