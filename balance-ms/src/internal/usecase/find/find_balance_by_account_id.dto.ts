export interface InputFindBalanceByAccountIdDto {
    accountId: string
}

export interface OutputFindBalanceByAccountIdDto {
    id: string;
    accountId: string;
    balance: {
        amount: number;
    };
}