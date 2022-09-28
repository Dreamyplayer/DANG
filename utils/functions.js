const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const compactMode = ({ date, formatType = 'Date' }) => {
  return formatType === 'Date'
    ? Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : Intl.NumberFormat('en').format(date);
};

module.exports = {
  wait,
  compactMode,
};
