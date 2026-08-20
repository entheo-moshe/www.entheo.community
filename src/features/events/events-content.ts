export const EVENT_SHOWCASE_URL =
  'https://airtable.com/appbVGvgHR52W0qp5/shr8Q8Iz11qX8ZX4z?gO7uy=allRecords'

export const EVENT_SHOWCASE_EMBED_URL =
  'https://airtable.com/embed/appbVGvgHR52W0qp5/shr8Q8Iz11qX8ZX4z?gO7uy=allRecords'

export const POST_EVENT_URL =
  'https://airtable.com/appbVGvgHR52W0qp5/pagMi7VayL9nlUsol/form'

export const POST_EVENT_EMBED_URL =
  'https://airtable.com/embed/appbVGvgHR52W0qp5/pagMi7VayL9nlUsol/form'

export const EVENT_CALENDAR_ID =
  'c_d0c3d9885fc94c45b3ad4cb903678d6dee7058e536aa51eb4db73d0930d82cbe@group.calendar.google.com'

const encodedCalendarId = encodeURIComponent(EVENT_CALENDAR_ID)

export const EVENT_CALENDAR_EMBED_URL =
  `https://calendar.google.com/calendar/embed?wkst=1&ctz=America%2FNew_York&showPrint=0&mode=AGENDA&src=${encodedCalendarId}&color=%2383d754`

export const GOOGLE_CALENDAR_URL =
  `https://calendar.google.com/calendar/render?cid=${encodedCalendarId}`

export const APPLE_CALENDAR_URL =
  `https://calendar.google.com/calendar/ical/${encodedCalendarId}/public/basic.ics`

export const WEEKLY_ASSEMBLY_REGISTRATION_URL =
  'https://www.zeffy.com/en-US/ticketing/weekly-assembly'

export const MEETUP_URL = 'https://www.meetup.com/entheo-community/'

export const MAILING_LIST_URL = 'https://www.entheo.community/'

export const WEEKLY_ASSEMBLY_PARAGRAPHS = [
  'Join us every week for an intimate online gathering. This is a place to meet other members, ask questions, share experiences, and connect with like-minded people.',
  'We begin with a short meditation and an inspirational quote, followed by brief introductions and reflections. During the main shares, each person has space to go deeper into what is on their mind and heart.',
  "Whether you're new to Entheo Community or a veteran member, Weekly Assembly is a welcoming place to connect. Register to receive reminders; a donation is optional and appreciated.",
] as const
