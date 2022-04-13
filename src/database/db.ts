/**
 * 기존의 SQS를 log pre-processor로 refactor
 *
 * #required
 * 1. cloudwatch에서 streaming된 로그를 받는다.
 * 2. mongodb로 데이터를 영구적으로 보관하도록. cron으로 주기적으로
 *
 */

import mongoose from "mongoose";
import mongodb from "mongodb";
import { Document, model, Model, Schema } from "mongoose";
// import { Long } from 'mongodb';
import { ConfigManager } from "@dawinproperty/dawin-configuration";

const uri =
  "mongodb://dawindb:54AfVcFebuVwf5R4@test-document-db.cluster-cn1ko0h0knji.ap-northeast-2.docdb.amazonaws.com:20177/es-test?authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred&appname=MongoDB%20Compass&retryWrites=false&ssl=false";
/**
 * | Field         | Type     | Required | Example                                        | Detail                                                                                         |
|---------------|----------|----------|------------------------------------------------|------------------------------------------------------------------------------------------------|
| logType       | string   | true     | "ACCESS_LOG"                                   | LOG 의 타입(ACCESS_LOG, USER_ACTION_LOG, ...). 같은 logType은 params 필드의 schema가 동일해야 한다. 대문자만 사용한다. |
| createdAt     | long     | true     | 1648469807000                                  | LOG 발생 시각(Timestamp). 단위는 ms이다.                                                                |
| service       | string   | true     | "community"                                    | LOG 가 발생한 서비스. 대분류.(community, gateway, front...)                                              |
| from          | string[] | true     | ["core"]                                        | LOG 가 발생한 상세 위치. Array 형태로 대분류부터 소분류까지 상세 위치를 push 한다. 상세 내용이 없는 경우 비어있는 array를 입력한다.          |
| action        | string   | true     | "/notification-api/..."                        | ACCESS_LOG의 경우 uri를 입력한다. MANUAL_LOG의 경우에는 어떤 행위에 대한 로그인지 입력한다.                                |
| actorType     | enum     | true     | "USER"                                         | Action 을 발생시킨 주체의 타입(USER, GUEST, ADMIN, BATCH)                                                |
| actorId       | string   | false    | "10011"                                        | Actor id를 입력한다.(user의 경우 mbr_idx를 입력한다.)                                                       |
| deviceId      | string   | false    | "034ab153-2bc8-4e38-905f-bf52792cf81c"         | Device id를 입력한다.(첫 실행시 ID를 생성해서 영구저장소에 보관하며 사용한다. -- 삭제시까지 같은 ID가 사용된다)                        |
| params        | object   | true     | { "method": "GET", "header": {}, "body": ... } | 로그 원본 데이터를 JSON 형태로 입력한다.                                                                      |
| indexedParams | object   | true     | { "ACCESS_LOG": { "method": "GET", ... } }     | 로그 원본 데이터에서 ES에 인덱싱할 데이터를 JSON 형태로 입력한다.                                                       |
| id            | string   |          | cloud watch에서 생성할 고유id 아마 uuid.
*/

const LogSchema: Schema = new Schema({
  logType: { type: String, required: true },
  ceratedAt: { type: String, required: true },
  service: { type: String, required: true },
  from: { type: [String], required: true },
  action: { type: String, required: true },
  actionType: {
    type: String,
    enum: ["USER", "GUEST", "ADMIN", "BATCH"],
    required: true,
  },
  actorId: { type: String, required: false },
  deviceId: { type: String, required: false },
  params: { type: Object, required: false },
  indexedParams: { type: Object, required: false },
});

interface ILog extends Document {
  logType: string;
  createdAt: string;
  service: string;
  from: string[];
  action: string;
  actionType: any;
  actorId: string;
  deviceId: string;
  params: object;
  indexedParams: object;
}

const LogModel: Model<ILog> = model<ILog>("Log", LogSchema);

async function connect() {
  try {
    await mongoose.connect(uri);

    // CM
    const cm = new ConfigManager("TEST");

    const config = await cm.getConfig("BANNED-WORD", "TEST", "DB");
    console.log("config info:", config);

    LogModel.find();
  } catch (e) {
    console.error("[Error]", e);
  }
}

connect();
