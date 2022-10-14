#!/bin/sh

docker compose run --rm certbot -d *.tzeribi.fr -d tzeribi.fr --rsa-key-size 4096 --manual --preferred-challenges dns certonly