# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
- `client` expone http:
  - `GET /orders`
  - `POST /orders`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/infrastructure/controllers/order.controller.ts` — `OrderService.orderExists`: Se invoca `orderExists` sobre `OrderService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order.controller.ts` — `OrderService.getAllOrders`: Se invoca `getAllOrders` sobre `OrderService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/features/orders/hooks/useOrders.ts` — `Order.find`: Se invoca `find` sobre `Order`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/store/orderStore.ts` — `Order.map`: Se invoca `map` sobre `Order`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/store/orderStore.ts` — `Order.filter`: Se invoca `filter` sobre `Order`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/store/orderStore.ts` — `Order.find`: Se invoca `find` sobre `Order`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261106172943501), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de CRUD de órdenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Creación de órdenes — objetivo: Permitir la creación de nuevas órdenes en el sistema. — entregable (NO resolver): Interfaz funcional para crear órdenes y persistirlas en DynamoDB.
- Fase 2: Lectura de órdenes — objetivo: Permitir la lectura de órdenes existentes en el sistema. — entregable (NO resolver): Interfaz funcional para leer y mostrar órdenes existentes en DynamoDB.
- Fase 3: Actualización y eliminación de órdenes — objetivo: Permitir la actualización y eliminación de órdenes existentes en el sistema. — entregable (NO resolver): Interfaz funcional para actualizar y eliminar órdenes en DynamoDB.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "orders-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/src/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/src/main.js",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^7.4.0",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "@aws-sdk/client-dynamodb": "^3.572.0",
    "@aws-sdk/lib-dynamodb": "^3.572.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "@nestjs/config": "^3.2.2",
    "typeorm": "^0.3.20"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.7",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.5"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitThis": true,
    "noImplicitOverride": true,
    "moduleResolution": "node"
  },
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*-spec.ts"
  ]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './infrastructure/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API para gestión de órdenes en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap().catch(err => {
  console.error('Error starting application:', err);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/order.entity.ts ===
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

// === ARCHIVO: api/src/domain/order.repository.ts ===
import { Order } from './order.entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// === ARCHIVO: api/src/infrastructure/repositories/dynamodb-order.repository.ts ===
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

// === ARCHIVO: api/src/infrastructure/dto/create-order.dto.ts ===
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

// === ARCHIVO: api/src/infrastructure/dto/update-order.dto.ts ===
import { IsString, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Nueva descripción de la orden',
    example: 'Actualización: orden de compra de accesorios',
    minLength: 1,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(1, { message: 'La descripción debe tener al menos 1 carácter' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Nuevo estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'El estado debe ser un valor válido de OrderStatus' })
  status?: OrderStatus;
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
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

// === ARCHIVO: api/src/infrastructure/config/dynamodb.config.ts ===
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

// === ARCHIVO: api/src/infrastructure/exceptions/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    this.logger.warn(
      `HTTP ${status} - ${request.method} ${request.url} - ${message}`,
    );

    response.status(status).json(responseBody);
  }
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { DynamoDBOrderRepository } from './infrastructure/repositories/dynamodb-order.repository';
import { OrderRepository } from './domain/order.repository';
import { DynamoDBConfig } from './infrastructure/config/dynamodb.config';
import { GlobalExceptionFilter } from './infrastructure/exceptions/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: DynamoDBOrderRepository,
    },
    DynamoDBConfig,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        validateCustomDecorators: true,
        stopAtFirstError: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [OrderService, OrderRepository, DynamoDBConfig],
})
export class AppModule {}

// === ARCHIVO: api/src/application/order.service.ts ===
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

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "..",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.(t|j)s",
    "!src/main.ts"
  ],
  "coverageDirectory": "../coverage",
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/../src/$1"
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "order-management-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "coverage": "vitest run --coverage"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.23.1",
    "zustand": "^4.5.2",
    "axios": "^1.7.2",
    "react-hook-form": "^7.51.5",
    "@hookform/resolvers": "^3.6.0",
    "zod": "^3.23.8",
    "@tanstack/react-query": "^5.40.1",
    "@tanstack/react-query-devtools": "^5.40.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.3.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "@testing-library/react": "^15.0.7",
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/user-event": "^14.5.2",
    "vitest": "^1.6.0",
    "jsdom": "^24.1.0"
  }
}


// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', 'axios']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/src/main.tsx ===
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './app/App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

// === ARCHIVO: client/src/app/App.tsx ===
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { OrdersList } from '@/features/orders/OrdersList';
import { CreateOrderForm } from '@/features/orders/CreateOrderForm';
import { UpdateOrderForm } from '@/features/orders/UpdateOrderForm';

function App() {
  const { orders, isLoading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useOrderStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión de Órdenes</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <OrdersList
                orders={orders}
                isLoading={isLoading}
                error={error}
                onRefresh={fetchOrders}
                onDelete={deleteOrder}
              />
            }
          />
          <Route
            path="/orders/new"
            element={
              <CreateOrderForm
                onSubmit={createOrder}
              />
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <UpdateOrderForm
                orders={orders}
                onUpdate={updateOrder}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Plataforma de gestión de órdenes para comercio electrónico" />
    <meta name="keywords" content="e-commerce, orders, gestión, tienda" />
    <meta name="author" content="Team Development" />
    <meta name="theme-color" content="#2563eb" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="apple-touch-icon" href="/vite.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Gestión de Órdenes</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f8fafc;
        color: #1e293b;
        line-height: 1.6;
      }
      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a;
          color: #f1f5f9;
        }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/OrdersList.tsx ===
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

