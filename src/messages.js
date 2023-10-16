import Dexie from 'dexie'

const db = new Dexie('message')

db.version(1).stores({
    messages: '++id, name, content'
})

export const addMessage = async (name, content) => {
    const id = await db.messages.add({name: name, content: content})
    const data = { id: id, name: name, content: content}
    new BroadcastChannel('chat-data').postMessage(data)
}

export const getMessages = async(id = null) => {
    if(id === null) {
        return db.messages
            .orderBy("id").reverse()
            .limit(25)
            .toArray()
    } else {
        // Ref: https://dexie.org/docs/Collection/Collection.offset()#paged-or-queries
        return db.messages
            .orderBy("id").reverse()
            .filter(x => x.id < id)
            .limit(25)
            .toArray()
    }
}