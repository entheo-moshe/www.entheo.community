export const MEMBER_RESOURCES = [
  {
    id: 'ordination',
    sealLabel: 'Practice & stewardship',
    kicker: 'Sacramental practice',
    title: 'Sacrament Minister Ordination',
    description: [
      {
        text: 'Read the Sacrament Minister Handbook and then pass the Ordination Assessment to become a Sacrament Minister so that you may receive and possess our sacraments for self-guided use.',
        emphasis: false,
      },
    ],
    actions: [
      {
        label: 'Read the handbook',
        href: 'https://docs.google.com/document/d/1lqO1uW1rlbscVpJObPjRSyZyvRhXbWVWFgvMCr9bxKI/edit?usp=sharing',
      },
      {
        label: 'Take the assessment',
        href: 'https://forms.gle/7xQKCGX23QjQE6od7',
      },
    ],
  },
  {
    id: 'signal',
    sealLabel: 'Community channels',
    kicker: 'Gather & connect',
    title: 'Signal Chats',
    description: [
      {
        text: 'We have two official channels on the Signal app. The',
        emphasis: false,
      },
      { text: 'Entheo Members chat', emphasis: true },
      {
        text: 'is for members to connect with each other, ask questions, and share content that is relevant to our community’s purposes. The',
        emphasis: false,
      },
      { text: 'Entheo Announce channel', emphasis: true },
      {
        text: 'is for leadership announcements such as upcoming events. Chat is not allowed in the announcements channel.',
        emphasis: false,
      },
    ],
    actions: [
      {
        label: 'Join Entheo Members chat',
        href: 'https://signal.group/#CjQKILirPBoWjlY2SN8rCm_PKfoi69EXL7aFoHWAIKcfQXSMEhAy8XS-G5kk-5DjWKb91H_0',
      },
      {
        label: 'Join Entheo Announce channel',
        href: 'https://signal.group/#CjQKIMHi3u2ZQTnj0CojRyYZCnEBiqzabtHhzTXhOoTOrZQPEhBWnCPag5tXgyCdVH0pKhhO',
      },
    ],
  },
  {
    id: 'vault',
    sealLabel: 'Recorded teachings',
    kicker: 'Learn & revisit',
    title: 'Monthly Teachings Vault',
    description: [
      {
        text: 'Only members get access to the recordings of our monthly teachings. Click below to access the Google Drive with all of the recordings!',
        emphasis: false,
      },
    ],
    actions: [
      {
        label: 'Open the teachings vault',
        href: 'https://drive.google.com/drive/folders/1J5pACeS5wxzqTAZ9pHCZGKxpE0tDsn_c?usp=drive_link',
      },
    ],
  },
] as const
