import {_adapters} from 'chart.js';
import {tz} from '@date-fns/tz';
import {
  parse, parseISO, toDate, isValid, format, intlFormat,
  startOfSecond, startOfMinute, startOfHour, startOfDay,
  startOfWeek, startOfMonth, startOfQuarter, startOfYear,
  addMilliseconds, addSeconds, addMinutes, addHours,
  addDays, addWeeks, addMonths, addQuarters, addYears,
  differenceInMilliseconds, differenceInSeconds, differenceInMinutes,
  differenceInHours, differenceInDays, differenceInWeeks,
  differenceInMonths, differenceInQuarters, differenceInYears,
  endOfSecond, endOfMinute, endOfHour, endOfDay,
  endOfWeek, endOfMonth, endOfQuarter, endOfYear
} from 'date-fns';

const FORMATS = {
  datetime: {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'},
  millisecond: {hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3},
  second: {hour: 'numeric', minute: 'numeric', second: 'numeric'},
  minute: {hour: 'numeric', minute: 'numeric'},
  hour: {hour: 'numeric'},
  day: {day: 'numeric', month: 'short'},
  week: {year: 'numeric', month: 'short', day: 'numeric'},
  month: {month: 'short', year: 'numeric'},
  quarter: 'qqq - yyyy',
  year: {year: 'numeric'}
};

const ADD_METHODS = {
  millisecond: addMilliseconds,
  second: addSeconds,
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears,
};

const DIFF_METHODS = {
  millisecond: differenceInMilliseconds,
  second: differenceInSeconds,
  minute: differenceInMinutes,
  hour: differenceInHours,
  day: differenceInDays,
  week: differenceInWeeks,
  month: differenceInMonths,
  quarter: differenceInQuarters,
  year: differenceInYears,
};

const START_OF_METHODS = {
  millisecond: (time) => time,
  second: startOfSecond,
  minute: startOfMinute,
  hour: startOfHour,
  day: startOfDay,
  week: startOfWeek,
  month: startOfMonth,
  quarter: startOfQuarter,
  year: startOfYear,
};

const END_OF_METHODS = {
  millisecond: (time) => time,
  second: endOfSecond,
  minute: endOfMinute,
  hour: endOfHour,
  day: endOfDay,
  week: endOfWeek,
  month: endOfMonth,
  quarter: endOfQuarter,
  year: endOfYear,
};

_adapters._date.override({
  _id: 'date-fns', // DEBUG

  formats: function() {
    return FORMATS;
  },

  parse: function(value, fmt) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }

    const type = typeof value;

    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};

    if (type === 'number' || value instanceof Date) {
      value = toDate(value);
    } else if (type === 'string') {
      if (typeof fmt === 'string') {
        value = parse(value, fmt, new Date(), {...this.options, ...tzOption});
      } else {
        value = parseISO(value, {...this.options, ...tzOption});
      }
    }

    return isValid(value) ? value.getTime() : null;
  },

  format: function(time, fmt) {
    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};

    if (typeof fmt === 'string') {
      return format(time, fmt, {...this.options, ...tzOption});
    }

    const {locale, timezone, ...intlOptions} = this.options || {};
    const formatOptions = {...fmt, timeZone: timezone, ...intlOptions};

    const localeOptions = locale && locale.code
      ? {locale: locale.code}
      : undefined;

    return intlFormat(time, formatOptions, localeOptions);
  },

  add: function(time, amount, unit) {
    const method = ADD_METHODS[unit];
    if (!method) {
      throw new Error(`Invalid unit ${unit}`);
    }

    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};
    return method(time, amount, tzOption);
  },

  diff: function(max, min, unit) {
    const method = DIFF_METHODS[unit];
    if (!method) {
      throw new Error(`Invalid unit ${unit}`);
    }

    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};
    return method(max, min, tzOption);
  },

  startOf: function(time, unit, weekday) {
    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};

    if (unit === 'isoWeek') {
      return startOfWeek(time, {weekStartsOn: +weekday, ...tzOption});
    }

    const method = START_OF_METHODS[unit];
    if (!method) {
      throw new Error(`Invalid unit ${unit}`);
    }

    return method(time, tzOption);
  },

  endOf: function(time, unit) {
    const tzOption = this.options?.timezone ? {in: tz(this.options.timezone)} : {};

    if (unit === 'isoWeek') {
      return endOfWeek(time, tzOption);
    }

    const method = END_OF_METHODS[unit];
    if (!method) {
      throw new Error(`Invalid unit ${unit}`);
    }

    return method(time, tzOption);
  }
});
