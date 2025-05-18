const dayjs = require('dayjs');


function generateOverlappingTimeSlots(dateString, start, end, slotDurationHours, stepMinutes = 60) {
    const slots = [];
  
    let startTime = dayjs(`${dateString}T${start}`);
    const endTime = dayjs(`${dateString}T${end}`);
    const duration = slotDurationHours * 60;
  
    while (startTime.add(duration, 'minute').isSameOrBefore(endTime)) {
      const slotStart = startTime.format('HH:mm');
      const slotEnd = startTime.add(duration, 'minute').format('HH:mm');
  
      slots.push({ start: slotStart, end: slotEnd });
  
      // move forward by step (e.g., 1 hour or 30 minutes)
      startTime = startTime.add(stepMinutes, 'minute');
    }
  
    return slots;
  }
  

const slotGenerator = { generateTimeSlots };
export default slotGenerator;
