# Implementación de CRUD de órdenes en DynamoDB

La aplicación requiere la gestión de órdenes a través de la interfaz de usuario, persistiendo y recuperando datos en DynamoDB. Los actores involucrados son el Cliente (usuario final) y el Sistema de Gestión de Órdenes. El dominio es el de una plataforma de comercio electrónico. Las órdenes deben tener un identificador único, descripción, estado y fecha de creación. El sistema debe validar que no se creen órdenes con identificadores duplicados y que la descripción no esté vacía. En caso de error de validación, el sistema debe retornar un mensaje descriptivo. La operación de lectura debe retornar las órdenes en orden descendente por fecha de creación.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Creación de órdenes

**Objetivo:** Permitir la creación de nuevas órdenes en el sistema.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Diseñar la interfaz para la creación de órdenes.
- Implementar la lógica para validar los datos de la orden antes de persistir en DynamoDB.
- Persistir la orden en DynamoDB y manejar posibles errores de validación.

**Entregable:** Interfaz funcional para crear órdenes y persistirlas en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Conceptos de DynamoDB y su uso en aplicaciones React.
- Manejo de errores y validación de datos en frontend.

</details>

### Fase 2: Lectura de órdenes

**Objetivo:** Permitir la lectura de órdenes existentes en el sistema.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Diseñar la interfaz para la lectura de órdenes.
- Implementar la lógica para recuperar las órdenes de DynamoDB y mostrarlas en la interfaz.
- Asegurar que las órdenes se muestren en orden descendente por fecha de creación.

**Entregable:** Interfaz funcional para leer y mostrar órdenes existentes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Consultas en DynamoDB y su integración con aplicaciones React.
- Manejo de ordenamiento y presentación de datos en frontend.

</details>

### Fase 3: Actualización y eliminación de órdenes

**Objetivo:** Permitir la actualización y eliminación de órdenes existentes en el sistema.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Diseñar la interfaz para la actualización y eliminación de órdenes.
- Implementar la lógica para actualizar y eliminar órdenes en DynamoDB.
- Asegurar que los cambios se reflejen correctamente en la interfaz.

**Entregable:** Interfaz funcional para actualizar y eliminar órdenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Operaciones de actualización y eliminación en DynamoDB y su integración con aplicaciones React.
- Manejo de cambios de estado y persistencia en frontend.
- Terraform: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es una orden en el contexto de la aplicación y cómo se representa en DynamoDB?
- **paraQueSirve**: ¿Para qué sirve la gestión de órdenes en la aplicación y cómo mejora la experiencia del usuario?
- **comoSeUsa**: ¿Cómo se utiliza la interfaz para crear, leer, actualizar y eliminar órdenes?
- **queDecisionesImplica**: ¿Qué decisiones de diseño implica la implementación de las operaciones CRUD en DynamoDB desde la interfaz?

## Criterios de Evaluacion

- Implementación funcional de la creación de órdenes.
- Implementación funcional de la lectura de órdenes.
- Implementación funcional de la actualización de órdenes.
- Implementación funcional de la eliminación de órdenes.
- Validación correcta de datos antes de persistir en DynamoDB.
- Manejo adecuado de errores de validación y feedback al usuario.
- Órdenes mostradas en orden descendente por fecha de creación.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
