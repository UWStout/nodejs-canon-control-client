// Import dexie for easy Index DB usage
import Dexie from 'dexie'

// Initialize the database
const db = new Dexie('c4-database')
db.version(1).stores({
  servers: '++id, IP',
  cameras: '++id, serverId'
})

export default db
