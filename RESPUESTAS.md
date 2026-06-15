# Entrega - Laboratorio de Observabilidad INFRA

## Preguntas y Respuestas

### 1. ¿Por qué necesitamos Loki además de Prometheus si ya tenemos `/metrics`?

Prometheus solo almacena **métricas numéricas** (números en el tiempo: CPU%, peticiones/seg, latencia). Loki almacena **logs** (líneas de texto: eventos, errores, trazas de ejecución).

Las métricas responden "¿cuántas peticiones hubo?" pero los logs responden "¿qué pasó exactamente en la petición 42?". Necesitamos ambos para observabilidad completa.

### 2. ¿Qué ventaja aporta que las fuentes de datos de Grafana estén aprovisionadas como código?

Si alguien necesita replicar el laboratorio, no tiene que hacer clic 20 veces en la UI de Grafana. Solo hace `docker compose up` y ya están los datasources (Prometheus y Loki) conectados automáticamente. Esto es **reproducible, versionable y automático**. Si el proyecto cambia, cambias el código, no la UI.

### 3. El panel "CPU contenedor" y el panel "CPU host" pueden mostrar valores muy distintos. ¿Por qué? ¿Cuál usarías para alertar sobre una aplicación concreta?

El panel "CPU contenedor" mide solo el backend. El "CPU host" mide toda la máquina (backend, frontend, prometheus, grafana, loki, alloy, etc.). El backend puede usar 5% pero el host 80% porque otros servicios también consumen.

Para alertar sobre una **aplicación concreta** (el backend), usaría **"CPU contenedor"**. Si quisiera saber si la máquina completa está saturada, usaria **"CPU host"**.

### 4. ¿Qué diferencia hay entre el *evaluation interval* y el *pending period* de una alarma?

- **Evaluation interval** (10s): Cada cuánto tiempo Grafana evalúa la regla. Si es 10s, revisa la condición cada 10 segundos.
- **Pending period** (30s): Cuánto tiempo la condición debe ser TRUE antes de pasar a "Firing". Evita falsas alarmas por picos cortos. Si CPU > 50% durante 30s, recién ahí dispara la alarma.

Ejemplo: CPU sube a 80% por 5 segundos, luego baja. Con pending period de 30s, no dispara. Así evitamos alarmas por ruido.

---

## Instrucciones para Validar el Trabajo

### 1. Verificar que el stack está completo

```bash
# Clonar el repositorio
git clone https://github.com/Angeltr1248/INFRA-S10.git
cd INFRA-S10

# Levantar el stack
docker compose up -d --build

# Verificar que todos los servicios estén UP
docker compose ps
```

Deberían verse 8 contenedores en estado `Up`:
- lab-backend
- lab-frontend
- lab-prometheus
- lab-loki
- lab-grafana
- lab-alloy
- lab-cadvisor
- lab-node-exporter

### 2. Verificar que el Frontend funciona

```bash
curl http://localhost:8080
```

Debería devolver el HTML del frontend con header "INFRA" y fondo verde.

### 3. Verificar que el Backend funciona

```bash
curl http://localhost:3001/api/hello?name=test
```

Debería devolver:
```json
{"message":"Hola, test!","from":"backend","time":"..."}
```

### 4. Verificar Prometheus

Abre http://localhost:9090 y busca la métrica:
http_requests_total{job="backend"}

Deberías ver una gráfica con datos.

### 5. Verificar Grafana y Dashboard

Abre http://localhost:3000 (admin/admin).

Ve a **Dashboards → INFRA - Observabilidad**.

Deberías ver dos paneles:
- **CPU Backend (%)**: Un gauge mostrando porcentaje de CPU
- **INFRA - Observabilidad**: Un gráfico de línea con peticiones HTTP

### 6. Generar datos y ver en tiempo real

En http://localhost:8080:
- Haz clic en **"Saludar a la API"** 5 veces
- Haz clic en **"Generar carga CPU"**

En Grafana:
- El panel de CPU debería subir (acercarse al rojo)
- El panel de peticiones debería mostrar líneas nuevas

### 7. Verificar el código en GitHub

Accede a: https://github.com/Angeltr1248/INFRA-S10

Verifica que existe:
- `docker-compose.yml` - Stack completo
- `apps/backend/` - API con Prometheus
- `apps/frontend/` - Interfaz HTML verde
- `prometheus/prometheus.yml` - Config de scraping
- `loki/loki-config.yaml` - Config de logs
- `alloy/config.alloy` - Recolector de logs
- `grafana/provisioning/` - Datasources automáticos
- `README.md` - Documentación completa

### 8. Verificar el flujo Git

En la terminal:

```bash
git log --oneline
```

Deberías ver commits como:
- `feat: agregar backend...`
- `feat: agregar frontend...`
- `docs: README completo...`

---

## Resumen de lo Entregado

**Stack completo** con 8 servicios en Docker Compose
**Backend API** instrumentado con Prometheus
**Frontend** con interfaz HTML interactiva (fondo verde, header INFRA)
**Prometheus** scrapeando 5 jobs (prometheus, node-exporter, cadvisor, backend, frontend)
**Loki + Alloy** recolectando logs de contenedores
**Grafana** con datasources provisionados automáticamente
**Dashboard** "INFRA - Observabilidad" con 2 paneles (CPU, Peticiones)
**GitHub Flow** + Conventional Commits en todo el desarrollo
**README.md** con documentación completa
**Todas las preguntas** respondidas

---

## Tecnologías Usadas

- **Docker Compose**: Orquestación de 8 servicios
- **Express.js**: Backend y Frontend en Node
- **Prometheus**: Base de datos de métricas
- **Loki**: Almacén de logs
- **Grafana**: Visualización y dashboards
- **Alloy**: Recolector de logs
- **Git + GitHub**: Control de versiones con GitHub Flow

---

## URL del Repositorio

**GitHub**: https://github.com/Angeltr1248/INFRA-S10

---
