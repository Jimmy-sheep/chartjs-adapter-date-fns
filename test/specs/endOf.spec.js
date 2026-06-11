import {getDaysInMonth, set, toDate} from 'date-fns';
import {tz} from '@date-fns/tz';

describe('"endOf" method', function() {
  const date = '2019-05-28T15:10:27.321Z';
  const units = {
    millisecond: date,
    second: '2019-05-28T15:10:27.999+00:00',
    minute: '2019-05-28T15:10:59.999+00:00',
    hour: '2019-05-28T15:59:59.999+00:00',
    day: '2019-05-28T23:59:59.999+00:00',
    week: '2019-06-01T23:59:59.999+00:00',
    month: '2019-05-31T23:59:59.999+00:00',
    quarter: '2019-06-30T23:59:59.999+00:00',
    year: '2019-12-31T23:59:59.999+00:00'
  };

  const utcDate = new Date(date);

  const options = {timezone: 'UTC'};
  const adapter = new Chart._adapters._date(options);

  it('should correctly calculate the end of the period for specific unit', function() {
    for (const unit of Object.keys(units)) {
      const result = adapter.endOf(utcDate, unit);
      expect(result.toISOString()).withContext(`unit: ${unit}`).toEqual(units[unit]);
    }
  });

  it('should not manage invalid unit', function() {
    expect(() => adapter.endOf(utcDate, 'datetime')).toThrow(new Error('Invalid unit datetime'));
  });

  it('should correctly calculate the end of the period for isoWeek', function() {
    const tzContext = options?.timezone ? {in: tz(options.timezone)} : {};
    const daysInMonth = getDaysInMonth(new Date(), tzContext);

    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const baseDate = options?.timezone ? toDate(new Date(), {in: tz(options.timezone)}) : new Date();
      const dt = set(baseDate, {date: dayOfMonth, hours: 8, minutes: 30, seconds: 0, milliseconds: 0});

      const endOf = adapter.endOf(dt.valueOf(), 'isoWeek');
      expect(adapter.format(endOf, 'ccc')).toEqual('Sat');
      expect(endOf.valueOf()).toBeGreaterThanOrEqual(dt.valueOf());
    }
  });
});
