export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export interface Chocos {
    id: number;
    user_id: number;
    title: string;
    color: string;
    start: string;
    end?: string;
    allDay: boolean;
    created_at: string;
    updated_at: string;
}

export type CalendarProps = {
    chocos?: Chocos[];
};

export type CalendarPageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    chocos: Chocos[];
};
