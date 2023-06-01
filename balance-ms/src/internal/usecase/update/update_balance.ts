
import Balance from "../../entity/balance";
import BalanceFactory from "../../entity/balance.factory";
import BalanceNotFoundError from "../../exception/balance_not_found.error";
import BalanceGateway from "../../gateway/balance_gateway";
import { UseCase } from "../usecase.interface";
import { InputUpdateBalanceDto, OutputUpdateBalanceDto } from "./update_balance.dto";

export default class UpdateBalanceUseCase 
    implements UseCase<InputUpdateBalanceDto, OutputUpdateBalanceDto> {
    private readonly _balanceGateway: BalanceGateway

    constructor(balanceGateway: BalanceGateway) {
        this._balanceGateway = balanceGateway;
    }

    async execute(input: InputUpdateBalanceDto): Promise<OutputUpdateBalanceDto>  {
        let balance: Balance;
        try {
            balance = await this._balanceGateway.findByAccountId(input.accountId);
            await this._balanceGateway.update(balance);
        } catch (error) {
            if (error instanceof BalanceNotFoundError) {
                balance = await this.saveBalance(input);
            } else {
                throw error;
            }
        }

        return {
            id: balance.id,
            accountId: balance.accountId,
            amount: balance.amount
        }
    }

    private async saveBalance(input: InputUpdateBalanceDto) {
        const balance = BalanceFactory.createWith(input.accountId, input.amount);
        await this._balanceGateway.create(balance);
        return balance;
    }
}