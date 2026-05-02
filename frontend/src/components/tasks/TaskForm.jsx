import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { TASK_STATUSES } from '../../config/constants'

export default function TaskForm({
  values,
  errors,
  onChange,
  userOptions,
  usersBlocked,
  submitting,
  onSubmit,
}) {
  const statusSelectOptions = TASK_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  const assignedDisabled = usersBlocked || userOptions.length === 0

  return (
    <form
      className="mx-auto max-w-xl space-y-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Input
        label="Title"
        value={values.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Task title"
        error={errors.title}
        disabled={submitting}
      />
      <div className="w-full">
        <label
          htmlFor="task-description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="task-description"
          rows={4}
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe the work"
          disabled={submitting}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 ${
            errors.description ? 'border-red-300' : 'border-gray-200'
          }`}
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        ) : null}
      </div>
      <Select
        label="Assigned user"
        id="assigned-user"
        value={values.assigned_by}
        options={userOptions}
        onChange={(e) => onChange('assigned_by', e.target.value)}
        error={errors.assigned_by}
        disabled={submitting || assignedDisabled}
        placeholderOption={
          usersBlocked
            ? 'Users unavailable (authentication required)'
            : userOptions.length === 0
              ? 'No users returned from API'
              : 'Select user'
        }
      />
      {usersBlocked ? (
        <p className="text-sm text-amber-800">
          User list could not be loaded. Assignee selection stays disabled until{' '}
          <code className="rounded bg-gray-100 px-1">/accounts/user/</code> is
          reachable with proper credentials.
        </p>
      ) : null}
      <Select
        label="Status"
        value={values.status}
        options={statusSelectOptions}
        onChange={(e) => onChange('status', e.target.value)}
        error={errors.status}
        disabled={submitting}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={submitting || assignedDisabled}
      >
        {submitting ? 'Creating…' : 'Create task'}
      </Button>
    </form>
  )
}
