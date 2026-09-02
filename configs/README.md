# Portal configuration

The checked-in JSON files contain placeholders instead of credentials. Set
the following environment variables at runtime, or provide a separate JSON
file that contains the values outside Git:

- `CAFE_PORTAL_APP_SECRET`
- `CAFE_PORTAL_DB_PASSWORD`
- `CAFE_PORTAL_DB_HOST`
- `CAFE_PORTAL_DB_PORT`
- `CAFE_PORTAL_DB_USERNAME`
- `CAFE_PORTAL_DB_DATABASE`
- `CAFE_PORTAL_CAFE_WORKER_URL`
- `CAFE_PORTAL_LOG_DIR`
- `CAFE_PORTAL_PORT`

The map view reads `VUE_APP_MAPBOX_TOKEN` at frontend build time. Do not put
that token in tracked source files.
