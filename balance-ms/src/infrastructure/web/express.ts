import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { balanceRoute } from "./routes/balance.route";

export const app: Express = express();
app.use(express.json());
app.use("/balances", balanceRoute);

export let sequelize: Sequelize;

// TODO: implement setupDb with sequelize
async function setupDb() {

}