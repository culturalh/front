import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = reactive({
        id: null,
        username: '',
        role: '',
        token: ''
    })

    const login = (data) => {
        Object.assign(userInfo, data)
        localStorage.setItem('user_info', JSON.stringify(data))
    }

    const logout = () => {
        Object.assign(userInfo, { id: null, username: '', role: '', token: '' })
        localStorage.removeItem('user_info')
    }

    const initFromStorage = () => {
        const stored = localStorage.getItem('user_info')
        if (stored) {
            Object.assign(userInfo, JSON.parse(stored))
        }
    }

    return { userInfo, login, logout, initFromStorage }
})