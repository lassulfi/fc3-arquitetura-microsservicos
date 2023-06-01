import { Kafka, KafkaConfig } from 'kafkajs'

const brokers = process.env.KAFKA_BROKERS?.split(";") ||  ['localhost:9092'];

export const kafkaGroupId = process.env.KAFKA_GROUPID || "wallet";

const kafkaConfig: KafkaConfig = { brokers }
export const kafka = new Kafka(kafkaConfig);