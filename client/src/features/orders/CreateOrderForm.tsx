import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '../../services/order.service';
import { useOrders } from './hooks/useOrders';
import { ErrorMessage } from '../../shared/components/ErrorMessage';

const createOrderSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Seleccione un estado válido' }),
  }),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

export function CreateOrderForm() {
  const navigate = useNavigate();
  const { refetch } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      description: '',
      status: 'pending',
    },
  });

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setServerError(null);

    try {
      await orderService.createOrder(data);
      await refetch();
      navigate('/orders');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        if (axiosError.response?.data?.message) {
          setServerError(axiosError.response.data.message);
        } else if (axiosError.response?.status === 409) {
          setServerError('Ya existe una orden con este identificador');
        } else if (axiosError.response?.status === 400) {
          setServerError('Datos de validación incorrectos');
        } else {
          setServerError('Error al crear la orden. Intente de nuevo.');
        }
      } else {
        setServerError('Error inesperado al crear la orden');
      }
      console.error('Error al crear orden:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/orders');
  };

  return (
    <div className="create-order-form">
      <header className="create-order-form__header">
        <h1>Crear Nueva Orden</h1>
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

      <form onSubmit={handleSubmit(onSubmit)} className="create-order-form__form" noValidate>
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
            {isSubmitting ? 'Creando...' : 'Crear Orden'}
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