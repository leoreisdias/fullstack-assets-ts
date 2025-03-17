import { utcToZonedTime } from "date-fns-tz";

/* 
Main TimeZones: 
America/New_York
America/Los_Angeles
America/Chicago
America/Denver
America/Toronto
Europe/London
Europe/Paris
Europe/Berlin
Asia/Tokyo
Asia/Shanghai
Australia/Sydney
Africa/Cairo
Pacific/Honolulu 

Others: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  */

export const getDateAmericaSP = (): Date => {
  const today = new Date();
  const timezone = "America/Sao_Paulo";

  const desiredDate = utcToZonedTime(today, timezone);

  return desiredDate;
};
