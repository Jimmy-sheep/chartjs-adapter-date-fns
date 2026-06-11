describe('"add" method', function() {
  const start = '2019-05-28T15:10:27.321Z';
  const amount = 1;
  const units = {
    millisecond: '2019-05-28T15:10:27.322+00:00',
    second: '2019-05-28T15:10:28.321+00:00',
    minute: '2019-05-28T15:11:27.321+00:00',
    hour: '2019-05-28T16:10:27.321+00:00',
    day: '2019-05-29T15:10:27.321+00:00',
    week: '2019-06-04T15:10:27.321+00:00',
    month: '2019-06-28T15:10:27.321+00:00',
    quarter: '2019-08-28T15:10:27.321+00:00',
    year: '2020-05-28T15:10:27.321+00:00'
  };

  const utcStart = new Date(start).valueOf();

  const options = {timezone: 'UTC'};
  const adapter = new Chart._adapters._date(options);

  it(`should correctly add ${amount} units to ${start}`, function() {
    for (const unit of Object.keys(units)) {
      const result = adapter.add(utcStart, amount, unit);
      expect(result.toISOString()).withContext(`unit: ${unit}`).toEqual(units[unit]);
    }
  });

  it('should not manage invalid unit', function() {
    expect(() => adapter.add(Date.now(), 1, 'datetime')).toThrow(new Error('Invalid unit datetime'));
  });
});