// === ARCHIVO: client/src/features/orders/CreateOrderForm.tsx ===
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

// === ARCHIVO: client/src/features/orders/UpdateOrderForm.tsx ===
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

// === ARCHIVO: client/src/services/order.service.ts ===
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface Order {
  id: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  id: string;
  description: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateOrderDto {
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface ApiError {
  message: string;
  code?: string;
}

class OrderService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message 
          ?? error.message 
          ?? 'Error desconocido al procesar la solicitud';
        return Promise.reject(new Error(message));
      }
    );
  }

  async fetchOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/orders');
    return response.data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const response = await this.client.post<Order>('/orders', dto);
    return response.data;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order> {
    const response = await this.client.put<Order>(`/orders/${id}`, dto);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useCallback, useState } from 'react';
import { orderService, Order, CreateOrderDto, UpdateOrderDto } from '@/services/order.service';

interface UseOrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface UseOrdersActions {
  fetchOrders: () => Promise<void>;
  createOrder: (dto: CreateOrderDto) => Promise<Order>;
  updateOrder: (id: string, dto: UpdateOrderDto) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
}

export type UseOrdersReturn = UseOrdersState & UseOrdersActions;

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.fetchOrders();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (dto: CreateOrderDto): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!dto.id || dto.id.trim() === '') {
        throw new Error('El identificador de la orden es requerido');
      }
      if (!dto.description || dto.description.trim() === '') {
        throw new Error('La descripción de la orden es requerida');
      }
      const existingOrder = orders.find((o) => o.id === dto.id);
      if (existingOrder) {
        throw new Error(`Ya existe una orden con el identificador "${dto.id}"`);
      }
      const newOrder = await orderService.createOrder(dto);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orders]);

  const updateOrder = useCallback(async (id: string, dto: UpdateOrderDto): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrder(id, dto);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await orderService.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la orden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    clearError,
  };
}

// === ARCHIVO: client/src/shared/components/ErrorMessage.tsx ===
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  className = '' 
}) => {
  if (!message) {
    return null;
  }

  return (
    <div 
      role="alert"
      aria-live="assertive"
      className={`error-message-container ${className}`}
      style={{
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#991b1b',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Cerrar mensaje de error"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#991b1b',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fecaca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.28 3.22a.75.75 0 00-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 101.06 1.06L8 9.06l3.72 3.72a.75.75 0 101.06-1.06L9.06 8l3.72-3.72a.75.75 0 00-1.06-1.06L8 6.94 4.28 3.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};

// === ARCHIVO: client/src/shared/hooks/useForm.ts ===
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

// === ARCHIVO: client/src/store/orderStore.ts ===
import { create } from 'zustand';
import { Order, CreateOrderDto, UpdateOrderDto } from '../services/order.service';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface OrderActions {
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updatedOrder: Order) => void;
  removeOrder: (id: string) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
  reset: () => void;
}

type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
};

export const useOrderStore = create<OrderStore>((set) => ({
  ...initialState,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
    totalCount: state.totalCount + 1,
  })),

  updateOrder: (id, updatedOrder) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === id ? updatedOrder : order
    ),
    selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
  })),

  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter((order) => order.id !== id),
    selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    totalCount: Math.max(0, state.totalCount - 1),
  })),

  setSelectedOrder: (order) => set({ selectedOrder: order }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setTotalCount: (count) => set({ totalCount: count }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setPageSize: (size) => set({ pageSize: size }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));

// Selectores derivados para uso eficiente
export const selectOrders = (state: OrderStore) => state.orders;
export const selectSelectedOrder = (state: OrderStore) => state.selectedOrder;
export const selectIsLoading = (state: OrderStore) => state.isLoading;
export const selectError = (state: OrderStore) => state.error;
export const selectTotalCount = (state: OrderStore) => state.totalCount;
export const selectCurrentPage = (state: OrderStore) => state.currentPage;
export const selectPageSize = (state: OrderStore) => state.pageSize;

// Selectores con lógica derivada
export const selectHasOrders = (state: OrderStore) => state.orders.length > 0;
export const selectIsEmpty = (state: OrderStore) => state.orders.length === 0 && !state.isLoading;
export const selectTotalPages = (state: OrderStore) => 
  Math.ceil(state.totalCount / state.pageSize);
export const selectCanGoNext = (state: OrderStore) => 
  state.currentPage < Math.ceil(state.totalCount / state.pageSize);
export const selectCanGoPrev = (state: OrderStore) => state.currentPage > 1;

// Selectores para filtrado y ordenamiento
export const selectOrdersByStatus = (status: string) => (state: OrderStore) =>
  state.orders.filter((order) => order.status === status);

export const selectRecentOrders = (limit: number) => (state: OrderStore) =>
  [...state.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

// Selectores para obtener una orden por ID
export const selectOrderById = (id: string) => (state: OrderStore) =>
  state.orders.find((order) => order.id === id) ?? null;

// === ARCHIVO: client/src/index.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
