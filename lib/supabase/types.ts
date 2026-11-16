export interface MenuItem {
  id: string;
  name: string;
  name_fr?: string | null;
  category: string;
  category_fr?: string | null;
  description: string | null;
  description_fr?: string | null;
  price: number;
  image_url: string | null;
  is_weekly_special: boolean;
  is_available: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_time: string;
  items_json: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  guests_count: number;
  reservation_date: string;
  reservation_time: string;
  special_notes?: string | null;
  status: ReservationStatus;
  created_at: string;
}
