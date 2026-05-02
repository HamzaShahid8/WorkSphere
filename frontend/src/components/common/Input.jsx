export default function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  id,
  type = 'text',
  className = '',
  ...rest
}) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error ? 'border-red-300' : 'border-gray-200'
        } ${className}`}
        {...rest}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
