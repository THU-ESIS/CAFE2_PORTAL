# Portal configuration

`config.json` and `config.local.json` in this archive contain placeholders for
the database password and application secret. Supply real values outside Git
when deploying the Portal; do not commit production credentials.

The current server snapshot uses the external data volume at `/CAFE_DATA`.
This repository intentionally does not include that data or generated runtime
directories such as `dist`, `temp`, `sessions`, and `node_modules`.
