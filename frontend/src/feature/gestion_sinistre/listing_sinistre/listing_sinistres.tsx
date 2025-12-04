import React from 'react';


export default function ListingSinistres() {
    const sinistres = [
        {
            id: 'SIN-2024-5678',
            date: '12/09/2024',
            lieu: 'Douala - Bonapriso',
            statut: 'En cours',
            description: 'Collision légère entre deux véhicules.'
        },
        {
            id: 'SIN-2024-4321',
            date: '02/08/2024',
            lieu: 'Yaoundé - Bastos',
            statut: 'Clôturé',
            description: 'Dégâts matériels suite à une inondation.'
        }
    ];


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">Mes sinistres</h1>
                <p className="text-gray-600 mb-6">Retrouvez ici la liste de vos déclarations de sinistre.</p>


                <div className="bg-white shadow rounded-xl p-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-3">N° Dossier</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Lieu</th>
                                <th className="p-3">Statut</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>


                        <tbody>
                            {sinistres.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-3 font-semibold text-blue-700">{s.id}</td>
                                    <td className="p-3">{s.date}</td>
                                    <td className="p-3">{s.lieu}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${s.statut === 'Clôturé'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {s.statut}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Voir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}