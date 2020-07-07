import { Message } from 'wechaty'
import { log } from 'wechaty-puppet'

export default async (msg: Message) => {
    if (msg.room()) {
        log.info(`group :`, msg)

        // await msg.room().alias()
        // const members = await msg.room().memberAll();
        // console.log(members);
        // members.forEach(member => {
        //     member.say('你的身份是：' + member.name());
        // })
    } else {
        log.info(`msg :`, msg)
    }
}