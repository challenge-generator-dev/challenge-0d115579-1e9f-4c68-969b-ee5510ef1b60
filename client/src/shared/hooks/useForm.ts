import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface FieldConfig<T> {
  initialValue: T;
  validate?: ValidationRule<T>;
}

interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: (newValues?: T) => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
}

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, onSubmit, validateOnChange = true, validateOnBlur = true } = options;

  const [formState, setFormState] = useState<FormState<T>>({
    values: { ...initialValues },
    errors: {} as Partial<Record<keyof T, string>>,
    touched: {} as Partial<Record<keyof T, boolean>>,
    isSubmitting: false,
    isValid: false,
  });

  const validateField = useCallback((field: keyof T): boolean => {
    const fieldConfig = initialValues[field];
    if (fieldConfig && 'validate' in fieldConfig) {
      const rule = (fieldConfig as FieldConfig<unknown>).validate as ValidationRule<unknown>;
      if (rule) {
        const value = formState.values[field];
        const isValid = rule.validate(value);
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: isValid ? undefined : rule.message,
          },
        }));
        return isValid;
      }
    }
    return true;
  }, [formState.values, initialValues]);

  const validateAll = useCallback((): boolean => {
    let isFormValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(formState.values).forEach(field => {
      const key = field as keyof T;
      const fieldConfig = initialValues[key];
      if (fieldConfig && 'validate' in fieldConfig) {
        const rule = (fieldConfig as FieldConfig<unknown>).validate as ValidationRule<unknown>;
        if (rule) {
          const value = formState.values[key];
          const isValid = rule.validate(value);
          if (!isValid) {
            newErrors[key] = rule.message;
            isFormValid = false;
          }
        }
      }
    });

    setFormState(prev => ({
      ...prev,
      errors: newErrors,
      isValid: isFormValid,
    }));

    return isFormValid;
  }, [formState.values, initialValues]);

  const handleChange = useCallback((field: keyof T) => {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = event.target;
      let parsedValue: string | number | boolean = value;

      if (type === 'number') {
        parsedValue = parseFloat(value) || 0;
      } else if (type === 'checkbox') {
        parsedValue = (event.target as HTMLInputElement).checked;
      }

      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: parsedValue,
        },
      }));

      if (validateOnChange) {
        validateField(field);
      }
    };
  }, [validateOnChange, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setFormState(prev => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: true,
        },
      }));

      if (validateOnBlur) {
        validateField(field);
      }
    };
  }, [validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormState(prev => ({
      ...prev,
      touched: Object.keys(prev.values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>),
      isSubmitting: true,
    }));

    const isValid = validateAll();

    if (!isValid) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
      return;
    }

    try {
      await onSubmit(formState.values);
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
    } finally {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [formState.values, onSubmit, validateAll]);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  const resetForm = useCallback((newValues?: T) => {
    setFormState({
      values: newValues ? { ...newValues } : { ...initialValues },
      errors: {} as Partial<Record<keyof T, string>>,
      touched: {} as Partial<Record<keyof T, boolean>>,
      isSubmitting: false,
      isValid: false,
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    validateAll,
  };
}