# Mi lab de monitoreo

Aquí levanto un Docker Compose con Grafana, Prometheus y Loki para aprender cómo funciona el monitoreo de una app. Básicamente veo en tiempo real qué está pasando: métricas, logs, alertas, todo junto.

## Levantarlo

```bash
docker compose up -d --build
```

Listo. Todo sube en Docker. Una vez que está arriba, accedo a los servicios en localhost.

## Dónde está cada cosa

| Servicio       | URL                         | Para qué es                                |
|----------------|-----------------------------|-------------------------------------------|
| Frontend       | http://localhost:8080       | Mi app de prueba con botones que generan tráfico |
| API            | http://localhost:3001       | Backend con `/api/hello`, `/metrics`, `/load` |
| Grafana        | http://localhost:3000       | Dashboards y alertas (admin/admin)         |
| Prometheus     | http://localhost:9090       | La base de datos de métricas              |
| Loki           | http://localhost:3100       | Para buscar logs                           |
| Alloy          | http://localhost:12345      | El recolector de logs, estado en vivo     |
| cAdvisor       | http://localhost:8081       | Métricas por contenedor                    |
| node-exporter  | http://localhost:9100/metrics | Métricas del host                         |

## El dashboard que traigo preconfigurado

Tengo un dashboard que ya está armado. Muestra:
- Gráficos de CPU
- Logs de la app (etiquetados como `tier=application`)
- Logs de infraestructura (etiquetados como `tier=infrastructure`)

También tengo una alerta que se dispara cuando la CPU pasa del 50%.

## Cómo usarlo

1. Se ingresa a http://localhost:8080
2. Clickeo los botones para que la app haga cosas (generar tráfico, carga)
3. Voy a Grafana (http://localhost:3000) y miro los gráficos subir en vivo
4. Busco los logs correspondientes en Loki
5. Si la CPU toca 50%, la alerta se dispara

## Limpiar

```bash
docker compose down -v
```

Esto mata todo y borra los volúmenes. Los dashboards y alertas que creé desaparecen.

## Detalles técnicos

- **Prometheus**: v3.8.1 (no latest, porque latest apunta a la 2.x que es LTS)
- **Logs**: Uso Grafana Alloy (Promtail ya no se mantiene, EOL 2026-03-02)
- **Datasources**: Prometheus y Loki ya vienen conectados de fábrica