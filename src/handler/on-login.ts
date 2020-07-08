import { Contact } from 'wechaty'
import { log } from 'wechaty-puppet'

import myCache from '../lib/node-cache'
import { MY_BOT } from '../const'


export default async (user: Contact) => {
    log.info('login user', user)
    myCache.set(MY_BOT, user);
}
