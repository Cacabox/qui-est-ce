export const CLIENTID = "gvmbg22kqruvfibmxm4dm5datn9yis";

export const api = async (token: string, path: string) => {
    const request = await fetch(`https://api.twitch.tv/helix/${ path }`, {
        headers: {
            "Authorization" : `Bearer ${ token }`,
            "Client-Id"     : CLIENTID,
        }
    });

    if (request.status < 200 || request.status > 299) {
        throw new Error();
    }

    return request.json();
}
