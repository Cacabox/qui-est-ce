import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { getCategories, getCategoriesBannedForRoom } from "@helpers/categories";
import { getRoomPath } from "@helpers/room";

import "./style.css";

export const Categories = () => {
    const categories = useRecoilValue(getCategories);
    const room       = useRecoilValue(getRoomPath);

    const [categoriesBanned, setCategoriesBanned] = useRecoilState(getCategoriesBannedForRoom(room));

    const [toggleCategorie, setToggleCategorie] = useState(true);

    const checkCategorie = (categorie: string) => {
        if (categoriesBanned.includes(categorie)) {
            return setCategoriesBanned(categoriesBanned.filter(_ => _ !== categorie));
        }

        return setCategoriesBanned([...categoriesBanned, categorie]);
    }

    const { t } = useTranslation();

    const variants = {
        hidden  : { y: "82%" },
        visible : { y: 0 },
    }

    return (
        <AnimatePresence>
            <motion.div
                className="categories"
                transition={{ duration: 0.3 }}
                initial="hidden"
                animate={ toggleCategorie ? "visible" : "hidden" }
                variants={ variants }
                exit={ variants.hidden }
            >
                <div className="categories--title" onClick={ () => setToggleCategorie(!toggleCategorie) }>
                    { t("categories.choose-categories") }
                </div>

                <div className="categories--container">
                    { categories.map((categorie, index) => {
                        return (
                            <div key={ index } className="categorie">
                                <input type="checkbox" id={ categorie.name } className="categorie--checkbox" onChange={ () => checkCategorie(categorie.name) } checked={ !categoriesBanned.includes(categorie.name) } />
                                <label className="categorie--label" htmlFor={ categorie.name }>{ categorie.name } ({ categorie.count })</label>
                            </div>
                        );
                    }) }
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
