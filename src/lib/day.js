// src/lib/date.js
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// โหลด locale ที่ต้องใช้ (เพิ่มได้เรื่อย ๆ)
import 'dayjs/locale/en';
import 'dayjs/locale/th';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// map ภาษาของแอป -> locale ของ dayjs
const localeMap = (l) => (['en','th'].includes(l) ? l : 'en');

export const formatDate = (date, locale, fmt = 'D MMM YYYY') => {
  return dayjs(date).locale(localeMap(locale)).format(fmt);
};

export const formatFromNow = (date, locale) => {
  return dayjs(date).locale(localeMap(locale)).fromNow();
};
