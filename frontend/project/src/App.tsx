import  { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Package, Users, ShoppingCart, UserCircle } from 'lucide-react';
import { api } from './api';
import { DataTable } from './components/DataTable';
import { Form } from './components/Form';
import type { Product, Customer, Order, Employee } from './types';

function App() {
  // State for each microservice
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Form states
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch data for all services
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, customersData, ordersData, employeesData] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders(),
        api.getEmployees(),
      ]);
  
      // Log des données récupérées
      console.log('Products data:', productsData);
      console.log('Customers data:', customersData);
      console.log('Orders data:', ordersData);
      console.log('Employees data:', employeesData);
  
      setProducts(productsData);
      setCustomers(customersData);
      setOrders(ordersData);
      setEmployees(employeesData);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (table: string) => {
    try {
      switch (table) {
        case 'products':
          await api.createProduct(formData);
          break;
        case 'customers':
          await api.createCustomer(formData);
          break;
        case 'orders':
          await api.createOrder(formData);
          break;
        case 'employees':
          await api.createEmployee(formData);
          break;
      }
      toast.success('Created successfully');
      fetchData();
      setFormData({});
      setActiveSection(null);
    } catch (error) {
      toast.error('Error creating record');
    }
  };

  const handleUpdate = async (table: string) => {
    try {
      switch (table) {
        case 'products':
          await api.updateProduct(formData.id, formData);
          break;
        case 'customers':
          await api.updateCustomer(formData.id, formData);
          break;
        case 'orders':
          await api.updateOrder(formData.id, formData);
          break;
        case 'employees':
          await api.updateEmployee(formData.id, formData);
          break;
      }
      toast.success('Updated successfully');
      fetchData();
      setFormData({});
      setIsEditing(false);
      setActiveSection(null);
    } catch (error) {
      toast.error('Error updating data');
    }
  };

  const handleDelete = async (table: string, id: number) => {
    try {
      switch (table) {
        case 'products':
          await api.deleteProduct(id);
          break;
        case 'customers':
          await api.deleteCustomer(id);
          break;
        case 'orders':
          await api.deleteOrder(id);
          break;
        case 'employees':
          await api.deleteEmployee(id);
          break;
      }
      toast.success('Deleted');
      fetchData();
    } catch (error) {
      toast.error('Error deleting data');
    }
  };

  const sections = [
    {
      title: 'Products',
      icon: Package,
      table: 'products',
      data: products,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'price', label: 'Price (in DH)' },
        { key: 'stock', label: 'Stock' }
      ],
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'price', label: 'Price (in DH)', type: 'number' },
        { name: 'stock', label: 'Stock', type: 'number' }
      ]
    },
    {
      title: 'Customers',
      icon: Users,
      table: 'customers',
      data: customers,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' }
      ],
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      table: 'orders',
      data: orders,
      columns: [
        { key: 'user_id', label: 'Customer ID' },
        { key: 'product_id', label: 'Product ID' },
        { key: 'quantity', label: 'Quantity' }
      ],
      fields: [
        { name: 'user_id', label: 'Customer ID', type: 'number' },
        { name: 'product_id', label: 'Product ID', type: 'number' },
        { name: 'quantity', label: 'Quantity', type: 'text' }
      ]
    },
    {
      title: 'Employees',
      icon: UserCircle,
      table: 'employees',
      data: employees,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'position', label: 'Position' },
        { key: 'departement', label: 'Departement' }
      ],
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'position', label: 'Position', type: 'text' },
        { name: 'departement', label: 'Departement', type: 'text' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.table} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <section.icon className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSection(activeSection === section.table ? null : section.table);
                      setIsEditing(false);
                      setFormData({});
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {activeSection === section.table ? 'Cancel' : 'Add New'}
                  </button>
                </div>

                {activeSection === section.table && (
                  <div className="mb-6">
                    <Form
                      fields={section.fields}
                      values={formData}
                      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                      onSubmit={() => isEditing ? handleUpdate(section.table) : handleCreate(section.table)}
                      isEdit={isEditing}
                    />
                  </div>
                )}

                <DataTable
                  data={section.data}
                  columns={section.columns}
                  onEdit={(item) => {
                    setFormData(item);
                    setIsEditing(true);
                    setActiveSection(section.table);
                  }}
                  onDelete={(id) => handleDelete(section.table, id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
