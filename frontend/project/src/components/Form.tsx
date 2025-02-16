import React from 'react';

interface FormProps {
  fields: {
    name: string;
    label: string;
    type: string;
  }[];
  values: any;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

export function Form({ fields, values, onChange, onSubmit, isEdit }: FormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            value={values[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}