# NGINX + Node App with Docker Compose

## Run certbot
First we need to run certbot certification, modify hostname in `certbot.sh`
and run :
```bash
./certbot.sh
```

## Run all containers
Command for running all containers
```bash
docker compose up nginx php proxy -d
```

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```

# Explications

## . NGINX .
This container using latest version of nginx image.
Port 80 (http) and 443 (SSL) are open by this container.

- `./nginx/conf/nginx.conf` : Is the global nginx configuration file.
- `./nginx/www/` : Is the Nginx conf for domain or subdomain. There is 3 exemple, the default `exemple.fr`, the subdomain exemple `sub.exemple.fr` and proxy exemple `proxy.exemple.fr`.
- `./nginx/sites/` : Is the folder which contains site files. Each folder contains two folders, log folder -> contains the logs and html folder -> contains site files.
- `./certbot/www` , `./certbot/conf/` : Certbot files, this folder is auto generate by `cerbot.sh` script.

This container is link to php and proxy container.

## . PHP .
This container using the 8 version of php-fpm

- `./nginx/sites/` : Is the folder which contains site files. PHP need it for interpret the PHP files.

## . CERTBOT .
This container using ARM image of certbot.
Is using for generate SSL certificate for sites

- `./certbot/www/` , `./certbot/conf/` : These folder are auto-generate by certbot.

## . PROXY42
This container is a NodeJS Application.
It launches the Dockerfile located in the proxy42 folder.

