import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { CharacterProps } from "@components/Character";

import { getCharacters } from "@helpers/character";
import { getChannelId } from "@helpers/client";
import { getPlayers } from "@helpers/players";
import { getRoundCharactersOpponent, publishRoundCharacters, roundStateAtom } from "@helpers/round";

import "./style.css";
import { getCategories } from "@helpers/categories";

export const Lobby = () => {
    const categories         = useRecoilValue(getCategories);
    const channelId          = useRecoilValue(getChannelId);
    const characters         = useRecoilValue(getCharacters);
    const charactersOpponent = useRecoilValue(getRoundCharactersOpponent);
    const players            = useRecoilValue(getPlayers);


    const [charactersPlayer, setPublishCharactersPlayer] = useRecoilState(publishRoundCharacters);

    const setRoundState = useSetRecoilState(roundStateAtom);

    const [roomLinkClicked, setRoomLinkClicked] = useState(false);

    const { t } = useTranslation();

    const copyLinkRoom = () => {
        setRoomLinkClicked(true);

        window.navigator.clipboard.writeText(`${ window.location.origin }${ window.location.pathname }?channel=${ channelId }`);
    }

    const generateCharacters = (): CharacterProps[] => {
        return characters.filter((character) => !charactersOpponent.includes(character)).slice(0, 8 * 3);
    }

    const startRound = () => {
        setPublishCharactersPlayer(generateCharacters());
    }

    useEffect(() => {
        if (charactersOpponent.length > 0) {
            if (charactersPlayer.length === 0) {
                setPublishCharactersPlayer(generateCharacters());
            }

            if (charactersPlayer.length > 0) {
                setRoundState("choose-character");
            }
        }
    }, [charactersPlayer, charactersOpponent]);

    useEffect(() => {
        if (roomLinkClicked) {
            setTimeout(() => {
                setRoomLinkClicked(false);
            }, 2000);
        }
    }, [roomLinkClicked]);

    const variants = {
        hidden  : { y: "-100%" },
        visible : { y: 0 },
    }

    if (players.length < 2) {
        return (
            <div className="lobby">
                { t("lobby.waiting") }

                <button className="lobby--link" onClick={ () => copyLinkRoom() }>{ roomLinkClicked ? t("lobby.link-clicked") : t("lobby.link") }</button>
            </div>
        );
    }

    return (
        <div className="lobby">
            <button className="lobby--start" onClick={ () => startRound() }>{ t("lobby.start") }</button>

            { players.length > 2 &&
                <div className="lobby--toomanyplayers">{ t("lobby.too-many-players") }</div>
            }

            {/* <AnimatePresence>
                <motion.div
                    className="lobby--categories"
                    transition={{ duration: 0.3 }}
                    initial="hide"
                    animate="visible"
                    variants={ variants }
                    exit={ variants.hidden }
                >
                    { t("lobby.choose-categories") }

                    <div className="lobby--categories__container">
                        <label className="lobby--categories__label">
                            <input type="checkbox" className="lobby--categories__checkbox" defaultChecked />

                            { t("lobby.all-categories") }
                        </label>

                        { categories.map((categorie, index) => {

                            return (
                                <label key={ index } className="lobby--categories__label">
                                    <input type="checkbox" className="lobby--categories__checkbox" defaultChecked />

                                    { categorie }
                                </label>
                            );
                        }) }
                    </div>
                </motion.div>
            </AnimatePresence> */}
        </div>
    );
}
