import { atom } from "recoil";

const allowedHashKey = ["access_token", "room"];

export const getHashParams = atom({
    key              : "getHashParams",
    default          : new Map<string,  string>(),
    effects_UNSTABLE : [({ setSelf }) => {
        const listener = () => {
            if (window.location.hash.length) {
                const hash = window.location.hash.slice(1);

                const hashMap = new Map<string, string>();

                hash.split("&").map((args) => {
                    const key   = args.split("=")[0];
                    const value = args.split("=")[1];

                    if (allowedHashKey.includes(key)) {
                        hashMap.set(key, value);
                    }
                });

                setSelf(hashMap);

                history.pushState("", document.title, window.location.origin);
            }
        }

        window.addEventListener("hashchange", listener, false);

        listener();

        return () => window.removeEventListener("hashchange", listener, false);
    }],
});
