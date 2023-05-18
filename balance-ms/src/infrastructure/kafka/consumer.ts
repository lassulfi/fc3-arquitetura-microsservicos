import { Consumer } from "kafkajs";

export interface SimpleConsumer {
    connect(): Promise<void>;
    handle(message: any): Promise<void>;
    disconnect(): Promise<void>
}

export class KafkaConsumer implements SimpleConsumer {
    private readonly consumer: Consumer

    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    handle(message: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

