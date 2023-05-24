import { Consumer, EachMessagePayload } from "kafkajs";
import { SimpleConsumer } from "./consumer.interface";
import { UseCase } from "../../internal/usecase/usecase.interface";

type KafkaConsumerProps = {
    consumer: Consumer,
    topics: string[],
    useCase: UseCase<any, any>,
}

export class KafkaConsumer implements SimpleConsumer {
    private readonly _consumer: Consumer;
    private _topics: string[];
    private _useCase: UseCase<any, any>

    constructor({consumer, topics, useCase}: KafkaConsumerProps) {
        this._consumer = consumer;
        this._topics = topics;
        this._useCase = useCase;
    }

    async connect(): Promise<void> {
        await this._consumer.connect();

        await this._consumer.subscribe({topics: this._topics})

        await this._consumer.run({eachMessage: payload => this.handle(payload)})
    }

    async handle({message}: EachMessagePayload): Promise<void> {
         await this._useCase.execute(message);
    }

    async disconnect(): Promise<void> {
        await this._consumer.disconnect();
    }

}

