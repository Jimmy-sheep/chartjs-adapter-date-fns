import {de} from 'date-fns/locale';

describe('"parse" method', function() {
  const units = {
    iso: {
      value: '2019-05-28T15:10:27.321Z',
      result: 1559056227321
    },
    day: {
      value: '28 Mai 2019',
      format: 'dd MMM yyyy',
      result: 1559001600000
    },
    month: {
      value: 'Mai 2019',
      format: 'MMM yyyy',
      result: 1556668800000
    },
    year: {
      value: '2019',
      format: 'yyyy',
      result: 1546300800000
    }
  };

  const options = {timezone: 'UTC', locale: de};
  const adapter = new Chart._adapters._date(options);

  it('should correctly parse using locale', function() {
    for (const unit of Object.keys(units)) {
      const {value, result, format} = units[unit];
      const parsed = (!format) ? adapter.parse(value) : adapter.parse(value, format);
      expect(parsed).withContext(`unit: ${unit}`).toEqual(result);
    }
  });

  it('should correctly parse using different types of value', function() {
    const inputValues = {
      utc: 1559056227321,
      jsDate: new Date(1559056227321),
      jsISODate: new Date('2019-05-28T15:10:27.321Z'),
    };

    for (const key of Object.keys(inputValues)) {
      expect(adapter.parse(inputValues[key])).withContext(`item: ${key}`).toEqual(1559056227321);
    }
  });

  it('should not parse invalid types of value', function() {
    const invalidValues = {
      function: function() { },
      null: null,
      undefined: undefined
    };

    for (const key of Object.keys(invalidValues)) {
      expect(adapter.parse(invalidValues[key])).withContext(`item: ${key}`).toEqual(null);
    }
  });
});
