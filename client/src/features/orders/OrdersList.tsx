import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from './hooks/useOrders';
import { orderService } from '../../services/order.service';
import { useOrderStore } from '../../store/orderStore';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import type { Order } from '../../services/order.service';

type SortField = 'createdAt' | 'description' | 'status';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function OrdersList() {
  const navigate = useNavigate();
  const { orders, isLoading, error, refetch } = useOrders();
  const { selectedOrder, setSelectedOrder, clearSelection } = useOrderStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];
    
    let result = [...orders];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.description.toLowerCase().includes(lowerSearch) ||
          order.status.toLowerCase().includes(lowerSearch)
      );
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [orders, searchTerm, sortField, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedOrders, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }
    
    try {
      await orderService.deleteOrder(id);
      refetch();
      if (selectedOrder?.id === id) {
        clearSelection();
      }
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    navigate(`/orders/edit/${order.id}`);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    navigate(`/orders/${order.id}`);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#F59E0B',
      processing: '#3B82F6',
      completed: '#10B981',
      cancelled: '#EF4444',
    };
    return colors[status.toLowerCase()] || '#6B7280';
  };

  if (isLoading) {
    return (
      <div className="orders-list__loading">
        <div className="spinner" aria-label="Cargando órdenes"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-list__error">
        <ErrorMessage 
          message={error instanceof Error ? error.message : 'Error al cargar las órdenes'} 
        />
        <button onClick={() => refetch()} className="btn btn--primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <header className="orders-list__header">
        <h1>Gestión de Órdenes</h1>
        <button 
          onClick={() => navigate('/orders/new')} 
          className="btn btn--primary"
        >
          Nueva Orden
        </button>
      </header>

      <div className="orders-list__filters">
        <input
          type="text"
          placeholder="Buscar por descripción o estado..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
          aria-label="Buscar órdenes"
        />
      </div>

      <div className="orders-list__table-container">
        <table className="orders-list__table" role="table" aria-label="Lista de órdenes">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('description')}
                className="sortable"
                aria-sort={sortField === 'description' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Descripción {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="sortable"
                aria-sort={sortField === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Estado {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="sortable"
                aria-sort={sortField === 'createdAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Fecha de Creación {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  {searchTerm ? 'No se encontraron órdenes con los criterios de búsqueda' : 'No hay órdenes disponibles'}
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className={selectedOrder?.id === order.id ? 'selected' : ''}>
                  <td>{order.description}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleView(order)}
                      className="btn btn--small btn--secondary"
                      aria-label={`Ver detalles de ${order.description}`}
                    >
                      Ver
                    </button>
                    <button 
                      onClick={() => handleEdit(order)}
                      className="btn btn--small btn--primary"
                      aria-label={`Editar ${order.description}`}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="btn btn--small btn--danger"
                      aria-label={`Eliminar ${order.description}`}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="orders-list__pagination" aria-label="Paginación de órdenes">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn--secondary"
            aria-label="Página anterior"
          >
            Anterior
          </button>
          
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn--secondary"
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </nav>
      )}
    </div>
  );
}