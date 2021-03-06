import { Handler, Context } from "aws-lambda";
import { LogService } from "./services/log-service";
import { Log } from "./models/log-model";
import { ActorType } from "./util/enum";
import { connectToMongo } from "./database/connect";
import { ESService } from "./services/es-service";

export const handler: Handler = async (event: any, context: Context) => {
  await connectToMongo();
  const service = new LogService();
  const es = new ESService();

  const date = new Date();
  const mock: Array<Log> = [
    {
      logType: "ACCESS_LOG",
      craetedAt: date.getTime(),
      service: "community",
      from: ["core"],
      action: "/notification-api/",
      actorType: ActorType.USER,
      actorId: "10011",
      deviceId: "034ab153-2bc8-4e38-905f-bf52792cf81c",
      params: {
        method: "GET",
        header: { "Content-Type": "application/json" },
      },
      indexedParams: {
        ACCESS_LOG: {
          method: "GET",
          header: { "Content-Type": "application/json" },
        },
      },
    },
    {
      logType: "USER_ACTION_LOG",
      craetedAt: date.getTime(),
      service: "analysis",
      from: ["core"],
      action: "/notification-api/",
      actorType: ActorType.ADMIN,
      actorId: "10001",
      deviceId: "091ab153-abc8-1e38-905e-aw52792cf81c",
      params: {
        method: "POST",
        header: { "Content-Type": "application/json" },
      },
      indexedParams: {
        ACCESS_LOG: {
          method: "POST",
          header: { "Content-Type": "application/json" },
        },
      },
    },
  ];

  const created = await service.createLogBulk(mock);
  console.log("created..", created);

  console.log("es client", await es.getEsClient());

  const esClient = await es.getEsClient();
};
