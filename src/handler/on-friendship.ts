import {
    log,
    Friendship,
    Wechaty,
} from 'wechaty'

export default async function onFriendship (
    this       : Wechaty,
    friendship : Friendship,
): Promise<void> {
    log.info('on-friendship', 'onFriendship(%s)', friendship)

    if (friendship.type() === this.Friendship.Type.Receive) {
        await friendship.accept();
    }

}