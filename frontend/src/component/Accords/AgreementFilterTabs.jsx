const AgreementsFilterTabs = ({ activeFilter, onFilterChange, stats }) => {
  const tabs = [
    { id: 'all', label: `Tous (${stats.total})` },
    { id: 'Accepter', label: `Acceptés (${stats.accepted})` },
    { id: 'Refuser', label: `Refusés (${stats.rejected})` },
  ];

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={`
            px-5 py-2.5 rounded-lg font-medium transition-all
            ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AgreementsFilterTabs