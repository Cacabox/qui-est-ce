import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

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

export type CharacterState = "loose" | "hidden" | "visible" | "win";

export const Character = ({
    animateDelay,
    character,
    disabled = false,
    onClick,
    position,
    state = "visible",
}: {
    character : CharacterProps,

    animateDelay ? : number,
    disabled     ? : boolean,
    onClick      ? : (character: CharacterProps, state: CharacterState) => void,
    position     ? : CharacterPositionProps,
    state        ? : CharacterState,
}) => {
    const { name, image: { offsetX } } = character;

    const className = ["character--box"];

    const characterImageStyle: React.CSSProperties = {
        backgroundImage: `url(${ character.image.url })`,
    }

    let characterStyle: React.CSSProperties | undefined;

    if (position) {
        characterStyle = {
            ...position,
            position: "absolute",
        };
    }

    if (!disabled && state === "hidden") {
        className.push("character--box__hiden");
    }

    if (offsetX !== null) {
        characterImageStyle.backgroundPosition = `${ offsetX * 100 }% center`;
    }

    if (!disabled && onClick) {
        className.push("character--box__action");
    }

    const parentVariants = {
        hidden  : { zIndex: position?.zIndex },
        visible : { zIndex: position?.zIndex },
    }

    const childVariants: Variants = {
        loose : {
            y          : "95%",
            transition : {
                duration: 0.1,
            }
        },
        hidden      : {
            y          : "65%",
            transition : {
                duration: 0.4,
            }
        },
        visible     : (custom ?: number) => ({
            y          : 0,
            transition : {
                delay    : (custom ?? 1) * 0.07,
            },
        }),
        win : (custom: number) => ({
            y          : 0,
            transition : {
                bounce     : 1,
                delay      : custom / 10,
                duration   : 0.5,
                ease       : "easeInOut",
                repeat     : Infinity,
                repeatType : "reverse",
            },
        }),
    }

    return (
        <AnimatePresence>
            <motion.div
                className="character"
                style={ characterStyle }
                transition={{ delay: state === "hidden" ? 0.3 : 0 }}
                initial="visible"
                animate={ state }
                variants={ parentVariants }
            >
                <motion.div
                    custom={ animateDelay }
                    className={ className.join(" ") }
                    initial="hidden"
                    animate={ state }
                    variants={ childVariants }
                    onClick={ () => !disabled && onClick && onClick(character, state) }
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
