import { collections } from "../database/connect";
import { Log } from "../models/log-model";

/**
 * log service 로직 작성
 *
 * creat collection cron으로 주기마다 collection 생성하기
 */
export class LogService {
  constructor() {}

  public async createLogBulk(logs: Array<Log>) {
    // bulk로 log 데이터 mongodb 저장.
    const created = await collections.logs?.insertMany(logs);

    return created;
  }
}
