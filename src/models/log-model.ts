import { Long, ObjectId } from "mongodb";
import { ActorType } from "@src/util/enum";

/**
 * | Field         | Type     | Required | Example                                        | Detail                                                                                         |
|---------------|----------|----------|------------------------------------------------|------------------------------------------------------------------------------------------------|
| logType       | string   | true     | "ACCESS_LOG"                                   | LOG 의 타입(ACCESS_LOG, USER_ACTION_LOG, ...). 같은 logType은 params 필드의 schema가 동일해야 한다. 대문자만 사용한다. |
| createdAt     | long     | true     | 1648469807000                                  | LOG 발생 시각(Timestamp). 단위는 ms이다.                                                                |
| service       | string   | true     | "community"                                   | LOG 가 발생한 서비스. 대분류.(community, gateway, front...)                                              |
| from          | string[] | true     | ["core"]                                         | LOG 가 발생한 상세 위치. Array 형태로 대분류부터 소분류까지 상세 위치를 push 한다. 상세 내용이 없는 경우 비어있는 array를 입력한다.          |
| action        | string   | true     | "/notification-api/..."                        | ACCESS_LOG의 경우 uri를 입력한다. MANUAL_LOG의 경우에는 어떤 행위에 대한 로그인지 입력한다.                                |
| actorType     | enum     | true     | "USER"                                         | Action 을 발생시킨 주체의 타입(USER, GUEST, ADMIN, BATCH)                                                |
| actorId       | string   | false    | "10011"                                        | Actor id를 입력한다.(user의 경우 mbr_idx를 입력한다.)                                                       |
| deviceId      | string   | false    | "034ab153-2bc8-4e38-905f-bf52792cf81c"         | Device id를 입력한다.(첫 실행시 ID를 생성해서 영구저장소에 보관하며 사용한다. -- 삭제시까지 같은 ID가 사용된다)                        |
| params        | object   | true     | { "method": "GET", "header": {}, "body": ... } | 로그 원본 데이터를 JSON 형태로 입력한다.                                                                      |
| indexedParams | object   | true     | { "ACCESS_LOG": { "method": "GET", ... } }     | 로그 원본 데이터에서 ES에 인덱싱할 데이터를 JSON 형태로 입력한다.                                                       |
| uuid          | string   | true     | "d123jsdkflajxcv"                              | 로그가 가지는 고유 id값
 */

// Document
export class Log {
  constructor(
    public logType: string,
    public craetedAt: number,
    public service: string,
    public from: string[],
    public action: string,
    public actorType: ActorType,
    public actorId: string,                    
    public deviceId: string,
    public params: object,
    public indexedParams: object,
    public uuid?: ObjectId // log당 고유 id부요해서 넘어올 예정(uuid)
  ) {}
}
