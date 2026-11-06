import axios, { AxiosInstance, AxiosError } from 'axios';

export interface Order {
  id: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  id: string;
  description: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateOrderDto {
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface ApiError {
  message: string;
  code?: string;
}

class OrderService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message 
          ?? error.message 
          ?? 'Error desconocido al procesar la solicitud';
        return Promise.reject(new Error(message));
      }
    );
  }

  async fetchOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/orders');
    return response.data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const response = await this.client.post<Order>('/orders', dto);
    return response.data;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    const response = await this.client.put<Order>(`/orders/${id}`, dto);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();