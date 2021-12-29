import { selector } from "recoil";
import { getAuth, signInWithCustomToken, updateProfile, User } from "firebase/auth";

import { twitchApi, TwitchApiUser } from "@helpers/api";
import { firebaseClient } from "@helpers/client";
import { getFirebaseToken } from "@helpers/token";

export const getCurrentUser = selector<User>({
    key: "getCurrentUser",
    get: async ({ get }) => {
        const auth = getAuth(firebaseClient);

        const request: TwitchApiUser = await get(twitchApi({ path: "users" }));

        const twitchUser = request.data[0];

        let currentUser = auth.currentUser;

        if (!currentUser) {
            const firebaseToken = get(getFirebaseToken);

            const userCredential = await signInWithCustomToken(auth, firebaseToken);

            currentUser = userCredential.user;
        }

        if (currentUser.displayName !== twitchUser.display_name
         || currentUser.photoURL    !== twitchUser.profile_image_url) {
            updateProfile(currentUser, {
                displayName : twitchUser.display_name,
                photoURL    : twitchUser.profile_image_url,
            });
        }

        return currentUser;
    },
    dangerouslyAllowMutability: true,
});
