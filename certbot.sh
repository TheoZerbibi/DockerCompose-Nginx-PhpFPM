#!/bin/sh

docker compose run --rm certbot -d *.exemple.fr -d exemple.fr --rsa-key-size 4096 --manual --preferred-challenges dns certonly