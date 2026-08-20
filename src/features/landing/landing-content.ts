export const ASSEMBLY_URL =
  'https://www.entheo.community/events/weekly-assembly'

export const HERO_MOTE_POSITIONS = [12, 28, 46, 62, 78, 90] as const

export type SacramentArtwork = 'sprig' | 'psilocybe' | 'breath-spiral'

export interface SacramentPlate {
  number: string
  artwork: SacramentArtwork
  title: string
  latin: string
  description: string
}

export const SACRAMENT_PLATES: readonly SacramentPlate[] = [
  {
    number: 'Plate I',
    artwork: 'sprig',
    title: 'Nature Immersion',
    latin: 'Silva — the oldest cathedral',
    description:
      'Unhurried hours in wild places, where attention itself becomes prayer and the forest does the preaching.',
  },
  {
    number: 'Plate II',
    artwork: 'psilocybe',
    title: 'Entheogenic Communion',
    latin: 'Teonanácatl — flesh of the gods',
    description:
      'The sacrament, taken with reverence, preparation & care — a door that has opened for seekers across millennia.',
  },
  {
    number: 'Plate III',
    artwork: 'breath-spiral',
    title: 'The Quiet Arts',
    latin: 'Pneuma — breath, song & stillness',
    description:
      'Meditation, music, breathwork and dance: humbler vessels, carrying the same light inward.',
  },
]

export const MINISTRY_STEPS = [
  [
    'I',
    'The Guest',
    'Cross the threshold — join our public gatherings and see whether this feels like home.',
  ],
  [
    'II',
    'The Member',
    'Enter facilitated ceremony, workshops, talks & the steady fellowship of kindred souls.',
  ],
  [
    'III',
    'Minister of Sacrament',
    'Study the safe, lawful & reverent keeping of the sacrament for your own practice.',
  ],
  [
    'IV',
    'Minister of Fellowship',
    'Gather a local circle and tend it; hold the hearth so others may warm themselves.',
  ],
  [
    'V',
    'Minister of Ceremony',
    'Train, under guidance & evaluation, to hold space and lead the rite itself.',
  ],
] as const
