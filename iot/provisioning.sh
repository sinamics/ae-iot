#!/bin/bash

set -m

sudo apt-get update -y
sudo apt install git -y
curl -fsSL https://test.docker.com -o test-docker.sh
sudo sh test-docker.sh
sudo systemctl enable docker

sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

sudo apt-get install docker-compose
sudo apt-get start docker

git clone \
  --depth 1  \
  --filter=blob:none  \
  --sparse \
  https://github.com/sinamics/ae-iot.git \
;
cd ae-iot
git sparse-checkout set iot