#!/usr/bin/bash

SERVICE_NAME="rpi-heater"
DESCRIPTION="rpi heater logic"
SERVICE_FOLDER="/opt/rpi-heater-logic/"
SERVICE_FILE="src/operation.py"
SERVICE_LOGFILE="$SERVICE_FOLDER/log/operation.log"
# check if service is active
IS_ENABLED=$(sudo systemctl is-enabled $SERVICE_NAME)
if [ "$IS_ENABLED" == "enabled" ]; then
    # restart the service
    echo "remving old config file"
    sudo rm /etc/systemd/system/${SERVICE_NAME}.service
fi

# create service file
echo "Creating service file"
sudo cat > /etc/systemd/system/${SERVICE_NAME//'"'/}.service << EOF
[Unit]
Description=$DESCRIPTION
After=nss-lookup.target
Before=network-online.target

[Service]
User=pi
Group=pi
WorkingDirectory=$SERVICE_FOLDER
ExecStartPre=/bin/bash -c 'until host google.com; do sleep 1; done'
ExecStartPre=/usr/bin/printf "\n\n Raspberry booted and online. Fetching nordpool prices... \n\n"
ExecStart=/usr/bin/python3 $SERVICE_FOLDER$SERVICE_FILE
StandardOutput=append:$SERVICE_LOGFILE
StandardError=append:$SERVICE_LOGFILE
Type=oneshot

[Install]
WantedBy=network-online.target
EOF

# restart daemon, enable and start service
echo "Reloading daemon and enabling service"
sudo systemctl daemon-reload 
sudo systemctl enable ${SERVICE_NAME//'.service'/} # remove the extension
echo "Service enabled"


exit 0