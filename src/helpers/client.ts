import { atomFamily } from "recoil";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, onValue, Query, ref, remove, update } from "firebase/database";

const config = require(`../../${ process.env.CONFIG_FILE }`);

export const apolloClient = new ApolloClient({
    uri   : config.apollo.url,
    cache : new InMemoryCache(),
});

export const firebaseClient = initializeApp(config.firebase);

export const analyticsClient = getAnalytics(firebaseClient);

export const getInDb = (query: Query): Promise<any> => {
    return new Promise((resolve) => {
        onValue(query, (snapshot) => {
            resolve(snapshot.val());
        }, { onlyOnce: true });
    });
}

export const getDataFromPath = atomFamily<any | undefined, string>({
    key     : "getDataFromPath",
    default : async(path: string) => {
        const db = getDatabase();

        const doc = ref(db, path);

        const data = await getInDb(doc);

        return data || undefined;
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
