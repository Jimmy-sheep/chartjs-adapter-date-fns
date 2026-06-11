import {getDaysInMonth, set, toDate} from 'date-fns';
import {tz} from '@date-fns/tz';

describe('"startOf" method', function() {
  const date = '2019-05-28T15:10:27.321Z';
  const units = {
    millisecond: date,
    second: '2019-05-28T15:10:27.000+00:00',
    minute: '2019-05-28T15:10:00.000+00:00',
    hour: '2019-05-28T15:00:00.000+00:00',
    day: '2019-05-28T00:00:00.000+00:00',
    week: '2019-05-26T00:00:00.000+00:00',
    month: '2019-05-01T00:00:00.000+00:00',
    quarter: '2019-04-01T00:00:00.000+00:00',
    year: '2019-01-01T00:00:00.000+00:00'
  };

  const utcDate = new Date(date);

  const options = {timezone: 'UTC'};
  const adapter = new Chart._adapters._date(options);

  it('should correctly calculate the start of the period for specific unit', function() {
    for (const unit of Object.keys(units)) {
      const result = adapter.startOf(utcDate, unit);
      expect(result.toISOString()).withContext(`unit: ${unit}`).toEqual(units[unit]);
    }
  });

  it('should not manage invalid unit', function() {
    expect(() => adapter.startOf(utcDate, 'datetime')).toThrow(new Error('Invalid unit datetime'));
  });

  it('should correctly calculate the start of the period for isoWeek', function() {
    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const tzContext = options?.timezone ? {in: tz(options.timezone)} : {};
    const daysInMonth = getDaysInMonth(new Date(), tzContext);

    for (const dayOfWeek of dayOfWeekNames) {
      // Only test valid global week start days: 'Sun', 'Mon', 'Fri', 'Sat'
      if (!['Sun', 'Mon', 'Fri', 'Sat'].includes(dayOfWeek)) {
        continue;
      }

      for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
        const baseDate = options?.timezone ? toDate(new Date(), {in: tz(options.timezone)}) : new Date();
        const dt = set(baseDate, {date: dayOfMonth, hours: 8, minutes: 30, seconds: 0, milliseconds: 0});

        const startOf = adapter.startOf(dt.valueOf(), 'isoWeek', dayOfWeekNames.indexOf(dayOfWeek));
        expect(adapter.format(startOf, 'ccc')).toEqual(dayOfWeek);
        expect(startOf.valueOf()).toBeLessThanOrEqual(dt.valueOf());
      }
    }
  });
});
