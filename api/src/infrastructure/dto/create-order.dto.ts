import { IsString, IsNotEmpty, IsEnum, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/order.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Identificador único de la orden',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID no puede estar vacío' })
  id: string;

  @ApiProperty({
    description: 'Descripción de la orden',
    example: 'Orden de compra de productos electrónicos',
    minLength: 1,
    maxLength: 500,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MinLength(1, { message: 'La descripción debe tener al menos 1 carácter' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description: string;

  @ApiPropertyOptional({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    default: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'El estado debe ser un valor válido de OrderStatus' })
  status?: OrderStatus;
}