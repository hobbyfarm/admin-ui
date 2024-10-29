export function timeSince(
  date: Date,
  end: Date = new Date(),
  series: number = 2
) {
  var seconds: number = Math.floor((end.getTime() - date.getTime()) / 1000);
  var intervals = [31536000, 2592000, 86400, 3600, 60, 1];
  var intervalCounts = [0, 0, 0, 0, 0, 0];
  var intervalStrings = ['year', 'month', 'day', 'hour', 'minute', 'second'];
  var text = '';

  for (let i = 0; i < intervals.length; i++) {
    let interval = seconds / intervals[i];
    if (interval > 1) {
      let count = Math.floor(interval);
      intervalCounts[i] = count;
      seconds -= count * intervals[i];
      continue;
    }
  }

  for (let i = 0; i < intervalCounts.length && series > 0; i++) {
    if (intervalCounts[i] > 0 || i + 1 == intervalCounts.length) {
      text +=
        intervalCounts[i] +
        ' ' +
        intervalStrings[i] +
        (intervalCounts[i] != 1 ? 's' : '');
      series -= 1;
      if (series > 0 && i + 1 != intervalCounts.length) {
        text += ', ';
      }
    }
  }

  return text;
}

// Converts duration from a number to a text string
export function durationFormatter(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  let result = '';
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0 || (hours > 0 && seconds > 0)) {
    result += `${minutes}m`;
  }
  if (seconds > 0) {
    result += `${seconds}s`;
  }
  return result || '0s';
}

// Replacement for lodash's escape
export const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const unescape = (s: string) =>
  s.replace(/&#(\d+);/g, (_match, charCode) => String.fromCharCode(charCode));

export function uniqueString(n: number) {
  return `${(Math.random().toString(36) + '0000').slice(2, n + 2)}`;
}
