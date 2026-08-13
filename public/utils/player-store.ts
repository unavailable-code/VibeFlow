import { create } from "zustand"

export interface Song {
    id: string
    title: string
    image: string
    fileName: string
    duration?: number
    plainLyrics?: string | null
    syncedLyrics?: string | null
}

interface PlayerState {
    queue: Song[]
    currentIndex: number
    currentSong: Song | null
    isPlaying: boolean
    showLyrics: boolean
    showQueue: boolean

    togglePlay: () => void
    toggleLyrics: () => void
    toggleQueue: () => void

    setQueue: (songs: Song[], startIndex?: number) => void
    setCurrentSong: (song: Song) => void
    addToQueue: (song: Song) => void
    removeFromQueue: (index: number) => void
    clearQueue: () => void

    next: () => void
    prev: () => void
    pause: () => void
}

export const usePlayer = create<PlayerState>((set, get) => ({
    queue: [],
    currentIndex: 0,
    currentSong: null,
    isPlaying: false,
    showLyrics: false,
    showQueue: false,

    setQueue: (songs, startIndex = 0) =>
        set({
            queue: songs,
            currentIndex: startIndex,
            currentSong: songs[startIndex],
            isPlaying: true,
            showLyrics: false,
        }),

    setCurrentSong: (song) =>
        set((state) => {
            const idx = state.queue.findIndex((s) => s.id === song.id)
            if (idx !== -1) {
                return { currentSong: song, currentIndex: idx, isPlaying: true }
            }
            return {
                currentSong: song,
                queue: [song, ...state.queue],
                currentIndex: 0,
                isPlaying: true,
            }
        }),

    addToQueue: (song) =>
        set((state) => ({ queue: [...state.queue, song] })),

    removeFromQueue: (index) =>
        set((state) => {
            const newQueue = state.queue.filter((_, i) => i !== index)
            let newIndex = state.currentIndex
            if (index < state.currentIndex) newIndex = state.currentIndex - 1
            if (index === state.currentIndex) newIndex = Math.min(newIndex, newQueue.length - 1)
            return {
                queue: newQueue,
                currentIndex: newIndex,
                currentSong: newQueue[newIndex] ?? null,
            }
        }),

    clearQueue: () =>
        set({ queue: [], currentIndex: 0, currentSong: null, isPlaying: false }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    pause: () => set({ isPlaying: false }),
    toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics, showQueue: false })),
    toggleQueue: () => set((state) => ({ showQueue: !state.showQueue, showLyrics: false })),

    next: () => {
        const { queue, currentIndex } = get()
        if (queue.length === 0) return
        const nextIndex = (currentIndex + 1) % queue.length
        set({
            currentIndex: nextIndex,
            currentSong: queue[nextIndex],
            isPlaying: true,
        })
    },

    prev: () => {
        const { queue, currentIndex } = get()
        if (queue.length === 0) return
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length
        set({
            currentIndex: prevIndex,
            currentSong: queue[prevIndex],
            isPlaying: true,
        })
    },
}))
