import fetch from 'node-fetch'

const LOGIN_URL = '/login'
const LEADERBOARD_URL = '/leaderboard'
const USER_COOKIE = 'user_sid'

export async function getLeaderboard(sortBy: "name"|"time"|"timestamp" = "time", descending = true) {
    const url = new URL(LEADERBOARD_URL, new URL(window.location.href).origin)
    // Define URL parameters
    const params: any = {sort_by: sortBy, sort_descending: descending}
    // Add parameters to URL
    Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))

    return fetch(url, {
        method: "GET"
    }).then(r => {
        return r.json()
    })
}

export async function addTime(name: string, time: number, timestamp?: number) {
    const url = new URL(LEADERBOARD_URL, new URL(window.location.href).origin)
    const body = {name, time, timestamp}

    // TODO login alleen als nodig
    await login()

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
}

async function login() {
    const url = new URL(LOGIN_URL, new URL(window.location.href).origin)
    const body = {username: 'test', password: 'bier'}

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
}