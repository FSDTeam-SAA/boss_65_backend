export function slotGenerator(date, start, end, slotDurationHours, stepMinutes = 60, format = '24') {
  const slots = [];

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime24(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  function minutesToTime12(mins) {
    let h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12; // 12 AM or 12 PM
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  let startMins = timeToMinutes(start);
  let endMins = timeToMinutes(end);
  const slotDurationMins = slotDurationHours * 60;

  if (startMins === endMins) {
    endMins += 1440;
  } else if (endMins <= startMins) {
    endMins += 1440;
  }

  let currentStart = startMins;

  while (currentStart + slotDurationMins <= endMins) {
    let slotStart, slotEnd;

    if (format === '12') {
      slotStart = minutesToTime12(currentStart);
      slotEnd = minutesToTime12(currentStart + slotDurationMins);
    } else {
      slotStart = minutesToTime24(currentStart);
      slotEnd = minutesToTime24(currentStart + slotDurationMins);
    }

    slots.push({ start: slotStart, end: slotEnd });
    currentStart += stepMinutes;
  }

  return slots;
}
