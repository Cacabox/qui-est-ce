import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ComputedBounds } from "@components/Plateau";

import "./style.css";

export interface CharacterProps {
    name  : string,
    image : string,
}

export interface CharacterPositionProps extends ComputedBounds {
    zIndex : number,
}

export const Character = ({
    animate,
    animateDelay,
    character,
    position,
    hide,
    onClick,
}: {
    character : CharacterProps,

    animate      ? : boolean,
    animateDelay ? : number,
    position     ? : CharacterPositionProps,
    hide         ? : boolean,
    onClick      ? : (character: CharacterProps) => void,
}) => {
    const { name } = character;

    const className = ["character"];

    if (hide) {
        className.push("character_hide");
    }

    let style: React.CSSProperties | undefined;

    if (position) {
        style = {
            ...position,
            position: "absolute",
        };
    }

    const variants = {
        hidden  : { y: "73%" },
        visible : (custom ?: number) => ({
            y: 0,
            transition: { delay: (custom ?? 1) * 0.07 }
        }),
    }

    return (
        <div className={ className.join(" ") } style={ style }>
            <AnimatePresence>
                <motion.div
                    custom={ animateDelay }
                    className="character--box"
                    transition={{ duration: 0.5 }}
                    initial="hidden"
                    animate={ "visible" }
                    variants={ variants }
                    exit={ variants.hidden }
                    onClick={ () => onClick && onClick(character) }
                >
                    <div className="character--box__background">
                        <img src="../../../assets/case-background.webp" />
                    </div>

                    <div className="character--box__image">
                        <img src={ character.image } alt={ name } />
                    </div>

                    <div className="character--box__front">
                        <img src="../../../assets/case-front.webp" />
                    </div>

                    <div className="character--box__name">{ name }</div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
