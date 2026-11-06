import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Order } from '../../domain/order.entity';
import { OrderService } from '../../application/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva orden',
    description: 'Crea una nueva orden en el sistema y la persiste en DynamoDB.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o orden duplicada',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const exists = await this.orderService.orderExists(createOrderDto.id);
    if (exists) {
      throw new BadRequestException(
        `Ya existe una orden con el identificador ${createOrderDto.id}`,
      );
    }
    const order = await this.orderService.createOrder(createOrderDto);
    return order;
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las órdenes',
    description:
      'Recupera todas las órdenes del sistema ordenadas por fecha de creación descendente.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de órdenes recuperada exitosamente',
    type: [Order],
  })
  async getOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una orden por ID',
    description: 'Recupera una orden específica utilizando su identificador único.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la orden (UUID)',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada exitosamente',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async getOrderById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una orden',
    description:
      'Actualiza los datos de una orden existente. Se pueden actualizar la descripción y/o el estado.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la orden (UUID)',
    type: String,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: Order,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const existingOrder = await this.orderService.getOrderById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    const updatedOrder = await this.orderService.updateOrder(id, updateOrderDto);
    return updatedOrder;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una orden',
    description: 'Elimina una orden del sistema por su identificador único.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la orden (UUID)',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const exists = await this.orderService.orderExists(id);
    if (!exists) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    await this.orderService.deleteOrder(id);
  }
}