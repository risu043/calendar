import { EventInput } from "@fullcalendar/core";

// CSRFトークンを取得する関数
const getCSRFToken = (): string | null => {
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    if (!csrfTokenElement) {
        console.error("CSRFトークンが見つかりません");
        return null;
    }
    const csrfToken = csrfTokenElement.getAttribute("content");
    if (!csrfToken) {
        console.error("CSRFトークンが無効です");
        return null;
    }
    return csrfToken;
};

export const addEvent = async (data: EventInput): Promise<Response> => {
    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error("CSRF token not found");
    const response = await fetch("/chocos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("create event failed");
    return response;
};

export const deleteEvent = async (id: EventInput): Promise<void> => {
    const url = `/chocos/${id}`;
    console.log(`Sending DELETE request to ${url}`);

    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error("CSRF token not found");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            _method: "DELETE",
        }),
    });
    if (!response.ok) throw new Error("delete event failed");
};

export const updateEvent = async (data: EventInput): Promise<void> => {
    let id = data.id;
    const url = `/chocos/${id}`;
    console.log(`Sending DELETE request to ${url}`);

    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error("CSRF token not found");

    const response = await fetch(`/chocos/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            _method: "PATCH",
            start: data.start,
            end: data.end,
            allDay: data.allDay,
        }),
    });
    if (!response.ok) throw new Error("create event failed");
};
