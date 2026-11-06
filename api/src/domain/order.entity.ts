import { IsNotEmpty, IsString, IsUUID, IsDate, IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  constructor(id: string, description: string, status: OrderStatus = OrderStatus.PENDING) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.createdAt = new Date();
  }

  static create(id: string, description: string): Order {
    if (!id || !description) {
      throw new Error('Order ID and description are required');
    }
    return new Order(id, description);
  }

  updateDescription(newDescription: string): void {
    if (!newDescription) {
      throw new Error('Description cannot be empty');
    }
    this.description = newDescription;
  }

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }
}