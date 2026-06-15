# INFRA - Laboratorio de Observabilidad

Un stack completo de monitoreo que te muestra cómo funcionan Prometheus, Loki y Grafana en tiempo real. Frontend interactivo, backend instrumentado, todo corriendo en Docker.

## Qué necesitas

- Docker y Docker Compose
- Navegador web
- Los puertos 8080, 3001, 3000, 9090, 3100 disponibles

## Arrancar

```bash
docker compose up -d --build
```

Espera 30 segundos y verifica:

```bash
docker compose ps
```

Todos los contenedores deben estar en estado `Up`.

## Dónde puedo entrar

- **Frontend**: http://localhost:8080 - La interfaz para generar tráfico
- **Grafana**: http://localhost:3000 - Dashboards (admin/admin)
- **Prometheus**: http://localhost:9090 - Métricas en tiempo real
- **Backend API**: http://localhost:3001 - La API que monitoreas
- **Loki**: http://localhost:3100 - Almacén de logs
- **Alloy**: http://localhost:12345 - Recolector de logs
- **cAdvisor**: http://localhost:8081 - Métricas de contenedores
- **node-exporter**: http://localhost:9100/metrics - Métricas del host

## Cómo usarlo

### Generar datos

Abre http://localhost:8080. Verás tres botones:

- **Saludar a la API**: Hace peticiones al backend. Haz clic varias veces.
- **Generar carga CPU**: Quema CPU durante 30 segundos. Usa esto para ver la métrica de CPU subir en Grafana.
- **Limpiar**: Limpia la salida en pantalla.

### Ver métricas

Ve a http://localhost:9090 y prueba buscar:

- `http_requests_total` - Peticiones HTTP que recibe el backend
- `http_request_duration_seconds` - Cuánto tardan las peticiones
- `container_cpu_usage_seconds_total` - CPU del contenedor backend
- `node_cpu_seconds_total` - CPU de la máquina host

### Dashboard en Grafana

Accede a http://localhost:3000 (admin/admin).

Ve a **Dashboards** y abre **INFRA - Observabilidad**. Encontrarás:

- **CPU Backend (%)**: Gauge que muestra cuánta CPU está usando el backend
- **INFRA - Observabilidad**: Gráfico de peticiones HTTP en el tiempo

Si quieres crear paneles nuevos:

1. Haz clic en **Add visualization**
2. Elige Prometheus o Loki como data source
3. Escribe la métrica o query que quieres ver
4. Ajusta el título y guarda

## Cómo están conectados los servicios
Frontend (8080)-> Grafana (3000)Backend (3001) -> Prometheus scrapping cada 5s->Alloy (recoge logs de contenedores)
→ Prometheus (9090) → Grafana (3000)
→ Loki (3100) → Grafana (3000)

## Flujo de desarrollo

Este proyecto usa **GitHub Flow** + **Conventional Commits**.

Para agregar cambios:

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/lo-que-hagas

# Hacer cambios y probar
# ...

# Commitear
git add .
git commit -m "feat: descripción de qué agregaste"

# Push
git push -u origin feature/lo-que-hagas

# En GitHub: crear PR → merge → sync local
git checkout develop && git pull origin develop
```

**Tipos de commit:**
- `feat:` - Algo nuevo
- `fix:` - Arreglaste un error
- `docs:` - Documentación
- `chore:` - Configuración
- `test:` - Pruebas

## Archivos del proyecto

├── docker-compose.yml - Define todos los servicios

├── README.md - Este archivo

├── apps/

│   ├── backend/ - API que monitoreas

│   │   ├── Dockerfile

│   │   ├── package.json

│   │   └── server.js

│   └── frontend/          - Interfaz web

│       ├── Dockerfile

│       ├── package.json

│       └── server.js

├── prometheus/

│   └── prometheus.yml     - Config de qué scrappear

├── loki/

│   └── loki-config.yaml   - Config de almacén de logs

├── alloy/

│   └── config.alloy       - Recolector de logs

└── grafana/

└── provisioning/      - Datasources automáticos

## Comandos útiles

Levantar:
```bash
docker compose up -d --build
```

Ver logs de un servicio:
```bash
docker compose logs -f backend
docker compose logs -f grafana
```

Detener sin borrar:
```bash
docker compose down
```

Reset total:
```bash
docker compose down -v
```

Entrar a un contenedor:
```bash
docker compose exec backend sh
```

## Si algo sale mal entonces...

Servicios no arrancan:
```bash
docker compose logs grafana
docker compose logs prometheus
```

No hay datos en Prometheus:
- Ve a http://localhost:9090/targets
- Verifica que todos estén `UP`

No hay logs en Loki:
```bash
docker compose logs alloy
```

Puerto ya está en uso:
- Edita docker-compose.yml y cambia los puertos
- Ejemplo: `"8081:8080"` en lugar de `"8080:8080"`

## Recursos

- [Prometheus](https://prometheus.io/docs/)
- [Loki](https://grafana.com/docs/loki/)
- [Grafana](https://grafana.com/docs/grafana/)
- [Alloy](https://grafana.com/docs/alloy/)

---