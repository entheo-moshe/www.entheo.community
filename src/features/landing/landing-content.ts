import { MEMBERSHIP_URL } from '../../config/member-navigation'

export const ASSEMBLY_URL = '/events#weekly-assembly'

export const PUBLIC_EVENTS_URL = '/events'
export const ENTHEISM_URL = 'https://entheism.org/'

export const WELCOME_VIDEO_URL =
  'https://www.youtube-nocookie.com/embed/DJhDSeH5ahY?rel=0'

export const ASSEMBLY_IMAGE_URL = '/weekly-assembly.jpg'

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
      'Meditation, music, breath work and dance: humbler vessels, carrying the same light inward.',
  },
]

export interface MinistryStep {
  number: string
  title: string
  description: string
  action: {
    label: string
    href: string
    accessibleLabel: string
    external: boolean
  }
}

export const MINISTRY_STEPS: readonly MinistryStep[] = [
  {
    number: 'I',
    title: 'Guest',
    description:
      'Non-members are welcome to join any of the Entheo Community Public Events but must become a member to attend any events involving legally controlled sacraments.',
    action: {
      label: 'Explore public events',
      href: PUBLIC_EVENTS_URL,
      accessibleLabel: 'Explore Entheo Community Public Events',
      external: false,
    },
  },
  {
    number: 'II',
    title: 'Member',
    description:
      'Become a Member to gain access to a variety of facilitated individual and group ceremonies, educational workshops, talks, social gatherings, and more nationwide.',
    action: {
      label: 'Become a member',
      href: MEMBERSHIP_URL,
      accessibleLabel: 'Become a Member (opens in a new tab)',
      external: true,
    },
  },
  {
    number: 'III',
    title: 'Minister of Sacrament',
    description:
      'Our most fundamental ordination ensures competency with sacraments: safe storage and handling; medical contraindications; sacrament-specific behavior & caveats; safe & intentional ceremony; accurate terminology; legal defense; and assertion of rights. It clears you to possess any of our sacraments for self-guided use. Once you become a member you will have access to our Minister of Sacrament training.',
    action: {
      label: 'Explore this ordination',
      href: '/sacrament-ministers',
      accessibleLabel: 'Learn about Sacrament Ministers',
      external: false,
    },
  },
  {
    number: 'IV',
    title: 'Minister of Fellowship',
    description:
      'This ordination is for those who believe strongly in our mission and wish to extend our offerings to their own local or interest-specific group of people. You will build your own fellowship within Entheo Community by hosting regular events and learning how to bring people onboard so that everyone enjoys safe and improved access to the experiences central to our practice. Once you become a Minister of Sacrament you will have access to the Minister of Fellowship training.',
    action: {
      label: 'Explore this ordination',
      href: '/fellowship-ministers',
      accessibleLabel: 'Learn about Fellowship Ministers',
      external: false,
    },
  },
  {
    number: 'V',
    title: 'Minister of Ceremony',
    description:
      'This ordination provides a path for those who wish to facilitate our sacraments. You will go through a process of training and evaluation so that you can officially facilitate under the Entheo Community umbrella. Once you become a Minister of Fellowship you may begin the process of training as a Minister of Ceremony.',
    action: {
      label: 'Explore this ordination',
      href: '/ceremony-ministers',
      accessibleLabel: 'Learn about Ceremony Ministers',
      external: false,
    },
  },
]
