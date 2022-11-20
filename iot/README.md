# rpi installation

run these commands in rpi terminal

```bash
sudo apt update && sudo apt install git

cd /opt && git clone https://github.com/sinamics/rpi-heater-logic.git

cd /opt/rpi-heater-logic/install 

sudo ./install.sh
```

Configure RPI pins in `config.yaml` file

This program will compare electricity and parafin price every full hour and set the GPIO pins