import * as MongoDB from "mongodb";
import { ConfigManager } from "@dawinproperty/dawin-configuration";
import { dateByDay, dateBySecond } from "../util/date";

/**
 * service 외부에서 collection 접근을 위해 connection 생성 시 log collection
 */
export const collections: { logs?: MongoDB.Collection } = {};

export async function connectToMongo() {
  console.log("connecting mongo....");
  // ConfigManager에서 mongo url 불러와 connect
  const cm = new ConfigManager();
  const config = await cm.getConfig("PRE-PROCESSOR-SERVICE", "TEST", "MAIN-DB");
  const URL = config?.contents?.url;
  const client: MongoDB.MongoClient = new MongoDB.MongoClient(URL);

  try {
    await client.connect();
    //FIXME: db name, collection name도 CM에 저장
    const db: MongoDB.Db = client.db("es-test");

    /**
     * log collection 추가
     * collection 주기 monthly별로 생성. ES의 index는 daily
     *
     * cloudwatch에서 데이터 들어올때 날짜 체크해서 생성.
     */
    const logCollection: MongoDB.Collection = db.collection(
      `logs-${dateByDay}`
    );

    collections.logs = logCollection;

    console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${logCollection.collectionName}`
    );
  } catch (e) {
    console.error("[Error] Can not connect to mongoDB");
  }
}
