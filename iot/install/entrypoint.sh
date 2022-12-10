#!/bin/bash

# turn on bash's job control
set -m

# run operation once
echo "First Run" > /var/log/aeiot.log

/usr/local/bin/python3 /ae-iot/iot/src/mqtt_sub.py |tee -a /var/log/aeiot.log 2>&1 &

/usr/local/bin/python3 /ae-iot/iot/src/cron.py |tee -a /var/log/aeiot.log

cron

# # Wait for any process to exit
# wait -n
  
# # Exit with status of process that exited first
# exit $?

#execute CMD
# exec "$@"

# now we bring the primary process back into the foreground
# and leave it there
fg %1