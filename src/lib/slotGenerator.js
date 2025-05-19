function slotGenerator(date, start, end, slotDurationHours, stepMinutes = 60) {
  console.log('Date:', date);
  console.log('Start:', start);
  console.log('End:', end);
  console.log('Slot Duration (hours):', slotDurationHours);
  console.log('Step Minutes:', stepMinutes);
  const slots = [];

  // Convert "HH:mm" to total minutes from midnight
  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  // Convert total minutes back to "HH:mm"
  function minutesToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  const startMins = timeToMinutes(start);
  const endMins = timeToMinutes(end);
  const slotDurationMins = slotDurationHours * 60;

  let currentStart = startMins;

  while (currentStart + slotDurationMins <= endMins) {
    const slotStart = minutesToTime(currentStart);
    const slotEnd = minutesToTime(currentStart + slotDurationMins);

    slots.push({ start: slotStart, end: slotEnd });

    currentStart += stepMinutes;
  }

  return slots;
}