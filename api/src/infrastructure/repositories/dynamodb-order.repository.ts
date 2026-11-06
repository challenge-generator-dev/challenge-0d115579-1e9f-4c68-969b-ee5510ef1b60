import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderStatus } from '../../domain/order.entity';
import { OrderRepository } from '../../domain/order.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBOrderRepository implements OrderRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: ConfigService) {
    const dynamoDBClient = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: this.configService.get<string>('DYNAMODB_ENDPOINT'),
    });
    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE');
  }

  async create(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        id: order.id,
        description: order.description,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    try {
      await this.client.send(command);
      return order;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Order with this ID already exists');
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async findAll(): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'createdAt-index',
      ScanIndexForward: false,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': 'ORDER',
      },
    });

    try {
      const result = await this.client.send(command);
      return result.Items?.map(item => ({
        id: item.id,
        description: item.description,
        status: item.status as OrderStatus,
        createdAt: new Date(item.createdAt),
      })) || [];
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        pk: 'ORDER',
        id: id,
      },
    });

    try {
      const result = await this.client.send(command);
      if (!result.Item) {
        return null;
      }
      return {
        id: result.Item.id,
        description: result.Item.description,
        status: result.Item.status as OrderStatus,
        createdAt: new Date(result.Item.createdAt),
      };
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  async update(order: Order): Promise<Order> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        pk: 'ORDER',
        id: order.id,
      },
      UpdateExpression: 'SET description = :description, #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':description': order.description,
        ':status': order.status,
      },
      ReturnValues: 'ALL_NEW',
    });

    try {
      const result = await this.client.send(command);
      return {
        id: result.Attributes?.id,
        description: result.Attributes?.description,
        status: result.Attributes?.status as OrderStatus,
        createdAt: new Date(result.Attributes?.createdAt),
      };
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        pk: 'ORDER',
        id: id,
      },
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        pk: 'ORDER',
        id: id,
      },
      ProjectionExpression: 'id',
    });

    try {
      const result = await this.client.send(command);
      return !!result.Item;
    } catch (error) {
      throw new Error(`Failed to check order existence: ${error.message}`);
    }
  }
}