import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "balance"
})
export default class BalanceModel extends Model {

    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare accountId: string;

    @Column({ allowNull: false })
    declare amount: number;
}