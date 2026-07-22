import { ref, watch } from 'vue'

const STORAGE_KEY = 'starred_zones'
const starredIds = ref<string[]>([])

// 初始化：从 localStorage 读取
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            starredIds.value = JSON.parse(raw)
        }
    } catch {
        starredIds.value = []
    }
}

// 持久化：写入 localStorage（带 try/catch 防止非浏览器环境报错）
watch(starredIds, (val) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
        // ignore
    }
}, { deep: true })

loadFromStorage()

export function useStarredZones() {
    function toggleStar(zoneId: string) {
        if (starredIds.value.includes(zoneId)) {
            starredIds.value = starredIds.value.filter(id => id !== zoneId)
        } else {
            starredIds.value.push(zoneId)
        }
    }

    function isStarred(zoneId: string): boolean {
        return starredIds.value.includes(zoneId)
    }

    return {
        starredZoneIds: starredIds,
        toggleStar,
        isStarred,
    }
}
