import { LogService } from "./services/log-service";
import { Log } from "./models/log-model";
import { ActorType } from "./util/enum";
import { connectToMongo } from "./database/connect";
import { ESService } from "./services/es-service";

(async () => {
  // const service = Container.get(LogService);
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

  const mock2: Array<Log> = [
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

  setTimeout(async () => {
    await service.createLogBulk(mock2);
  }, 2000);

  const esClient = await es.getEsClient();

  await esClient.index({
    index: "dawin-logs",
    body: {
      character: "Ned Stark",
      quote: "Winter is coming.",
    },
  });

  await esClient.index({
    index: "dawin-logs",
    body: {
      character: "Daenerys Targaryen",
      quote: "I am the blood of the dragon.",
    },
  });
})();
