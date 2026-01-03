const API_URLS = {
  bookings: 'https://functions.poehali.dev/4da3caa0-9cf1-4d79-aad8-1b01cf9be8dc',
  salons: 'https://functions.poehali.dev/1289e884-ad4d-4a25-b905-f35abc8a497e',
  users: 'https://functions.poehali.dev/51c4a28e-b500-412e-ab7c-e59a1d4db8e2'
};

export interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  working_hours: string;
}

export interface Master {
  id: number;
  salon_id: number;
  name: string;
  specialization: string;
  rating: number;
  photo_url?: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface Booking {
  id?: number;
  user_id: number;
  salon_id: number;
  master_id: number;
  service_id: number;
  booking_date: string;
  time_slot: string;
  status: string;
  total_price: number;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  bonus_points: number;
  total_visits: number;
}

class ApiClient {
  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Salons API
  async getSalons(): Promise<Salon[]> {
    return this.request(`${API_URLS.salons}?type=salons`);
  }

  async getMasters(salonId?: number): Promise<Master[]> {
    const url = salonId 
      ? `${API_URLS.salons}?type=masters&salon_id=${salonId}`
      : `${API_URLS.salons}?type=masters`;
    return this.request(url);
  }

  async getServices(): Promise<Service[]> {
    return this.request(`${API_URLS.salons}?type=services`);
  }

  // Bookings API
  async createBooking(booking: Omit<Booking, 'id'>): Promise<{ id: number; message: string }> {
    return this.request(API_URLS.bookings, {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.request(`${API_URLS.bookings}?user_id=${userId}`);
  }

  async cancelBooking(bookingId: number): Promise<{ message: string }> {
    return this.request(`${API_URLS.bookings}?booking_id=${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUser(userId: number): Promise<User> {
    return this.request(`${API_URLS.users}?user_id=${userId}`);
  }

  async updateUser(userId: number, data: Partial<User>): Promise<{ message: string }> {
    return this.request(`${API_URLS.users}?user_id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getBonusHistory(userId: number): Promise<any[]> {
    return this.request(`${API_URLS.users}?user_id=${userId}&type=bonus_history`);
  }
}

export const api = new ApiClient();
