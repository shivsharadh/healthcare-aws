import { axiosClient } from '@/lib/axios';

export default function ClaimList({ claims, role, onClaimUpdated }: { claims: any[], role: string, onClaimUpdated: () => void }) {
    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await axiosClient.put(`/claims/${id}/status`, { status });
            onClaimUpdated();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (claims.length === 0) {
        return <p className="text-gray-500">No claims found.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        {role === 'insurance' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {claims.map((claim) => (
                        <tr key={claim.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{claim.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.patient_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.diagnosis}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${claim.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.submitted_by}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        claim.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {claim.status}
                                </span>
                            </td>
                            {role === 'insurance' && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {claim.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(claim.id, 'Approved')} className="text-green-600 hover:text-green-900 font-bold p-1">Approve</button>
                                            <button onClick={() => handleStatusUpdate(claim.id, 'Denied')} className="text-red-600 hover:text-red-900 font-bold p-1">Deny</button>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
