import fetch from 'node-fetch'

const LOGIN_URL = '/login'
const LEADERBOARD_URL = '/leaderboard'
const USER_COOKIE = 'user_sid'

export type sortType = "name"|"time"|"timestamp"

function createUrl(path: string, params: {[index: string]: any}) {
    const url = new URL(path, new URL(window.location.href).origin)
    // Add parameters to URL
    Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))

    return url
}

export async function getLeaderboard(sortBy: sortType = "time", descending = true) {
    const url = createUrl(LEADERBOARD_URL, {sort_by: sortBy, sort_descending: descending})

    return fetch(url, {
        method: "GET"
    }).then(async r => {
        if (r.ok) {
            return r.json()
        } else {
            throw Error(await r.text())
        }
    })
}

export async function getAllTimes(sortBy: sortType = "timestamp", descending = true, names?: string[]) {
    const url = createUrl(LEADERBOARD_URL, {
        sort_by: sortBy,
        sort_descending: descending,
        names: names?.join(''),
        only_highscore: false
    })

    return fetch(url, {
        method: "GET"
    }).then(async r => {
        if (r.ok) {
            return r.json()
        } else {
            throw Error(await r.text())
        }
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