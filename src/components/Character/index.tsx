import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ComputedBounds } from "@components/Plateau";
import { Textfit } from "@components/Textfit";

import "./style.css";

export interface CharacterProps {
    id         : string,
    name       : string,
    image      : { url: string, offsetX: number | null },
    categories : string[],
}

export interface CharacterPositionProps extends ComputedBounds {
    zIndex : number,
}

export const Character = ({
    animateDelay,
    character,
    position,
    hide,
    onClick,
}: {
    character : CharacterProps,

    animateDelay ? : number,
    position     ? : CharacterPositionProps,
    hide         ? : boolean,
    onClick      ? : (character: CharacterProps, hidden ?: boolean) => void,
}) => {
    const { name, image: { offsetX } } = character;

    const className = ["character--box"];

    let characterStyle: React.CSSProperties | undefined;

    if (position) {
        characterStyle = {
            ...position,
            position: "absolute",
        };
    }

    const characterImageStyle: React.CSSProperties = {
        backgroundImage: `url(${ character.image.url })`,
    }

    if (offsetX !== null) {
        characterImageStyle.backgroundPosition = `${ offsetX * 100 }% center`;
    }

    const parentVariants = {
        hidden  : { zIndex: position?.zIndex },
        visible : { zIndex: position?.zIndex },
    }

    const childVariants = {
        hidden  : { y: "65%" },
        visible : (custom ?: number) => ({
            y          : 0,
            transition : { delay: (custom ?? 1) * 0.07 },
        }),
    }

    if (hide) {
        className.push("character--box__hiden")
    }

    return (
        <AnimatePresence>
            <motion.div
                className="character"
                style={ characterStyle }
                transition={{ delay: hide ? 0.3 : 0 }}
                initial="visible"
                animate={ hide ? "hidden" : "visible" }
                variants={ parentVariants }
                exit={ parentVariants.hidden }
            >
                <motion.div
                    custom={ animateDelay }
                    className={ className.join(" ") }
                    transition={{ duration: 0.5 }}
                    initial="hidden"
                    animate={ hide ? "hidden" : "visible" }
                    variants={ childVariants }
                    exit={ childVariants.hidden }
                    onClick={ () => onClick && onClick(character, hide) }
                >
                    <div className="character--box__background">
                        <img src="assets/case-background.webp" />
                    </div>

                    <div className="character--box__image" style={ characterImageStyle } />

                    <div className="character--box__front">
                        <img src="assets/case-front.webp" />
                    </div>

                    <Textfit className="character--box__name" text={ name } font="Sweaty Belvin" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
