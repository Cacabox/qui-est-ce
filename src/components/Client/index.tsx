import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { getDatabase, onDisconnect, onValue, ref, update } from "firebase/database";
import * as Sentry from "@sentry/browser";

import { getRoomPath } from "@helpers/room";
import { getCurrentUser, getCurrentUserPath } from "@helpers/user";

export const Client = () => {
    const roomPath = useRecoilValue(getRoomPath);
    const userPath = useRecoilValue(getCurrentUserPath);
    const user     = useRecoilValue(getCurrentUser);

    useEffect(() => {
        const db = getDatabase();

        const connected = ref(db, ".info/connected");
        const userDoc   = ref(db, userPath);

        const roomUsersDoc = ref(db, `${ roomPath }/users`);

        update(userDoc, {
            id       : user.uid,
            name     : user.displayName,
            online   : true,
            photoURL : user.photoURL,
        });

        Sentry.setUser({
            id       : user.uid,
            username : user.displayName || "undefined",
        });

        update(roomUsersDoc, { [user.uid]: true });

        const unsubscribe = onValue(connected, (snapshot) => {
            if (snapshot.val() == false) {
                return;
            }

            onDisconnect(userDoc).update({ online: false });

            onDisconnect(roomUsersDoc).update({ [user.uid]: false })
        });

        const listener = () => {
            update(userDoc, { online: false });

            update(roomUsersDoc, { [user.uid]: false });
        }

        window.addEventListener("beforeunload", listener, false);

        return () => {
            update(userDoc, { online: false });

            update(roomUsersDoc, { [user.uid]: false });

            unsubscribe();

            window.removeEventListener("beforeunload", listener, false);
        }
    }, [roomPath]);

    return null;
}
