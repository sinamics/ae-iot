import mqtt, { MqttClient } from 'mqtt';
import fs from 'fs';
import path from 'path';
import RedisConnect from '@/lib/redis';
import { Socket } from 'socket.io';

const redis = RedisConnect();

const host = 'mqtt.kodea.no';
const port = '8884';
const clientId = `mqtt_nextjs`;

const connectUrl = `mqtt://${host}:${port}`;

const caFile = fs.readFileSync(path.join(process.cwd(), 'certs/ca.crt'));
const certFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.crt'));
const keyFile = fs.readFileSync(path.join(process.cwd(), 'certs/client.key'));

const topics = ['iot-rpios-100', 'iot-rpios-101'];

class Mqtt {
  private mqtt: typeof mqtt;
  private mqtt_client: mqtt.MqttClient;
  private io?: Socket;
  private connected: boolean;
  constructor(io?: Socket) {
    this.mqtt = mqtt;
    this.io = io;
    this.mqtt_client = null as any;
    this.connected = false;
    this.connect();
  }

  connect() {
    if (this.connected) return;

    this.mqtt_client = this.mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      ca: [caFile],
      cert: certFile,
      key: keyFile,
    }) as MqttClient;

    this.connected = true;
    console.log('MQTT Connected');

    this.store_messages();
  }
  store_messages() {
    this.mqtt_client.on('message', (topic: string, message: Buffer) => {
      try {
        // Validate the message and throw an error if it is not a Buffer
        if (!(message instanceof Buffer)) {
          throw new Error(
            `Invalid MQTT message: expected Buffer, received ${typeof message}`
          );
        }

        const msg = JSON.parse(message.toString('utf8'));

        // Validate the message and throw an error if it is invalid
        if (!('client_id' in msg)) {
          throw new Error('Invalid MQTT status message');
        }

        const action = topic.split('/').pop();

        switch (action) {
          case 'status':
            console.log('Storing status message in DB');
            redis.set(msg['client_id'], JSON.stringify(msg));
            break;

          default:
            break;
        }
      } catch (error) {
        // Handle any errors that occurred during message processing
        console.error(error);
      }
    });
  }
  message() {
    this.mqtt_client.on('message', (topic: string, message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString('utf8'));

        // Validate the message and throw an error if it is invalid
        if (!('client_id' in msg)) {
          throw new Error('Invalid MQTT status message');
        }

        console.log('Received message on topic: ' + topic);

        const action = topic.split('/').pop();

        // Validate the topic and throw an error if it is invalid
        if (!action) {
          throw new Error('Invalid topic');
        }

        switch (action) {
          case 'status':
            this.io?.emit('iot_broadcasting', JSON.stringify(msg));
            this.io?.emit(`${msg['client_id']}/status`, JSON.stringify(msg));
            break;

          case 'logs':
            console.log('Log message received!');
            this.io?.emit(`${msg['client_id']}/logs`, JSON.stringify(msg));
            break;
          default:
            break;
        }
      } catch (error) {
        // Handle any errors that occurred during message processing
        console.error(error);
      }
    });
  }
  subscribe() {
    topics.forEach((topic) => {
      this.mqtt_client.subscribe(`iot/${topic}/#`, (err: any, granted: any) => {
        if (err) {
          console.log('mqtt subscribe error::: ', err);
        }
        console.log(granted, 'granted');
        console.log(`Subscribe to topic '${topic}'`);
      });
    });
    this.message();
    this.un_subscribe();
  }
  publish(topic: string, message: string) {
    try {
      this.mqtt_client.publish(topic, message);
      return { status: 'mqtt message published' };
    } catch (error) {
      return error;
    }
  }
  un_subscribe() {
    this.mqtt_client.on('close', () => {
      this.connected = false;
      console.log('MQTT Connection closed by client');
      topics.forEach((topic) => {
        this.mqtt_client.unsubscribe(
          `iot/device/${topic}`,
          (err: any, granted: any) => {
            if (err) {
              console.log(err, 'err');
            }
            console.log(granted, 'granted');
            console.log(`unsubscribed to topic '${topic}'`);
          }
        );
      });
      this.mqtt_client.end();
    });
  }
}

export default Mqtt;
