import Balance from "../entity/balance";

export default interface BalanceGateway {
    findByAccountId(id: String): Promise<Balance>;
    save(balance: Balance): void;
}