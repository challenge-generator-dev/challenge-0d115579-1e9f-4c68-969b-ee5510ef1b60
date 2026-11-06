import { useCallback, useState } from 'react';
import { orderService, Order, CreateOrderDto, UpdateOrderDto } from '@/services/order.service';

interface UseOrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface UseOrdersActions {
  fetchOrders: () => Promise<void>;
  createOrder: (dto: CreateOrderDto) => Promise<Order>;
  updateOrder: (id: string, dto: UpdateOrderDto) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
}

export type UseOrdersReturn = UseOrdersState & UseOrdersActions;

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.fetchOrders();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (dto: CreateOrderDto): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!dto.id || dto.id.trim() === '') {
        throw new Error('El identificador de la orden es requerido');
      }
      if (!dto.description || dto.description.trim() === '') {
        throw new Error('La descripción de la orden es requerida');
      }
      const existingOrder = orders.find((o) => o.id === dto.id);
      if (existingOrder) {
        throw new Error(`Ya existe una orden con el identificador "${dto.id}"`);
      }
      const newOrder = await orderService.createOrder(dto);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orders]);

  const updateOrder = useCallback(async (id: string, dto: UpdateOrderDto): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrder(id, dto);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await orderService.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    clearError,
  };
}