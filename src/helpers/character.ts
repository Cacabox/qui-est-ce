import { atom } from "recoil";

import type { CharacterProps } from "@components/Character";

export type CharacterStatus = "show" | "hide";

export const getCharacters = atom<CharacterProps[]>({
    key     : "getCharacters",
    default : generateDefaultCharacters(),
});

function generateDefaultCharacters(): CharacterProps[] {
    const names = ["Terracid", "Hugod", "Potatoz", "Léo", "Gabriel", "Raphaël", "Arthur", "Louis", "Jules", "Adam", "Maël", "Lucas", "Hugo", "Noah", "Liam", "Gabin", "Sacha", "Paul", "Nathan", "Aaron", "Mohamed", "Ethan", "Tom", "Éden", "Léon", "Noé", "Tiago", "Théo", "Isaac", "Marius", "Victor", "Ayden", "Martin", "Naël", "Mathis", "Axel", "Robin", "Timéo", "Enzo", "Marceau", "Valentin", "Nino", "Eliott", "Nolan", "Malo", "Milo", "Antoine", "Samuel", "Augustin", "Amir", "Lyam", "Rayan", "Yanis", "Ibrahim", "Gaspard", "Sohan", "Clément", "Mathéo", "Simon", "Baptiste", "Maxence", "Imran", "Kaïs", "Côme", "Soan", "Évan", "Maxime", "Camille", "Alexandre", "Owen", "Ismaël", "Lenny", "Pablo", "Léandre", "Naïm", "Ilyan", "Thomas", "Joseph", "Oscar", "Elio", "Noa", "Malone", "Diego", "Noam", "Livio", "Charlie", "Charly", "Basile", "Milan", "Ilyes", "Ali", "Anas", "Logan", "Mathys", "Alessio", "William", "Timothée", "Auguste", "Ayoub", "Adem", "Wassim", "Youssef", "Marin"];

    return names.map((name) => {
        return {
            name,
            image: "assets/default.jpeg",
        }
    });
}
