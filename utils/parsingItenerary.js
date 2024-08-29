const parseItineraryText = (itineraryText) => {
  const lines = itineraryText.split("\n").filter((line) => line.trim() !== "");
  const days = [];
  let currentDay = null;

  lines.forEach((line) => {
    line = line.trim();

    if (line.startsWith("##")) {
      return;
    }

    if (line.startsWith("**Day ")) {
      if (currentDay) {
        days.push(currentDay);
      }

      const dayHeader = line.slice(2, -2);
      const dayIndex = dayHeader.indexOf("Day ") + 4;
      const dateStart = dayHeader.indexOf("(") + 1;
      const dateEnd = dayHeader.indexOf(")");

      const dayNumber = parseInt(
        dayHeader.slice(dayIndex, dateStart - 2).trim(),
        10
      );
      const date = dayHeader.slice(dateStart, dateEnd).trim();

      currentDay = {
        day: dayNumber,
        date: date,
        activities: [],
      };
    } else if (currentDay) {
      if (line.startsWith("*")) {
        const activity = line.slice(1).trim();
        currentDay.activities.push(activity);
      }
    }
  });

  if (currentDay) days.push(currentDay);

  return { days };
};

export { parseItineraryText };
