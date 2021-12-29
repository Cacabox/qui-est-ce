import { selectorFamily, SerializableParam } from "recoil";

import { getTwitchToken } from "@helpers/token";

export const CLIENTID = "9c0mrfyuyvw3ylkw3qumrtueb50eu9";

type TwitchApiParam = SerializableParam & {
    path: string,
}

export interface TwitchApiUser {
    data: {
        id                : string,
        display_name      : string,
        profile_image_url : string,
    }[],
}

export const twitchApi = selectorFamily<any, TwitchApiParam>({
    key: "twitchApi",
    get: (param) => async({ get }) => {
        const token = get(getTwitchToken);

        const { path } = param;

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
});
