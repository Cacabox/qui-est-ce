import { selector } from "recoil";
import { getAuth, signInWithCustomToken, User } from "firebase/auth";

import { firebaseClient } from "@helpers/client";
import { getFirebaseToken } from "@helpers/token";

export const getCurrentUser = selector<User>({
    key: "getCurrentUser",
    get: async ({ get }) => {
        const auth = getAuth(firebaseClient);

        let currentUser = auth.currentUser;

        if (!currentUser) {
            const firebaseToken = get(getFirebaseToken);

            const userCredential = await signInWithCustomToken(auth, firebaseToken);

            currentUser = userCredential.user;
        }

        return currentUser;
    },
    dangerouslyAllowMutability: true,
});

export const getCurrentUserPath = selector<string>({
    key: "getCurrentUserPath",
    get: ({ get }) => `users/${ get(getCurrentUser).uid }`,
});
