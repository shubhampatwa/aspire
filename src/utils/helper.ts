export const getMinutesDifference = (startTime, endTime) => {
  //create date format
  const timeStart = new Date(`01/01/2000 ${startTime}`).getTime();
  const timeEnd = new Date(`01/01/2000 ${endTime}`).getTime();

  return Math.round((timeEnd - timeStart) / 60 / 1000);
};

export const getNextWeekDate = (date: Date, week: number) => {
  const nextWeek = new Date(date);
  nextWeek.setDate(nextWeek.getDate() + 7 * week);
  return nextWeek;
};
