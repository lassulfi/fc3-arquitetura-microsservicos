
import BalanceFactory from "../../entity/balance.factory";
import BalanceGateway from "../../gateway/balance_gateway";
import { UseCase } from "../usecase.interface";
import { InputUpdateBalanceDto, OutputUpdateBalanceDto } from "./update_balance.dto";

export default class UpdateBalanceUseCase 
    implements UseCase<InputUpdateBalanceDto, OutputUpdateBalanceDto> {
    private _balanceGateway: BalanceGateway

    constructor(balanceGateway: BalanceGateway) {
        this._balanceGateway = balanceGateway;
    }

    async execute(input: InputUpdateBalanceDto): Promise<OutputUpdateBalanceDto>  {
        let balance = await this._balanceGateway.findByAccountId(input.accountId);
        if (balance) {
            balance.updateAmount(input.amount);
            await this._balanceGateway.update(balance);
        } else {
            balance = BalanceFactory.createWith(input.accountId, input.amount);
            await this._balanceGateway.create(balance);
        }
        return {
            id: balance.id,
            accountId: balance.accountId,
            amount: balance.amount
        }
    }
}