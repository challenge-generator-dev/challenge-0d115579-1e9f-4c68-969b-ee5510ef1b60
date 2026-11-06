import { create } from 'zustand';
import { Order, CreateOrderDto, UpdateOrderDto } from '../services/order.service';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface OrderActions {
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updatedOrder: Order) => void;
  removeOrder: (id: string) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
  reset: () => void;
}

type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
};

export const useOrderStore = create<OrderStore>((set) => ({
  ...initialState,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
    totalCount: state.totalCount + 1,
  })),

  updateOrder: (id, updatedOrder) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === id ? updatedOrder : order
    ),
    selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
  })),

  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter((order) => order.id !== id),
    selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    totalCount: Math.max(0, state.totalCount - 1),
  })),

  setSelectedOrder: (order) => set({ selectedOrder: order }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setTotalCount: (count) => set({ totalCount: count }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setPageSize: (size) => set({ pageSize: size }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));

// Selectores derivados para uso eficiente
export const selectOrders = (state: OrderStore) => state.orders;
export const selectSelectedOrder = (state: OrderStore) => state.selectedOrder;
export const selectIsLoading = (state: OrderStore) => state.isLoading;
export const selectError = (state: OrderStore) => state.error;
export const selectTotalCount = (state: OrderStore) => state.totalCount;
export const selectCurrentPage = (state: OrderStore) => state.currentPage;
export const selectPageSize = (state: OrderStore) => state.pageSize;

// Selectores con lógica derivada
export const selectHasOrders = (state: OrderStore) => state.orders.length > 0;
export const selectIsEmpty = (state: OrderStore) => state.orders.length === 0 && !state.isLoading;
export const selectTotalPages = (state: OrderStore) => 
  Math.ceil(state.totalCount / state.pageSize);
export const selectCanGoNext = (state: OrderStore) => 
  state.currentPage < Math.ceil(state.totalCount / state.pageSize);
export const selectCanGoPrev = (state: OrderStore) => state.currentPage > 1;

// Selectores para filtrado y ordenamiento
export const selectOrdersByStatus = (status: string) => (state: OrderStore) =>
  state.orders.filter((order) => order.status === status);

export const selectRecentOrders = (limit: number) => (state: OrderStore) =>
  [...state.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

// Selectores para obtener una orden por ID
export const selectOrderById = (id: string) => (state: OrderStore) =>
  state.orders.find((order) => order.id === id) ?? null;