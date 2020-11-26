import fetch from 'node-fetch'

const LOGIN_URL = '/login'
const LEADERBOARD_URL = '/leaderboard'
const USER_COOKIE = 'user_sid'

export async function getLeaderboard(sortBy: "name"|"time"|"timestamp" = "time", descending = true) {
    const url = new URL(LEADERBOARD_URL, new URL(window.location.href).origin)
    // Define URL parameters
    const params: any = {sort_by: sortBy}
    if (descending)
        params.sort_descending = true
    // Add parameters to URL
    Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))

    return fetch(url, {
        method: "GET"
    }).then(r => {
        return r.json()
    })
}