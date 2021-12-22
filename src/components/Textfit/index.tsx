import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import "./style.css";

export const Textfit = ({
    font,
    text,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    font: string,
    text: string,
}) => {
    const maxFontSize = 24;

    const ref = useRef<HTMLDivElement>(null);

    const [fontSize, setFontSize]     = useState<string>();
    const [windowSize, setWindowSize] = useState<{ height: number, width: number }>();

    const style: React.CSSProperties = {
        whiteSpace: "nowrap",
    }

    const handleWindowResize  = useDebouncedCallback(() => {
        setWindowSize({
            width  : window.innerWidth,
            height : window.innerHeight,
        });
    }, 200);

    useEffect(() => {
        setTimeout(() => {
            if (!ref.current) {
                return;
            }

            const element = document.createElement("span");

            element.innerText = text;

            element.style["fontFamily"] = font;
            element.style["fontSize"] = "100px";

            element.classList.add("textfit");

            document.body.appendChild(element);

            const { width: maxWidth }  = ref.current.getBoundingClientRect();
            const { width: realWidth } = element.getBoundingClientRect();

            element.remove();

            setFontSize(`${ Math.min(100 * (maxWidth / realWidth), maxFontSize) }px`);
        }, 50);
    }, [text, windowSize]);

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <div style={{ ...style, fontSize }} { ...props } ref={ ref }>
            { text }
        </div>
    );
};
