import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";

import { Notification } from "@components/Notification";

import { getNotifications, removeNotificationProxy } from "@helpers/notification";

import "./style.css";

export const NotificationCenter = () => {
    const notifications = useRecoilValue(getNotifications);

    const removeNotification = useSetRecoilState(removeNotificationProxy);

    const variants = {
        hidden  : { height: "0px",  overflow: "hidden" },
        visible : { height: "auto", overflow: "hidden" },
    }

    return (
        <div className="notification-center">
            <AnimatePresence>
                { notifications.map((notification, index) =>
                    <motion.div
                        key={ notification.id }
                        transition={{ duration: 0.3 }}
                        animate={ "visible" }
                        initial={ "hidden" }
                        exit={ "hidden" }
                        variants={ variants }
                        style={{ zIndex: 100 - index }}
                    >
                        <Notification { ...notification } onRemoved={ () => removeNotification(notification) } />
                    </motion.div>
                ) }
            </AnimatePresence>
        </div>
    );
}
