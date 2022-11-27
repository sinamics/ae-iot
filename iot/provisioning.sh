#!/bin/bash

set -m

sudo apt-get update -y
sudo apt install git -y

if [[ $(which docker) && $(docker --version) ]]; then
    echo "Docker is already installed"

  else
    echo "Install docker"
    curl -fsSL https://test.docker.com -o test-docker.sh
    sudo sh test-docker.sh
    sudo systemctl enable docker

    sudo usermod -aG docker $USER
    newgrp docker

    sudo apt-get install docker-compose
    sudo apt-get start docker
fi

sudo git clone \
  --depth 1  \
  --filter=blob:none  \
  --sparse \
  https://github.com/sinamics/ae-iot.git \
;

cd ae-iot
sudo git sparse-checkout set iot

# sudo chmod +x iot/provisioning.sh
printf "\n\n"
read -p 'type client id (without spaces) NOTE! has to start iot: ' client_id

sudo sed -i "/^\(client_id: \).*/s//\1'$client_id'/" $(pwd)/iot/config.yaml

sudo mkdir iot/storage
sudo wget --no-check-certificate 'https://drive.google.com/uc?export=download&id=1Q7fuNFhPw9tSmDQy1b_IjTnaktGbfwWG' -O iot/storage/certs.tar.gz
sudo tar -xvf iot/storage/certs.tar.gz -C iot/storage


cd iot
# docker-compose up -d