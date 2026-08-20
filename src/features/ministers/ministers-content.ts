export type MinisterPageSlug =
  | 'sacrament-ministers'
  | 'fellowship-ministers'
  | 'ceremony-ministers'

export interface MinisterAction {
  label: string
  accessibleLabel: string
  href: string
  external: boolean
}

export interface MinisterPathStep {
  number: string
  title: string
  description: string
  action?: MinisterAction
}

export interface MinisterRecordField {
  label: string
  value: string
}

export interface MinisterRecord {
  id: string
  name: string
  role: string
  fields: readonly MinisterRecordField[]
}

export interface MinisterPageContent {
  slug: MinisterPageSlug
  ordinal: string
  shortTitle: string
  title: string
  thesis: string
  overview: readonly string[]
  pathwayTitle: string
  pathway: readonly MinisterPathStep[]
  directoryTitle: string
  directoryIntro: string
  records: readonly MinisterRecord[]
  directoryNote: string
  directoryAction?: MinisterAction
}

export const MEMBERSHIP_FORM_URL = 'https://forms.gle/UGyPvcKs6sC2xBGq8'
export const SACRAMENT_ASSESSMENT_URL = 'https://forms.gle/7xQKCGX23QjQE6od7'
export const MINISTER_CONTACT_FORM_URL = 'https://app.onechurchsoftware.com/ec/forms/1'

export const MINISTER_LEVELS: readonly Pick<
  MinisterPageContent,
  'slug' | 'ordinal' | 'shortTitle' | 'title'
>[] = [
  {
    slug: 'sacrament-ministers',
    ordinal: 'I',
    shortTitle: 'Sacrament',
    title: 'Sacrament Ministers',
  },
  {
    slug: 'fellowship-ministers',
    ordinal: 'II',
    shortTitle: 'Fellowship',
    title: 'Fellowship Ministers',
  },
  {
    slug: 'ceremony-ministers',
    ordinal: 'III',
    shortTitle: 'Ceremony',
    title: 'Ceremony Ministers',
  },
]

