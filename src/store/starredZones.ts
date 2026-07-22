import { defineStore } from "pinia";

interface StarredZonesState {
    starredZoneIds: string[];
}

function deserializeState(value: string): StarredZonesState {
    const parsed: unknown = JSON.parse(value);

    // 兼容之前直接存储在 starred_zones 中的字符串数组。
    if (Array.isArray(parsed)) {
        return {
            starredZoneIds: parsed.filter((id): id is string => typeof id === "string"),
        };
    }

    if (parsed && typeof parsed === "object" && "starredZoneIds" in parsed) {
        const starredZoneIds = (parsed as { starredZoneIds?: unknown }).starredZoneIds;
        if (Array.isArray(starredZoneIds)) {
            return {
                starredZoneIds: starredZoneIds.filter((id): id is string => typeof id === "string"),
            };
        }
    }

    return { starredZoneIds: [] };
}

export const useStarredZonesStore = defineStore("starredZones", {
    state: (): StarredZonesState => ({
        starredZoneIds: [],
    }),

    persist: {
        key: "starred_zones",
        serializer: {
            deserialize: deserializeState,
            serialize: JSON.stringify,
        },
    },

    actions: {
        toggleStar(zoneId: string) {
            const index = this.starredZoneIds.indexOf(zoneId);

            if (index === -1) {
                this.starredZoneIds.push(zoneId);
            } else {
                this.starredZoneIds.splice(index, 1);
            }
        },

        isStarred(zoneId: string): boolean {
            return this.starredZoneIds.includes(zoneId);
        },
    },
});
