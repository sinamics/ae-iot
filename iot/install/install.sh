#!/bin/bash

set -e

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

USER=$(whoami)

# install requirements
echo "installing packages"
sudo apt update
sudo apt-get install -y git \
                    python3 \
                    python3-pip \
                    rpi.gpio

pip3 install -r ./requirements.txt

# add contab entry
# */30 * * * * root python3 /opt/rpi-heater-logic/src/operation.py

echo "adding crontab job"
# grep "python3 /opt/rpi-heater-logic/src/operation.py" /etc/crontab || echo "1 * * * * $USER python3 /opt/rpi-heater-logic/src/operation.py 2>&1 >> /opt/rpi-heater-logic/log/operation.log" >> /etc/crontab
grep "python3 src/operation.py" /etc/crontab || echo "1 * * * * $USER python3 src/operation.py 2>&1 >> /operation.log" >> /etc/crontab

# fetching data
# cd /opt/rpi-heater-logic/src && python3 operation.py >> /opt/rpi-heater-logic/log/operation.log

# adding file to systemc for autostart during restart / boot
# cd /opt/rpi-heater-logic/install && sudo ./create-service.sh

echo "installation completed"