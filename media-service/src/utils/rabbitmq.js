import amqp from "amqplib";
import logger from "./logger.js";
import { RABBITMQ_URL } from "../config/config.js";

let connection = null;
let channel = null;

const EXCHANGE_NAME = "social_events_exchange";

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Connected to RabbitMQ");
    return channel;
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
  }
};

export const publishEvent = async (routingKey, message) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published to RabbitMQ: ${routingKey}`);
};

export const consumeEvent = async (routingKey, callback) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
  logger.info(`Event subscribed to RabbitMQ: ${routingKey}`);
};
