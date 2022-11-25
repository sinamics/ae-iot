
# install docker

```bash
curl -fsSL https://test.docker.com -o test-docker.sh
sudo sh test-docker.sh
sudo systemctl enable docker

# add user to docker
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# docker compose
sudo apt-get install docker-compose
sudo apt-get start docker

# sudo apt-get install libffi-dev libssl-dev
# sudo apt install python3-dev
# sudo apt-get install -y python3 python3-pip
# sudo pip3 install docker-compose

```