
export function toast(toaster, msg, type = "success", position = "top-right") {
    toaster.show(msg, {
        theme: "bubble",
        type,
        // 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'
        position,
        fitToScreen: true,
        duration: 5000,
    });
}

function dispatchNotification(message, type) {
    const notify = new CustomEvent("toast-notification", {
        detail: {
            message,
            type,
        },
    });
    document.dispatchEvent(notify);
}

export const notifyError = (message) => {
    dispatchNotification(message, "error");
};

export const notifySuccess = (message) => {
    dispatchNotification(message, "success");
};

export const notifyInfo = (message) => {
    dispatchNotification(message, "info");
};
