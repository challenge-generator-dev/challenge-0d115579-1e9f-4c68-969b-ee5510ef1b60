import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from '../domain/order.repository';
import { Order } from '../domain/order.entity';
import { CreateOrderDto } from '../infrastructure/dto/create-order.dto';
import { UpdateOrderDto } from '../infrastructure/dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { id, description } = createOrderDto;

    if (!id || id.trim().length === 0) {
      this.logger.warn('Attempt to create order with empty ID');
      throw new BadRequestException('El identificador de la orden no puede estar vacío');
    }

    if (!description || description.trim().length === 0) {
      this.logger.warn(`Attempt to create order ${id} with empty description`);
      throw new BadRequestException('La descripción de la orden no puede estar vacía');
    }

    const exists = await this.orderRepository.exists(id);
    if (exists) {
      this.logger.warn(`Attempt to create duplicate order with ID: ${id}`);
      throw new BadRequestException(`Ya existe una orden con el identificador: ${id}`);
    }

    const order = Order.create(id, description);
    this.logger.log(`Creating order with ID: ${id}`);
    
    const createdOrder = await this.orderRepository.create(order);
    this.logger.log(`Order created successfully with ID: ${createdOrder.id}`);
    
    return createdOrder;
  }

  async getOrders(): Promise<Order[]> {
    this.logger.log('Fetching all orders');
    
    const orders = await this.orderRepository.findAll();
    
    orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
    
    this.logger.log(`Retrieved ${orders.length} orders`);
    return orders;
  }

  async getOrderById(id: string): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El identificador de la orden no puede estar vacío');
    }

    this.logger.log(`Fetching order with ID: ${id}`);
    
    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      this.logger.warn(`Order not found with ID: ${id}`);
      throw new NotFoundException(`No se encontró la orden con identificador: ${id}`);
    }
    
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El identificador de la orden no puede estar vacío');
    }

    const existingOrder = await this.orderRepository.findById(id);
    
    if (!existingOrder) {
      this.logger.warn(`Attempt to update non-existent order with ID: ${id}`);
      throw new NotFoundException(`No se encontró la orden con identificador: ${id}`);
    }

    const { description, status } = updateOrderDto;

    if (description !== undefined) {
      if (description.trim().length === 0) {
        throw new BadRequestException('La descripción de la orden no puede estar vacía');
      }
      existingOrder.updateDescription(description);
    }

    if (status !== undefined) {
      existingOrder.updateStatus(status);
    }

    this.logger.log(`Updating order with ID: ${id}`);
    
    const updatedOrder = await this.orderRepository.update(existingOrder);
    this.logger.log(`Order ${id} updated successfully`);
    
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El identificador de la orden no puede estar vacío');
    }

    const exists = await this.orderRepository.exists(id);
    
    if (!exists) {
      this.logger.warn(`Attempt to delete non-existent order with ID: ${id}`);
      throw new NotFoundException(`No se encontró la orden con identificador: ${id}`);
    }

    this.logger.log(`Deleting order with ID: ${id}`);
    
    await this.orderRepository.delete(id);
    
    this.logger.log(`Order ${id} deleted successfully`);
  }
}