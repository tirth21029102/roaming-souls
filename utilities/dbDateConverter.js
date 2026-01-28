export const convertToIsoWeekStart = dateString => {
  const date = new Date(dateString);

  // Get day of week (Mon = 1, Sun = 7)
  const day = date.getUTCDay() === 0 ? 7 : date.getUTCDay();

  // Move back to Monday of the ISO week
  date.setUTCDate(date.getUTCDate() - (day - 1));

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${dayOfMonth} 18:30:00`;
};
