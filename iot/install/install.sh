#!/bin/bash

# add contab entry
# */30 * * * * root python3 /opt/rpi-heater-logic/src/operation.py
USER=$(whoami)

echo "adding crontab job"
touch /etc/cron.d/iot
touch /var/log/aeiot.log

echo "*/5 * * * * $USER /usr/local/bin/python3 /ae-iot/iot/src/cron.py >> /var/log/aeiot.log 2>&1 " >> /etc/cron.d/iot

# grep "python3 /opt/rpi-heater-logic/src/operation.py" /etc/crontab || echo "1 * * * * $USER python3 /opt/rpi-heater-logic/src/operation.py 2>&1 >> /opt/rpi-heater-logic/log/operation.log" >> /etc/crontab
# fetching data
# cd /opt/rpi-heater-logic/src && python3 operation.py >> /opt/rpi-heater-logic/log/operation.log

# adding file to systemc for autostart during restart / boot
# cd /opt/rpi-heater-logic/install && sudo ./create-service.sh

echo "installation completed"