export const MINISTER_PAGES: Readonly<Record<MinisterPageSlug, MinisterPageContent>> = {
  'sacrament-ministers': {
    slug: 'sacrament-ministers',
    ordinal: 'I',
    shortTitle: 'Sacrament',
    title: 'Sacrament Ministers',
    thesis:
      'The first ordination establishes safe, intentional, and informed practice with each of the community sacraments.',
    overview: [
      'Sacrament Minister training includes education and assessment around safe sourcing, handling, storage and transport; proper dosing; personal and medical safety; intentional ceremonial practice; aligned terminology; interaction with law enforcement; emergency preparedness; ethics; and informed consent.',
      'This ordination authorizes ministers to receive and carry Entheo Community sacraments for self-guided use, and to receive sacraments from and share sacraments with other Sacrament Ministers.',
    ],
    pathwayTitle: 'Become a Sacrament Minister',
    pathway: [
      {
        number: '01',
        title: 'Become a member',
        description:
          'Sacrament Minister training and assessment are available after joining Entheo Community.',
        action: {
          label: 'Become a member',
          accessibleLabel: 'Become an Entheo Community member (opens in a new tab)',
          href: MEMBERSHIP_FORM_URL,
          external: true,
        },
      },
      {
        number: '02',
        title: 'Complete the assessment',
        description:
          'Take the Minister of Sacrament Ordination Assessment after becoming a member.',
        action: {
          label: 'Open the assessment',
          accessibleLabel:
            'Open the Minister of Sacrament Ordination Assessment (opens in a new tab)',
          href: SACRAMENT_ASSESSMENT_URL,
          external: true,
        },
      },
    ],
    directoryTitle: 'Sacrament access contact',
    directoryIntro:
      "For access to Entheo Community's officially endorsed sacrament supplies, the source page directs members to Moshe Jacobson on Signal.",
    records: [
      {
        id: 'moshe-jacobson-sacrament',
        name: 'Moshe Jacobson',
        role: 'Official supplies contact',
        fields: [{ label: 'Signal handle', value: '@entheo.111' }],
      },
    ],
    directoryNote:
      'Use the Signal handle shown in the public source page when asking about officially endorsed supplies.',
  },
  'fellowship-ministers': {
    slug: 'fellowship-ministers',
    ordinal: 'II',
    shortTitle: 'Fellowship',
    title: 'Fellowship Ministers',
    thesis:
      'Fellowship Ministers sustain a regularly meeting local or online community through official Entheo Community events.',
    overview: [
      'Fellowship Ministers are trained and authorized to hold official Entheo Community events. A Fellowship Minister sustains a regularly meeting group of people in their area, or online, by offering weekly or monthly events for their fellowship.',
      'The Fellowship Ministers who have chosen to be listed publicly appear in the directory below.',
    ],
    pathwayTitle: 'Become a Fellowship Minister',
    pathway: [
      {
        number: '01',
        title: 'Complete the first ordination',
        description: 'First become a Sacrament Minister.',
        action: {
          label: 'Explore Sacrament Ministers',
          accessibleLabel: 'Learn about Sacrament Ministers',
          href: '/sacrament-ministers',
          external: false,
        },
      },
      {
        number: '02',
        title: 'Return for the assessment',
        description:
          'The Fellowship Minister Ordination Assessment is still a work in progress. Please check back.',
      },
    ],
    directoryTitle: 'Public Fellowship Ministers',
    directoryIntro:
      'These Fellowship Ministers have chosen to be listed publicly by Entheo Community.',
    records: [
      {
        id: 'moshe-jacobson-fellowship',
        name: 'Moshe Jacobson',
        role: 'Publicly listed Fellowship Minister',
        fields: [
          { label: 'Location', value: 'National, GA' },
          { label: 'Signal handle', value: '@entheo.111' },
          {
            label: 'Ordained to carry',
            value:
              'Cannabis / THC, Psilocybin, LSD, DMT, Ketamine, MDMA, MDA, 2C-B, Amanita Muscaria',
          },
        ],
      },
    ],
    directoryNote:
      'Already ordained? Contact Entheo Community to request inclusion in the public Fellowship Minister directory.',
    directoryAction: {
      label: 'Request a public listing',
      accessibleLabel: 'Request a Fellowship Minister public listing (opens in a new tab)',
      href: MINISTER_CONTACT_FORM_URL,
      external: true,
    },
  },
  'ceremony-ministers': {
    slug: 'ceremony-ministers',
    ordinal: 'III',
    shortTitle: 'Ceremony',
    title: 'Ceremony Ministers',
    thesis:
      'Ceremony Ministers are trained and authorized to hold facilitated private and group ceremonies under the Entheo Community umbrella.',
    overview: [
      'A Ceremony Minister must also be a Fellowship Minister. The Ceremony Ministers who have chosen to be listed publicly appear in the directory below.',
    ],
    pathwayTitle: 'Become a Ceremony Minister',
    pathway: [
      {
        number: '01',
        title: 'Complete the prior ordination',
        description: 'First become a Fellowship Minister.',
        action: {
          label: 'Explore Fellowship Ministers',
          accessibleLabel: 'Learn about Fellowship Ministers',
          href: '/fellowship-ministers',
          external: false,
        },
      },
      {
        number: '02',
        title: 'Contact Entheo Community',
        description: 'Reach out after becoming a Fellowship Minister to begin the next step.',
        action: {
          label: 'Ask about ordination',
          accessibleLabel: 'Ask about Ceremony Minister ordination (opens in a new tab)',
          href: MINISTER_CONTACT_FORM_URL,
          external: true,
        },
      },
    ],
    directoryTitle: 'Public Ceremony Ministers',
    directoryIntro:
      'These Ceremony Ministers have chosen to be listed publicly by Entheo Community.',
    records: [
      {
        id: 'moshe-jacobson-ceremony',
        name: 'Moshe Jacobson',
        role: 'Publicly listed Ceremony Minister',
        fields: [
          { label: 'Location', value: 'Greater Atlanta, GA' },
          { label: 'Signal handle', value: '@entheo.111' },
          {
            label: 'Ordained to facilitate',
            value: 'Cannabis / THC, Psilocybin, DMT, MDMA, MDA',
          },
        ],
      },
    ],
    directoryNote:
      'Already ordained? Contact Entheo Community to request inclusion in the public Ceremony Minister directory.',
    directoryAction: {
      label: 'Request a public listing',
      accessibleLabel: 'Request a Ceremony Minister public listing (opens in a new tab)',
      href: MINISTER_CONTACT_FORM_URL,
      external: true,
    },
  },
}
