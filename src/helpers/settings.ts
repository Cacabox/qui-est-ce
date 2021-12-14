import { atom, selector } from "recoil";

interface Settings {
    clientId : string,
    locale   : string,
}

export const SETTINGSKEY = "settings";

const settingsAtom = atom({
    key: "settingsAtom",
    default: {
        // @ts-expect-error
        clientId : window.crypto.randomUUID(),
        locale   : "fr"
    },
});

export const getSettings = selector<Settings>({
    key: "getSettings",
    get: ({ get }) => {
        const defaultSettings = get(settingsAtom);
        const settings = window.localStorage.getItem(SETTINGSKEY);

        if (!settings) {
            window.localStorage.setItem(SETTINGSKEY, JSON.stringify(defaultSettings));

            return defaultSettings;
        }

        return {
            ...defaultSettings,
            ...JSON.parse(settings),
        }
    },
    set: ({ set }, newValue) => {
        window.localStorage.setItem(SETTINGSKEY, JSON.stringify(newValue));

        set(settingsAtom, newValue);
    }
});
