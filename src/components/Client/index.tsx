import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";

import { firestoreClient, getFirestorePath } from "@helpers/client";
import { getPlayers, Player } from "@helpers/players";
import { getRoomId } from "@helpers/room";
import { getCurrentUser } from "@helpers/user";

export const Client = () => {
    const roomId = useRecoilValue(getRoomId);
    const path   = useRecoilValue(getFirestorePath);
    const user   = useRecoilValue(getCurrentUser);

    const setPlayers = useSetRecoilState(getPlayers);

    useEffect(() => {
        const userDoc = doc(firestoreClient, path.me);

        setDoc(userDoc, {
            id       : user.uid,
            name     : user.displayName,
            photoURL : user.photoURL,
            online   : true,
        }, { merge: true });

        const usersCollection = collection(firestoreClient, path.users);

        const unsubscribe = onSnapshot(usersCollection, (collection) => {
            const docs = collection.docs;

            const players: Player[] = docs.map((doc) => doc.data() as Player);

            setPlayers(players);
        });

        return () => unsubscribe();
    }, [roomId, user]);

    useEffect(() => {
        const listener = () => {
            const userDoc = doc(firestoreClient, path.me);

            setDoc(userDoc, {
                online: false,
            }, { merge: true });
        }

        window.addEventListener("beforeunload", listener, false);

        return () => window.removeEventListener("beforeunload", listener, false);
    }, []);

    return null;
}
