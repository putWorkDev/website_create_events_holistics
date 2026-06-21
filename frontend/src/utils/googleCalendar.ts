import type { EventItem } from '../types';

/**
 * Formats a date into the compact UTC form Google Calendar expects:
 * YYYYMMDDTHHmmssZ
 */
function toGoogleDate(value: string): string {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Builds a "Add to Google Calendar" template URL for the given event.
 * See: https://calendar.google.com/calendar/render?action=TEMPLATE
 */
export function buildGoogleCalendarUrl(event: EventItem): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGoogleDate(event.startTime)}/${toGoogleDate(event.endTime)}`,
    details: event.summary ?? event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
