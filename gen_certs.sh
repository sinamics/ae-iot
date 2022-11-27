#!/bin/bash

IP="mqtt.kodea.no"
SUBJECT_CA="/C=NO/ST=Kristiansand/L=Kristiansand/O=kodea/OU=CA/CN=$IP"
SUBJECT_SERVER="/C=NO/ST=Kristiansand/L=Kristiansand/O=kodea/OU=Server/CN=$IP"
SUBJECT_CLIENT="/C=NO/ST=Kristiansand/L=Kristiansand/O=kodea/OU=Client/CN=$IP"

DAYS=7300
mkdir certs

function generate_CA () {
   echo "$SUBJECT_CA"
   openssl req -x509 -nodes -sha256 -newkey rsa:2048 -subj "$SUBJECT_CA"  -days "$DAYS" -keyout certs/ca.key -out certs/ca.crt
}

function generate_server () {
   echo "$SUBJECT_SERVER"
   openssl req -nodes -sha256 -new -subj "$SUBJECT_SERVER" -keyout certs/server.key -out certs/server.csr
   openssl x509 -req -sha256 -in certs/server.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/server.crt -days "$DAYS"
}

function generate_client () {
   echo "$SUBJECT_CLIENT"
   openssl req -new -nodes -sha256 -subj "$SUBJECT_CLIENT" -out certs/client.csr -keyout certs/client.key 
   openssl x509 -req -sha256 -in certs/client.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/client.crt -days "$DAYS"
}

generate_CA
generate_server
generate_client
