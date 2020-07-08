import {Contact, Message} from 'wechaty'
import myCache from '../lib/node-cache'
import { GAME_CONFIGURATION, GAME_PLAYING, GAME_RESTART, MY_BOT } from '../const'
import Undercover from '../game/undercover'

// undercover service
export default async (msg: Message) => {
    const room = msg.room()
    const text = msg.text()
    const roomTopic = await room.topic()
    const ROOM_DASHBOARD = `${roomTopic}-dashboard`

    if (myCache.get(roomTopic) === GAME_CONFIGURATION) {
        const numbers = text.trim().split(' ').slice(0, 3)
        const pass = numbers.some(num => isNaN(+num))

        if (pass) {
            await room.say('配置错误，请重新录入')
            return
        }

        const [playerNum = 0, undercoverNum = 0, emptyNum = 0] = numbers.map(str => parseInt(str))
        await play(playerNum, undercoverNum, emptyNum)
    }

    if (myCache.get(roomTopic) === GAME_RESTART) {
        const roomDashboard: any = myCache.get(ROOM_DASHBOARD)
        const { cards } = roomDashboard
        let playerNum = 0
        let undercoverNum = 0
        let emptyNum = 0
        for (const card of cards) {
            if (card.identity === '平民') {
                playerNum++
            } else if(card.identity === '卧底') {
                undercoverNum++
            } else if(card.identity === '白板') {
                emptyNum++
            }
        }
        return await play(playerNum, undercoverNum, emptyNum)
    }

    if (myCache.get(roomTopic) === GAME_PLAYING && room.owner()) {
        const mentionList = await msg.mentionList()
        const roomDashboard: any = myCache.get(ROOM_DASHBOARD)
        const user: Contact = myCache.get(MY_BOT)

        for (const mention of mentionList) {
            if (mention.id === user.id) {
                await room.say('我不在游戏列表之中噢.')
                continue
            }
            Undercover.vote(mention.id, roomDashboard)
            const result = await Undercover.checkGameOver(roomDashboard)
            await notifyRoomMember(result);
        }
        myCache.set(ROOM_DASHBOARD, roomDashboard);
    }

    // 群员可以投房主
    if (myCache.get(roomTopic) === GAME_PLAYING && !room.owner()) {
        const mentionList = await msg.mentionList()
        const roomDashboard: any = myCache.get(ROOM_DASHBOARD)

        for (const mention of mentionList) {
            if (mention.id === room.owner().id) {
                Undercover.vote(mention.id, roomDashboard)
                const result = await Undercover.checkGameOver(roomDashboard)
                await notifyRoomMember(result);
                break;
            }
        }
        myCache.set(ROOM_DASHBOARD, roomDashboard);
    }

    async function notifyRoomMember(result) {
        const roomDashboard: any = myCache.get(ROOM_DASHBOARD)
        const { cards } = roomDashboard

        const uc = cards.filter(item => item.identity === '卧底').map(item => item.username).join('、')
        const empty = cards.filter(item => item.identity === '白板').map(item => item.username).join('、')

        if (roomDashboard.gameover) {
           return
        }

        if (result === -1) {
            return await room.say(`游戏未结束，请继续发言`)
        }

        if (result === 0) {
            return await room.say(`游戏结束，平民胜利，本次卧底是 ${uc} ${empty ? `本局白板是 ${empty}` : ''}`)
        }

        if (result === 1) {
            return await room.say(`游戏结束，卧底胜利，本次卧底是 ${uc} ${empty ? `本局白板是 ${empty}` : ''}`)
        }
    }

    async function play (playerNum, undercoverNum, emptyNum) {
        const total = playerNum + undercoverNum + emptyNum
        const members = await room.memberAll()
        const membersNum = members.length - 1  // 机器人除外

        if (total > membersNum) {
            await room.say(`玩家数量不足，目前玩家数量${membersNum}人 如果需要重新配置，则回复重新配置`)
            return
        }

        const cards = Undercover.dispatch(playerNum, undercoverNum, emptyNum)
        const user: Contact = myCache.get(MY_BOT)
        const realPlayers = members.filter(member => member.id !== user.id)

        for (const [idx, member] of realPlayers.entries()) {
            const card = cards[idx]
            card.id = member.id
            card.username = member.name()
            await member.say(`你的获得的词串是${card.content}`)
        }

        const roomDashboard = {
            gameover: false,
            cards,
            existUc: undercoverNum,
            existEmpty: emptyNum,
            existPlayer: total
        }

        myCache.set(roomTopic, GAME_PLAYING)
        myCache.set(ROOM_DASHBOARD, roomDashboard)
        await room.say('对局正式开始. 房主@人进行投票 群里任意人员可投房主')
    }
}
