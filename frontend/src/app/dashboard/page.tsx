"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axios";
import ClaimList from "./components/ClaimList";
import ClaimForm from "./components/ClaimForm";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [claims, setClaims] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const fetchClaims = useCallback(async () => {
        try {
            setPageLoading(true);
            const res = await axiosClient.get("/claims");
            setClaims(res.data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setPageLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                fetchClaims();
            }
        }
    }, [user, loading, router, fetchClaims]);

    if (loading || !user) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user.username}!</h1>
                    <p className="text-gray-600">
                        Active role: <span className="font-semibold text-blue-600 uppercase">{user.role}</span>
                    </p>
                </div>
                <button
                    onClick={fetchClaims}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                    Refresh Data
                </button>
            </div>

            {(user.role === "hospital" || user.role === "patient") && (
                <ClaimForm onClaimAdded={fetchClaims} />
            )}

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {user.role === "insurance" ? "All Platform Claims" : "Your Claims"}
                </h2>
                {pageLoading ? (
                    <p className="text-gray-500">Loading claims...</p>
                ) : (
                    <ClaimList claims={claims} role={user.role} onClaimUpdated={fetchClaims} />
                )}
            </div>
        </div>
    );
}
