import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  DynamoDBServiceException,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  DynamoDBDocumentClientConfig,
  TranslateConfig,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBConfig implements OnModuleInit, OnModuleDestroy {
  private readonly client: DynamoDBClient;
  private readonly documentClient: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly region: string;
  private readonly endpoint: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    this.endpoint = this.configService.get<string>('DYNAMODB_ENDPOINT');
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'orders');

    const clientConfig: DynamoDBClientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'local',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'local',
      },
    };

    if (this.endpoint) {
      clientConfig.endpoint = this.endpoint;
      clientConfig.tls = false;
    }

    this.client = new DynamoDBClient(clientConfig);

    const translateConfig: TranslateConfig = {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    };

    const documentClientConfig: DynamoDBDocumentClientConfig = {
      client: this.client,
      ...translateConfig,
    };

    this.documentClient = DynamoDBDocumentClient.from(this.client, translateConfig);
  }

  async onModuleInit(): Promise<void> {
    try {
      const isLocal = !!this.endpoint;
      if (isLocal) {
        console.log(`DynamoDB Config initialized: endpoint=${this.endpoint}, region=${this.region}`);
      } else {
        console.log(`DynamoDB Config initialized: region=${this.region}, table=${this.tableName}`);
      }
    } catch (error) {
      console.error('Failed to initialize DynamoDB client:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.client.destroy();
    console.log('DynamoDB client destroyed');
  }

  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }

  getTableName(): string {
    return this.tableName;
  }

  getClient(): DynamoDBClient {
    return this.client;
  }

  isLocalMode(): boolean {
    return !!this.endpoint;
  }
}