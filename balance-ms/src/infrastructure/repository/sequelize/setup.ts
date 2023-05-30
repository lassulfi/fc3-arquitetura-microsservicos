import { Sequelize } from "sequelize-typescript";
import BalanceModel from "./balance.model";

export let sequelize: Sequelize

export async function setupDb() {
    const database = process.env.DB_NAME || "balance";
    const username = process.env.DB_USERNAME || "root";
    const password = process.env.DB_PASSWORD || "root";
    sequelize = new Sequelize(database, username, password, {
        dialect: 'mysql',
        logging: false
    });

    await sequelize.addModels([BalanceModel]);
    await sequelize.sync();
}