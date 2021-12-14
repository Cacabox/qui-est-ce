import { atom, selector } from "recoil";

const TOKENKEY = "twitch-token";

type Token = string;

const tokenAtom = atom<Token>({
    key: "tokenAtom",
    default: window.localStorage.getItem(TOKENKEY) || "",
});

export const getToken = selector<Token>({
    key: "getToken",
    get: ({ get }) => (get(tokenAtom)),
    set: ({ set }, newValue) => {
        if (typeof newValue !== "string") {
            window.localStorage.removeItem(TOKENKEY);

            return set(
                tokenAtom,
                "",
            );
        }

        window.localStorage.setItem(TOKENKEY, newValue);

        return set(
            tokenAtom,
            newValue,
        );
    }
});
