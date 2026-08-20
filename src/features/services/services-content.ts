export interface ServiceOffering {
  id: 'private-ceremonies' | 'microdosing-course' | 'integration-support'
  category: string
  title: string
  description: readonly string[]
  detailsTitle?: string
  details?: readonly string[]
  donation: string
  action: {
    label: string
    href: string
    external: boolean
  }
}

export const SERVICE_BOOKING_URL =
  'https://www.zeffy.com/en-US/ticketing/book-a-service-with-moshe'

export const SERVICE_INTRO =
  "Entheo Community's founding minister Moshe Jacobson and other ministers offer facilitated services including private and group ceremonies, along with guided programs. Moshe's current offerings appear first, followed by space for other ministers and their work."

export const SERVICE_NOTICE =
  'Program details are presented as published by Entheo Community. Confirm current availability and personal suitability directly; this page is not medical or legal advice.'

export const SERVICE_OFFERINGS: readonly ServiceOffering[] = [
  {
    id: 'private-ceremonies',
    category: 'Private ceremony',
    title: 'Private Ceremonies',
    description: [
      'Private ceremonies are for individuals or couples who wish to experience one of the community sacraments under the care of a facilitator.',
      'An individual ceremony may involve spirit sacrament, heart sacrament, or a combination of the two. Couples ceremonies use heart sacrament and are intended to create an opportunity for two people to connect deeply.',
    ],
    detailsTitle: 'A guided full-dose journey includes',
    details: [
      'A private, full-day journey—approximately 9:00am to 3:00pm—for an individual or couple with Moshe, held in person at an agreed location.',
      'Ongoing access to weekly group support calls every Wednesday at 10:30am ET.',
      'A private preparation consultation with Moshe.',
      'A private integration consultation with Moshe.',
      'Access to Moshe by text or voice message for questions that arise.',
    ],
    donation:
      'Reserve a date with a $600 credit-card deposit, representing 50% of the requested donation. A second $600 donation is requested in cash on the journey date. A couples journey adds $300 to the second donation.',
    action: {
      label: 'Book a journey date',
      href: SERVICE_BOOKING_URL,
      external: true,
    },
  },
  {
    id: 'microdosing-course',
    category: 'Guided practice',
    title: '6-Week Microdosing Course',
    description: [
      'A structured six-week program combines personal guidance, community support, written tools, and one supply of sacrament.',
    ],
    detailsTitle: 'The course includes',
    details: [
      'A one-on-one consultation with Moshe to discuss questions and help you begin.',
      'Ongoing access to Weekly Assembly support calls every Wednesday at 10:30am ET.',
      'Access to Moshe by voice or text message for questions that arise.',
      'A high-quality, custom-designed six-week microdosing journal.',
      'Instructions intended to support effective and safer use.',
      'A guide to effective communication based on Nonviolent Communication, designed to support journaling and clarity around feelings and needs.',
      'A guide to writing effective affirmations, intended to help reshape limiting beliefs into self-affirming ones.',
      'One supply of sacrament, generally sufficient for at least one six-week course. The source page advises leaving two weeks between courses and avoiding consecutive dosing days unless Moshe directs otherwise.',
      'Published options include powdered mushrooms, mushroom chocolates, LSD sublingual drops, and LSD nasal spray.',
    ],
    donation:
      'The requested donation is $650 plus $10 shipping. A second supply may be added for $150.',
    action: {
      label: 'Start a microdosing journey',
      href: SERVICE_BOOKING_URL,
      external: true,
    },
  },
  {
    id: 'integration-support',
    category: 'One-to-one support',
    title: 'Integration Support',
    description: [
      'Moshe offers private integration sessions by phone or video. A session can help someone process a difficult experience or find clarity about a path forward.',
    ],
    donation: 'Sessions are offered at $125 per hour or by donation.',
    action: {
      label: 'Ask about integration support',
      href: '/contact',
      external: false,
    },
  },
]
