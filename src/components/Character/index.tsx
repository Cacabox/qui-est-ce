import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ComputedBounds } from "@components/Plateau";

import "./style.css";

export interface CharacterProps {
    id    : string,
    name  : string,
    image : string,
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
    const { name } = character;

    const className = ["character--box"];

    let style: React.CSSProperties | undefined;

    if (position) {
        style = {
            ...position,
            position: "absolute",
        };
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
                style={ style }
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

                    <div className="character--box__image">
                        <img src={ character.image } alt={ name } />
                    </div>

                    <div className="character--box__front">
                        <img src="assets/case-front.webp" />
                    </div>

                    <div className="character--box__name">{ name }</div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
