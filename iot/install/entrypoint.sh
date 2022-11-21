#!/bin/bash

# turn on bash's job control
set -m

# run operation once
echo "First Run" > /var/log/cron.log
/usr/local/bin/python3 /app/operation.py >> /var/log/cron.log

#execute CMD
exec "$@"
