const DB_NAME = 'operations_manuales_cache'
const DB_VERSION = 1
const STORE_NAME = 'pdf_documents'

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return reject(new Error('IndexedDB no está disponible en este entorno.'))
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = event => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export const pdfCache = {
    /**
     * Obtiene el Blob del PDF guardado en IndexedDB.
     */
    async get(key: string): Promise<Blob | null> {
        if (typeof window === 'undefined' || !window.indexedDB) return null
        try {
            const db = await openDB()
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly')
                const store = tx.objectStore(STORE_NAME)
                const request = store.get(key)

                request.onsuccess = () => {
                    const result = request.result
                    if (result instanceof Blob) {
                        resolve(result)
                    } else if (result instanceof ArrayBuffer) {
                        resolve(new Blob([result], { type: 'application/pdf' }))
                    } else {
                        resolve(null)
                    }
                }

                request.onerror = () => {
                    console.warn('Error leyendo de IndexedDB:', request.error)
                    resolve(null)
                }
            })
        } catch (error) {
            console.warn('Error accediendo a IndexedDB:', error)
            return null
        }
    },

    /**
     * Guarda el Blob del PDF en IndexedDB de forma persistente.
     */
    async set(key: string, blob: Blob): Promise<void> {
        if (typeof window === 'undefined' || !window.indexedDB) return
        try {
            const db = await openDB()
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite')
                const store = tx.objectStore(STORE_NAME)
                const request = store.put(blob, key)

                request.onsuccess = () => resolve()
                request.onerror = () => {
                    console.warn('Error escribiendo en IndexedDB:', request.error)
                    resolve()
                }
            })
        } catch (error) {
            console.warn('Error guardando en IndexedDB:', error)
        }
    },

    /**
     * Elimina un manual específico de la base de datos local.
     */
    async delete(key: string): Promise<boolean> {
        if (typeof window === 'undefined' || !window.indexedDB) return false
        try {
            const db = await openDB()
            return new Promise(resolve => {
                const tx = db.transaction(STORE_NAME, 'readwrite')
                const store = tx.objectStore(STORE_NAME)
                const request = store.delete(key)

                request.onsuccess = () => resolve(true)
                request.onerror = () => resolve(false)
            })
        } catch (error) {
            console.warn('Error eliminando de IndexedDB:', error)
            return false
        }
    },

    /**
     * Limpia todos los manuales de la base de datos local.
     */
    async clearAll(): Promise<void> {
        if (typeof window === 'undefined' || !window.indexedDB) return
        try {
            const db = await openDB()
            return new Promise(resolve => {
                const tx = db.transaction(STORE_NAME, 'readwrite')
                const store = tx.objectStore(STORE_NAME)
                const request = store.clear()

                request.onsuccess = () => resolve()
                request.onerror = () => resolve()
            })
        } catch (error) {
            console.warn('Error limpiando IndexedDB:', error)
        }
    },
}
