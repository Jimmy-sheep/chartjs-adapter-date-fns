import {de} from 'date-fns/locale';

describe('"format" method', function() {
  const date = '2019-05-28T15:10:27.321Z';
  const units = {
    datetime: '28. Mai 2019, 15:10:27',
    millisecond: '15:10:27,321',
    second: '15:10:27',
    minute: '15:10',
    hour: '15 Uhr',
    day: '28. Mai',
    week: '28. Mai 2019',
    month: 'Mai 2019',
    quarter: 'Q2 - 2019',
    year: '2019'
  };

  const utcDate = new Date(date);

  const options = {timezone: 'UTC', locale: de};
  const adapter = new Chart._adapters._date(options);
  const formats = adapter.formats();

  it('should correctly format by format presets for locale', function() {
    for (const unit of Object.keys(units)) {
      const result = adapter.format(utcDate, formats[unit]);
      expect(result).withContext(`unit: ${unit}`).toEqual(units[unit]);
    }
  });
});
