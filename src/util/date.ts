import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import dayJSUtc from "dayjs/plugin/utc";

dayjs.extend(dayJSUtc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export const dateBySecond = dayjs().format("YYYY-MM-DD hh:mm:ss");
export const dateByDay = dayjs().format("YYYY-MM-DD");
