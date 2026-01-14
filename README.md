# Energy Transition Tracker

A dbt project for tracking energy transition data using DuckDB.

## Setup

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Run dbt commands using the project-local profiles.yml:
   ```bash
   uv run dbt debug --profiles-dir .
   uv run dbt run --profiles-dir .
   uv run dbt test --profiles-dir .
   ```

## Project Structure

- `models/` - dbt models (SQL transformations)
- `seeds/` - CSV files to load as tables
- `tests/` - data tests
- `macros/` - reusable SQL macros
- `snapshots/` - slowly changing dimension tables
- `analyses/` - ad-hoc queries

## Database

This project uses DuckDB as the database engine. The database file `energy_tracker.duckdb` will be created automatically when you run dbt for the first time.
