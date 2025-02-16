import { Edit2, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

export function DataTable({ data, columns, onEdit, onDelete }: DataTableProps) {
  // Transform array data into object format
  const transformedData = data.map((item) => {
    if (Array.isArray(item)) {
      return item.reduce((obj, value, index) => {
        if (index === 0) {
          obj.id = value; // First element is ID
        } else if (columns[index - 1]) {
          obj[columns[index - 1].key] = value;
        }
        return obj;
      }, {} as Record<string, any>);
    }
    return item;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transformedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                No data available
              </td>
            </tr>
          ) : (
            transformedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}