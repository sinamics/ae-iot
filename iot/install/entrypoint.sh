#!/bin/bash

# turn on bash's job control
set -m

# run operation once
echo "First Run" > /var/log/cron.log
echo "First Run" > /var/log/mqtt_sub.log

/usr/local/bin/python3 /ae-iot/iot/src/cron.py >> /var/log/cron.log
/usr/local/bin/python3 /ae-iot/iot/src/mqtt_sub.py >> /var/log/mqtt_sub.log 2>&1 &

#execute CMD
exec "$@"
