import { Consumer } from "kafkajs";
import { KafkaConsumer } from "./consumer";

const MockUseCase = () => {
    return {
        execute: jest.fn()
    }
};

const mockConsumer: Partial<Consumer> = {
    connect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
    disconnect: jest.fn(),
}

const getTopics = () => (["topic"])

describe("Kakfa consumer unit test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should consume message from topic", async () => {
        const useCase = MockUseCase();
        const topics = getTopics();

        const executeSpy = jest.spyOn(useCase, "execute");
        const connectSpy = jest.spyOn(mockConsumer, 'connect');
        const subscribeSpy = jest.spyOn(mockConsumer, 'subscribe');
        const runSpy = jest.spyOn(mockConsumer, 'run').mockImplementation(async (config) => {
            const eachMessageHandler = config.eachMessage as (payload: any) => Promise<void>;
            await eachMessageHandler({ message: 'Test message' });
          })

        const kafkaConsumer = new KafkaConsumer({
            consumer: mockConsumer as Consumer,
            topics,
            useCase
        });

        await kafkaConsumer.connect();

        expect(executeSpy).toHaveBeenCalled();
        expect(connectSpy).toHaveBeenCalled();
        expect(subscribeSpy).toHaveBeenCalled();
        expect(runSpy).toHaveBeenCalled();
    });

    it("should disconnect", async () => {
        const useCase = MockUseCase();
        const topics = getTopics();

        const disconnectSpy = jest.spyOn(mockConsumer, "disconnect");

        const kafkaConsumer = new KafkaConsumer({
            consumer: mockConsumer as Consumer,
            topics,
            useCase
        });

        await kafkaConsumer.disconnect();

        expect(disconnectSpy).toHaveBeenCalled();
    })
});