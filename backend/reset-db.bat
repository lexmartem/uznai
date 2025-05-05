@echo off
echo Resetting database...

REM Terminate existing connections
psql -U postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'uznai' AND pid <> pg_backend_pid();"

REM Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS uznai;"
psql -U postgres -c "CREATE DATABASE uznai;"

echo Database reset complete!
echo You can now restart your Spring Boot application. 