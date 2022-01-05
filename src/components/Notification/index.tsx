import React, { useEffect } from "react";

import { NotificationModel } from "@helpers/notification";

import "./style.css";

interface NotificationProps extends NotificationModel {
    onRemoved: () => void,
}

export const Notification = ({
    actions,
    onRemoved,
    text,
}: NotificationProps) => {
    useEffect(() => {
        if (actions && actions.length > 0) {
            return;
        }

        let timeout: any;

        setTimeout(() => {
            onRemoved();
        }, 5_000);

        return () => clearTimeout(timeout);
    }, [actions]);

    return (
        <div className="notification">
            <div className="notification--text" dangerouslySetInnerHTML={{ __html: text }} />

            { actions?.map((button, index) =>
                <button key={ index } className="notification--action" onClick={ () => { onRemoved(); button.onClick() }}>{ button.text }</button>
            ) }
        </div>
    );
}
