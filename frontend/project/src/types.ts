export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}