#!/bin/bash

set -m

sudo apt-get update -y
sudo apt install git -y
curl -fsSL https://test.docker.com -o test-docker.sh
sudo sh test-docker.sh
sudo systemctl enable docker

sudo usermod -aG docker $USER
newgrp docker

sudo apt-get install docker-compose
sudo apt-get start docker

sudo git clone \
  --depth 1  \
  --filter=blob:none  \
  --sparse \
  https://github.com/sinamics/ae-iot.git \
;

cd ae-iot
sudo git sparse-checkout set iot

sudo chmod +x provisioning.sh

read -p 'type client id (without spaces): ' client_id

sed -i "/^\(client_id: \).*/s//\1'$client_id'/" config.yml