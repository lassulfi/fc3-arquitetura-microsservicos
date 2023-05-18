export default class Balance {
    private _id: string;
    private _amount: number;

    constructor(id: string, amount: number) {
        this._id = id;
        this._amount = amount;
    }

    get id(): string {
        return this._id
    }

    get amount(): number {
        return this._amount
    }
}