import type { Product, Customer, Order, Employee } from './types';

const API_BASE_URL ='http://localhost:8080';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    console.log(`Data fetched from ${endpoint}:`, data); // Ajoutez ce log pour voir la réponse
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error); // Log de l'erreur
    throw error;
  }
}


export const api = {
  // Products
  getProducts: async (data: Omit<Product, 'id'>) => {
    try {
      const result = await fetchApi('/products', { method: 'GET', body: JSON.stringify(data) });
      console.log('Products fetched:', result); // Test pour voir les données reçues
      return result;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  createProduct: (data: Omit<Product, 'id'>) => 
    fetchApi('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Partial<Product>) => 
    fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: number) => 
    fetchApi(`/products/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: async () => {
    try {
      const result = await fetchApi('/users');
      console.log('Customers fetched:', result); // Test pour voir les données reçues
      return result;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  createCustomer: (data: Omit<Customer, 'id'>) => 
    fetchApi('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: number, data: Partial<Customer>) => 
    fetchApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: number) => 
    fetchApi(`/users/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: async () => {
    try {
      const result = await fetchApi('/orders');
      console.log('Orders fetched:', result); // Test pour voir les données reçues
      return result;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  createOrder: (data: Omit<Order, 'id'>) => 
    fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: number, data: Partial<Order>) => 
    fetchApi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id: number) => 
    fetchApi(`/orders/${id}`, { method: 'DELETE' }),

  // Employees
  getEmployees: async () => {
    try {
      const result = await fetchApi('/employees');
      console.log('Employees fetched:', result); // Test pour voir les données reçues
      return result;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  createEmployee: (data: Omit<Employee, 'id'>) => 
    fetchApi('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: Partial<Employee>) => 
    fetchApi(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id: number) => 
    fetchApi(`/employees/${id}`, { method: 'DELETE' }),
};
