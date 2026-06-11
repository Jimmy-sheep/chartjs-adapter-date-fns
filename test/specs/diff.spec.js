describe('"diff" method', function() {
  const min = '2018-05-28T15:10:27.321Z';
  const max = '2019-05-28T15:10:27.321Z';
  const units = {
    millisecond: 31536000000,
    second: 31536000,
    minute: 525600,
    hour: 8760,
    day: 365,
    week: 52,
    month: 12,
    quarter: 4,
    year: 1
  };

  const utcMin = new Date(min).valueOf();
  const utcMax = new Date(max).valueOf();

  const options = {timezone: 'UTC'};
  const adapter = new Chart._adapters._date(options);

  it('should correctly calculate the difference between 2 dates', function() {
    for (const unit of Object.keys(units)) {
      const posResult = Math.trunc(adapter.diff(utcMax, utcMin, unit));
      expect(posResult).withContext(`unit: ${unit}`).toEqual(units[unit]);
      const negResult = Math.trunc(adapter.diff(utcMin, utcMax, unit));
      expect(negResult).withContext(`unit: ${unit}`).toEqual(-units[unit]);
    }
  });

  it('should not manage invalid unit', function() {
    expect(() => adapter.diff(utcMax, utcMin, 'datetime')).toThrow(new Error('Invalid unit datetime'));
  });
});
