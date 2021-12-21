import { selector } from "recoil";
// import { getI18n } from "react-i18next";

import { getCharacters } from "@helpers/character";

export const getCategories = selector<string[]>({
    key: "getCategories",
    get: ({ get }) => {
        const characters = get(getCharacters);

        return characters.reduce<string[]>((previous, current) => {
            let categories = [...current.categories];

            // const { t } = useTranslation();
            // console.log(getI18n());

            if (categories.length === 0) {
                // categories.push(getI18n().t("lobby.other-categories"))
                categories.push("lobby.other-categories")
            }

            categories.map((categorie) => {
                if (!previous.includes(categorie)) {
                    previous.push(categorie);
                }
            });

            return previous;
        }, []).sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
    },
});
