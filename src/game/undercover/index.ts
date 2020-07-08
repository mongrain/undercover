import WORDS from './database'
import { shuffle, random } from 'lodash'

const state = {
    players: [],
    activity: WORDS,
}
type stateAlias = typeof state

type cardAlias = {
    id: string,
    username: string,
    content: string,
    identity: string,
    out: boolean,
}

class Undercover {
    state: stateAlias = state

    getActivityWords() {
        const { activity } = this.state
        const idx = random(activity.length)
        return activity.splice(idx, 1)[0]
    }

    getLuckNumber(numbers): [number] {
        return shuffle(Array.from({length: numbers}).map((_, i) => i))
    }

    /**
     * 此方法会通过玩家数量，卧底数量，白板数量生成随机的词串返回
     * @param playerNum 玩家数量
     * @param undercoverNum 卧底数量
     * @param emptyNum 白板数量
     */
    dispatch(playerNum, undercoverNum, emptyNum): cardAlias[] {
        let cards = []
        let [word1, word2] = this.getActivityWords()
        const total = playerNum + undercoverNum + emptyNum
        const shuffles = this.getLuckNumber(playerNum)
        const undercoverIndexes = shuffles.slice(0, undercoverNum)
        const emptyIndexes = shuffles.slice(undercoverNum, undercoverNum + emptyNum)
        for (let i = 0; i < total; i++) {
            let card = {
                id: '', // 注入用户id
                username: '', // 注入用户姓名
                content: word1,
                identity: '平民',
                out: false,
            };
            if (undercoverIndexes.includes(i)) {
                card.content = word2
                card.identity = '卧底'
            }
            if (emptyIndexes.includes(i)) {
                card.content = ''
                card.identity = '白板'
            }
            cards.push(card)
        }
        return cards
    }

    vote(id, room) {
        let { gameover, cards, existUc, existEmpty, existPlayer } = room
        let card = cards.find(item => item.id === id)
        if (card.out) {
            return;
        }
        card.out = true;
        if (card.identity == "卧底") {
            existUc--
        } else if (card.identity == "白板") {
            existEmpty--
        }
        existPlayer--
        if (gameover) {
            return
        }
        return this.checkGameOver(room)
    }

    checkGameOver(room) {
        let { existUc, existEmpty, existPlayer } = room;
        let ret = -1 // 游戏结果 -1 正常游戏 0 平民胜利 1 卧底胜利
        if (existUc == 0 && existEmpty == 0) {
            room.gameover = true
            ret = 0 // 平民胜利
        } else if (existPlayer <= 3) {
            room.gameover = true
            ret = 1 // 卧底胜利
        }
        return ret
    }
}

export default new Undercover()
