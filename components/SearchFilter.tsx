'use client'

interface FilterOption {
  value: string
  label: string
}

interface FilterControl {
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface SearchFilterProps {
  searchText: string
  onSearchChange: (text: string) => void
  filterOptions: FilterControl[]
}

export default function SearchFilter({
  searchText,
  onSearchChange,
  filterOptions,
}: SearchFilterProps) {
  return (
    <div className="stat-card space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search
        </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filterOptions.map((filter) => (
          <div key={filter.label}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {filter.label}
            </label>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-600"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
