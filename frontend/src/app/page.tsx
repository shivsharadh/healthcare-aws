import Link from "next/link";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-2xl bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6 text-blue-600">
          <Shield size={64} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Healthcare Claims Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Secure, role-based access to patient data, hospital records, and insurance claims.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
