# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

EXPOSE 5000

CMD [ "python3", "server.py"]
# CMD [ "tail", "-f", "/dev/null"]

# sudo docker build -t sinamics/ae-iot-backend -f Dockerfile.backend .