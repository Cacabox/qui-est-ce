import { atomFamily } from "recoil";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get as getInDb, getDatabase, onValue, ref, remove, update } from "firebase/database";

const config = require(`../../${ process.env.CONFIG_FILE }`);

export const apolloClient = new ApolloClient({
    uri   : config.apollo.url,
    cache : new InMemoryCache(),
});

export const firebaseClient = initializeApp(config.firebase);

export const analyticsClient = getAnalytics(firebaseClient);

export const getDataFromPath = atomFamily<any | undefined, string>({
    key     : "getDataFromPath",
    default : (path: string) => {
        const db = getDatabase();

        const doc = ref(db, path);

        return getInDb(doc).then(data => data.val() || undefined);
    },
    effects_UNSTABLE: path => [
        ({ setSelf, onSet }) => {
            const db = getDatabase();

            const parentDoc = ref(db, path);
            const childDoc  = ref(db, `${ path }/values`);

            onSet((newValue) => {
                if (newValue == undefined) {
                    remove(childDoc);
                } else {
                    update(parentDoc, { values: newValue });
                }
            });

            const unsubscribe = onValue(childDoc, data => setSelf(data.val() || undefined));

            return () => unsubscribe();
        },
    ],
});
