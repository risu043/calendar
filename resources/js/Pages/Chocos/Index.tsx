import React from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CalendarPageProps } from "../../types";
import Calendar from "../../Components/Calendar";

export default function Index({ auth, chocos }: CalendarPageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Events
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Calendar chocos={chocos} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
