import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService, type Order } from '../../services/order.service';
import { useOrders } from './hooks/useOrders';
import { ErrorMessage } from '../../shared/components/ErrorMessage';

const updateOrderSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Seleccione un estado válido' }),
  }),
});

type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;

interface UpdateOrderFormProps {
  initialOrder?: Order;
}

export function UpdateOrderForm({ initialOrder }: UpdateOrderFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refetch } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(!initialOrder);
  const [order, setOrder] = useState<Order | null>(initialOrder || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateOrderFormData>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      description: '',
      status: 'pending',
    },
  });

  useEffect(() => {
    const loadOrder = async () => {
      if (initialOrder) {
        setOrder(initialOrder);
        setValue('description', initialOrder.description);
        setValue('status', initialOrder.status as 'pending' | 'processing' | 'completed' | 'cancelled');
        setIsLoadingOrder(false);
        return;
      }

      if (!id) {
        setServerError('Identificador de orden no proporcionado');
        setIsLoadingOrder(false);
        return;
      }

      try {
        const fetchedOrder = await orderService.getOrderById(id);
        setOrder(fetchedOrder);
        setValue('description', fetchedOrder.description);
        setValue('status', fetchedOrder.status as 'pending' | 'processing' | 'completed' | 'cancelled');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setServerError('Orden no encontrada');
        } else {
          setServerError('Error al cargar la orden');
        }
        console.error('Error al cargar orden:', err);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    loadOrder();
  }, [id, initialOrder, setValue]);

  const onSubmit = async (data: UpdateOrderFormData) => {
    if (!order) {
      setServerError('No hay orden para actualizar');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setServerError(null);

    try {
      await orderService.updateOrder(order.id, data);
      await refetch();
      navigate('/orders');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        if (axiosError.response?.data?.message) {
          setServerError(axiosError.response.data.message);
        } else if (axiosError.response?.status === 404) {
          setServerError('Orden no encontrada');
        } else if (axiosError.response?.status === 400) {
          setServerError('Datos de validación incorrectos');
        } else {
          setServerError('Error al actualizar la orden. Intente de nuevo.');
        }
      } else {
        setServerError('Error inesperado al actualizar la orden');
      }
      console.error('Error al actualizar orden:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  if (isLoadingOrder) {
    return (
      <div className="update-order-form__loading">
        <div className="spinner" aria-label="Cargando orden"></div>
        <p>Cargando orden...</p>
      </div>
    );
  }

  if (!order && serverError) {
    return (
      <div className="update-order-form__error">
        <ErrorMessage message={serverError} />
        <button onClick={() => navigate('/orders')} className="btn btn--primary">
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="update-order-form">
      <header className="update-order-form__header">
        <h1>Actualizar Orden</h1>
        {order && <p className="order-id">ID: {order.id}</p>}
      </header>

      {(submitError || serverError) && (
        <ErrorMessage 
          message={serverError || submitError} 
          onClose={() => {
            setSubmitError(null);
            setServerError(null);
          }}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="update-order-form__form" noValidate>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción <span className="required">*</span>
          </label>
          <textarea
            id="description"
            {...register('description')}
            className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
            placeholder="Ingrese la descripción de la orden"
            rows={4}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <span id="description-error" className="form-error" role="alert">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Estado <span className="required">*</span>
          </label>
          <select
            id="status"
            {...register('status')}
            className={`form-select ${errors.status ? 'form-input--error' : ''}`}
            aria-invalid={errors.status ? 'true' : 'false'}
            aria-describedby={errors.status ? 'status-error' : undefined}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          {errors.status && (
            <span id="status-error" className="form-error" role="alert">
              {errors.status.message}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn--primary"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Orden'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="btn btn--secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}