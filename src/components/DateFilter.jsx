const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, onSearch, onClear }) => {
  return (
    <div className="sticky top-0 z-10 bg-[#F8F8F9] p-2 rounded-lg shadow">
      <div className="flex flex-wrap items-end gap-2 w-fit">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-3 py-1 text-sm bg-[#2D3A58] text-white rounded-lg hover:bg-[#0F172A]"
        >
          Search
        </button>
        {(startDate || endDate) && (
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default DateFilter;
