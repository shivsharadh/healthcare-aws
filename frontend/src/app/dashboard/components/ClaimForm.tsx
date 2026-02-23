import { useState } from 'react';
import { axiosClient } from '@/lib/axios';

export default function ClaimForm({ onClaimAdded }: { onClaimAdded: () => void }) {
    const [patientName, setPatientName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axiosClient.post('/claims', {
                patient_name: patientName,
                diagnosis,
                amount: parseInt(amount, 10),
            });
            setPatientName('');
            setDiagnosis('');
            setAmount('');
            onClaimAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit claim');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submit New Claim</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-black bg-white"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-black bg-white"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                        type="number"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-black bg-white"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
            </div>
        </form>
    );
}
