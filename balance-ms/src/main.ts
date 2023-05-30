import { bootstrap } from "./bootstrap";
import { setupDb } from "./infrastructure/repository/sequelize/setup";
import { listen } from "./infrastructure/web/server";

bootstrap();

setupDb();

listen();