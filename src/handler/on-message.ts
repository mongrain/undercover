import {Contact, Message} from 'wechaty'
import { log } from 'wechaty-puppet'

import myCache from '../lib/node-cache'
import undercoverService from '../services/undercover'
import { GAME_CONFIGURATION, GAME_RESTART } from '../const'

const INIT_UNDERCOVER_ROOM = '谁是卧底'
const RESET_UNDERCOVER_ROOM = '重新配置'
const RESTART_UNDERCOVER_ROOM = '继续游戏'

export default async (msg: Message) => {
    if (msg.room()) {
        log.info(`group :`, msg)

        const room = await msg.room()
        const roomTopic = await room.topic()
        const text = msg.text()

        if (INIT_UNDERCOVER_ROOM) {
            await room.say('游戏初始化为 谁是卧底')
        }

        if (text === RESET_UNDERCOVER_ROOM) {
            await room.say('请输入配置， 如：4 2 1则代表 4个平民 2个卧底 1个白板\r\n如果不需要白板则填写4 2即可')
            myCache.set(roomTopic, GAME_CONFIGURATION)
            return
        }

        if (text === RESTART_UNDERCOVER_ROOM) {
            myCache.set(roomTopic, GAME_RESTART)
        }

        if (myCache.get(roomTopic)) {
            // TODO: 目前只有谁是卧底 其他桌游以后再加
            await undercoverService(msg)
        }

    } else {
        log.info(`msg :`, msg)
    }
}