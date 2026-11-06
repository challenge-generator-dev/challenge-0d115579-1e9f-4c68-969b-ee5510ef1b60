import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { OrdersList } from '@/features/orders/OrdersList';
import { CreateOrderForm } from '@/features/orders/CreateOrderForm';
import { UpdateOrderForm } from '@/features/orders/UpdateOrderForm';

function App() {
  const { orders, isLoading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useOrderStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión de Órdenes</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <OrdersList
                orders={orders}
                isLoading={isLoading}
                error={error}
                onRefresh={fetchOrders}
                onDelete={deleteOrder}
              />
            }
          />
          <Route
            path="/orders/new"
            element={
              <CreateOrderForm
                onSubmit={createOrder}
              />
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <UpdateOrderForm
                orders={orders}
                onUpdate={updateOrder}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;