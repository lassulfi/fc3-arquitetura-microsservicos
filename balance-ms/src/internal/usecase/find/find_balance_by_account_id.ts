import BalanceGateway from "../../gateway/balance_gateway";
import { UseCase } from "../usecase.interface";
import { InputFindBalanceByAccountIdDto, OutputFindBalanceByAccountIdDto } from "./find_balance_by_account_id.dto";

export default class FindBalanceByAccountIdUseCase 
    implements UseCase<InputFindBalanceByAccountIdDto, OutputFindBalanceByAccountIdDto> {

    private _balanceGateway: BalanceGateway

    constructor(balanceGateway: BalanceGateway) {
        this._balanceGateway = balanceGateway;
    }

    async execute(input: InputFindBalanceByAccountIdDto): Promise<OutputFindBalanceByAccountIdDto> {
        const { accountId } = input;
        const balance = await this._balanceGateway.findByAccountId(accountId);
        return {
            id: balance.id,
            accountId: balance.accountId,
            balance: {
                amount: balance.amount
            }
        };
    }
}