const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "it", "zh"];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateItinerary(itinerary) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;

  for (const [dayIndex, day] of itinerary.entries()) {
    if (!Array.isArray(day?.activities) || day.activities.length === 0) {
      return `Day ${Number(day?.day_number) || dayIndex + 1} needs at least one activity.`;
    }
    for (const [activityIndex, activity] of day.activities.entries()) {
      const translations = activity?.activity_translations;
      const hasTranslation = SUPPORTED_LANGUAGES.some((language) => hasText(translations?.[language]));
      if (!hasTranslation) {
        return `Day ${Number(day?.day_number) || dayIndex + 1}, activity ${activityIndex + 1} needs a description.`;
      }
    }
  }

  return null;
}
