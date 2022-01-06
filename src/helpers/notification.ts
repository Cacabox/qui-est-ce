import { atom, DefaultValue, selector } from "recoil";

export interface NotificationModel {
    id       : number,
    text     : string,
    actions ?: { text: string, onClick: () => void }[],
}

export const getNotifications = atom<NotificationModel[]>({
    key     : "getNotifications",
    default : [],
});

export const addNotificationProxy = selector<Pick<NotificationModel, "text" | "actions">>({
    key: "addNotificationProxy",
    get: ({ get }) => get(getNotifications)[0],
    set: ({ set, get }, newValue) => {
        if (newValue instanceof DefaultValue) {
            return;
        }

        const notifications = get(getNotifications);

        const id = notifications.length > 0
            ? notifications[notifications.length - 1].id + 1
            : 1;

        set(getNotifications, [...notifications, { ...newValue, id }]);
    }
});

export const removeNotificationProxy = selector<Pick<NotificationModel, "id">>({
    key: "removeNotificationProxy",
    get: ({ get }) => get(getNotifications)[0],
    set: ({ set, get }, newValue) => {
        if (newValue instanceof DefaultValue) {
            return;
        }

        const notifications = get(getNotifications);

        const newNotifications = notifications.filter(_ => _.id !== newValue.id);

        set(getNotifications, newNotifications);
    }
});
