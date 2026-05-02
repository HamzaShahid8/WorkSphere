export default function Select({
  label,
  value,
  options = [],
  onChange,
  error,
  disabled,
  id,
  placeholderOption,
}) {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : 'select')
  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        {placeholderOption ? (
          <option value="">{placeholderOption}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
