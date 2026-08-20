export const FAQ_SLUGS = [
  'who-were-for',
  'why-we-were-founded',
  'our-beliefs',
  'protections-safety',
  'legal-concerns',
  'terminology',
  'ordinations',
  'sourcing',
] as const

export type FaqSlug = (typeof FAQ_SLUGS)[number]

export interface FaqTextFragment {
  text: string
  href?: string
}

export interface FaqParagraph {
  label?: string
  content: string | readonly FaqTextFragment[]
}

export interface FaqDetailSection {
  title?: string
  paragraphs: readonly FaqParagraph[]
  items?: readonly (string | readonly FaqTextFragment[])[]
  ordered?: boolean
}

export interface FaqEntry {
  slug: FaqSlug
  question: string
  title: string
  summary: string
  landingAction: {
    label: 'More info' | 'Read our beliefs'
    href: string
  }
  notice?: string
  sections: readonly FaqDetailSection[]
}

const FIRST_AMENDMENT_URL =
  'https://constitution.congress.gov/constitution/amendment-1/#amendment-1'
const RFRA_URL = 'https://www.congress.gov/bill/103rd-congress/house-bill/1308'
const MEMBERSHIP_URL = 'https://app.onechurchsoftware.com/ec/forms/8'
const SACRAMENT_ASSESSMENT_URL = 'https://app.onechurchsoftware.com/ec/forms/15'
const CEREMONY_HANDBOOK_URL =
  'https://docs.google.com/document/d/1YA2tA-wNDACJzHfAdbN2BCUElPf-zk4sWYrgFxa0m8Q/edit?usp=sharing'
const SACRAMENT_HANDBOOK_URL =
  'https://docs.google.com/document/d/1lqO1uW1rlbscVpJObPjRSyZyvRhXbWVWFgvMCr9bxKI/edit?usp=sharing'

export const FAQ_ENTRIES: readonly FaqEntry[] = [
  {
    slug: 'who-were-for',
    question: 'Is Entheo Community a good fit for me?',
    title: 'Is Entheo Community a Good Fit for Me?',
    summary:
      'The community welcomes practitioners, seekers, hosts, researchers, advocates, caregivers, spiritual leaders, newcomers, elders, and builders looking for a safe, faith-based home for spiritual and entheogenic practice.',
    landingAction: {
      label: 'More info',
      href: '/who-were-for',
    },
    sections: [
      {
        paragraphs: [
          {
            content:
              'Welcome. A helpful way to see whether Entheo Community feels like home is to look at the people already drawn to its work. These ten familiar archetypes describe many members.',
          },
        ],
      },
      {
        title: '1. The Practitioner',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are a healer, therapist, guide, shaman, or facilitator working with entheogens, meditation, yoga, or another transformative practice.',
          },
          {
            label: 'What you are looking for',
            content:
              'A broader audience, legal and ethical support, and relationships with people who understand and uplift your work.',
          },
          {
            label: 'What you may find here',
            content:
              'A faith-based framework for sharing your offerings, collaborating with aligned practitioners, and growing personally and professionally.',
          },
        ],
      },
      {
        title: '2. The Seeker',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are pursuing spiritual growth, healing, or deeper self-discovery through entheogens or other practices that lead toward purpose.',
          },
          {
            label: 'What you are looking for',
            content:
              'A safe place to explore, trusted guidance, and meaningful connection with people walking a similar path.',
          },
          {
            label: 'What you may find here',
            content:
              'Ceremony, support, and a welcoming spiritual family in which to deepen your journey.',
          },
        ],
      },
      {
        title: '3. The Event Host',
        paragraphs: [
          {
            label: 'You',
            content:
              'You organize workshops, retreats, or gatherings centered on transformation, spirituality, or sacred plant medicines.',
          },
          {
            label: 'What you are looking for',
            content:
              'Greater reach, credibility, and an aligned community that can offer logistical and promotional support.',
          },
          {
            label: 'What you may find here',
            content:
              'A network of potential attendees and collaborators working from a shared spiritual vision.',
          },
        ],
      },
      {
        title: '4. The Researcher',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are an academic, scientist, or thought leader studying entheogens, consciousness, or spirituality.',
          },
          {
            label: 'What you are looking for',
            content:
              'An engaged audience for your findings and a way to connect research with lived experience.',
          },
          {
            label: 'What you may find here',
            content:
              'Thoughtful dialogue with people who value your work and can help bridge scholarship and practice.',
          },
        ],
      },
      {
        title: '5. The Advocate',
        paragraphs: [
          {
            label: 'You',
            content:
              'You care about decriminalization, accessibility, or the ethical use of entheogens.',
          },
          {
            label: 'What you are looking for',
            content:
              'A platform for your voice and a community that connects spiritual values with practical social change.',
          },
          {
            label: 'What you may find here',
            content:
              'A growing movement in which advocacy can be supported by shared values and collective action.',
          },
        ],
      },
      {
        title: '6. The Caregiver',
        paragraphs: [
          {
            label: 'You',
            content:
              'You support someone you love on a spiritual or entheogenic journey and want to understand the experience more deeply.',
          },
          {
            label: 'What you are looking for',
            content:
              'Resources for offering better support and a place where your own experience is seen and understood.',
          },
          {
            label: 'What you may find here',
            content:
              'Guidance and connection with others who also walk beside the people they care for.',
          },
        ],
      },
      {
        title: '7. The Spiritual Leader',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are a minister, chaplain, or spiritual guide called to support sacred entheogenic experiences.',
          },
          {
            label: 'What you are looking for',
            content:
              'A larger congregation or opportunities to deepen your work within modern spirituality.',
          },
          {
            label: 'What you may find here',
            content:
              'A platform to lead, inspire, and co-create meaningful spiritual experiences for a diverse community.',
          },
        ],
      },
      {
        title: '8. The Newcomer',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are curious about entheogens or psychedelics but are new to their potential and unsure where to begin.',
          },
          {
            label: 'What you are looking for',
            content:
              'Education, safety, and a welcoming environment in which to begin responsibly.',
          },
          {
            label: 'What you may find here',
            content:
              'Guidance and steady support for taking first steps that feel safe and meaningful.',
          },
        ],
      },
      {
        title: '9. The Elder',
        paragraphs: [
          {
            label: 'You',
            content:
              'You have years of experience with entheogenic or spiritual practices and carry wisdom worth sharing.',
          },
          {
            label: 'What you are looking for',
            content:
              'A place to mentor others, contribute what you know, and continue growing.',
          },
          {
            label: 'What you may find here',
            content:
              'Opportunities to teach, inspire, and leave a living legacy for those who follow.',
          },
        ],
      },
      {
        title: '10. The Builder',
        paragraphs: [
          {
            label: 'You',
            content:
              'You are a visionary, entrepreneur, or creative who wants to help grow something meaningful.',
          },
          {
            label: 'What you are looking for',
            content:
              'Room to innovate, shape the future of spirituality, and collaborate with people who share your purpose.',
          },
          {
            label: 'What you may find here',
            content:
              'A chance to co-create a movement that brings ancient wisdom into relationship with modern needs.',
          },
          {
            content:
              'If one or more of these descriptions feels familiar, Entheo Community may be a place where you can belong.',
          },
        ],
      },
    ],
  },
  {
    slug: 'why-we-were-founded',
    question: 'Why was Entheo Community founded?',
    title: 'Why Was Entheo Community Founded?',
    summary:
      'Entheo Community grew from years of psychedelic education, integration circles, retreats, and facilitation into a nationwide faith and education network created to hold safer spiritual space.',
    landingAction: {
      label: 'More info',
      href: '/why-we-were-founded',
    },
    sections: [
      {
        paragraphs: [
          {
            content:
              'For founder Moshe Jacobson, the work began with creating and holding safe space. His conscious journey took a decisive turn in 2015 after a former partner introduced him to LSD.',
          },
          {
            content: [
              {
                text: 'At the time he knew few other people who used psychedelics, yet he felt a clear need for a place where experiences could be shared safely. After discovering the emerging psychedelic-society movement in the United States, he created ',
              },
              { text: 'PsyAtlanta', href: 'https://www.psyatlanta.org/' },
              { text: ', a psychedelic education and support Meetup.' },
            ],
          },
          {
            content:
              'After a year of restaurant meetups, PsyAtlanta began holding regular integration circles and eventually grew beyond 3,000 members. In 2018 Moshe also began hosting multi-modality spiritual healing retreats in nature through Alive in the Wild.',
          },
          {
            content:
              'That community work led to an apprenticeship as a professional psychedelic journey facilitator. He began part-time facilitation in mid-2018 and moved into the work full-time in 2019 through EntheoCoach, LLC.',
          },
        ],
      },
      {
        title: 'From practice to church',
        paragraphs: [
          {
            content:
              'Over time, Moshe found that a wellness or medical model did not describe the depth of these experiences. He understood the practice as spiritual and began to see the need for an entheogenic church.',
          },
          {
            content: [
              { text: 'Alongside spiritual community, a church framework could support religious-liberty claims under the ' },
              { text: 'First Amendment', href: FIRST_AMENDMENT_URL },
              { text: ' and the ' },
              { text: 'Religious Freedom Restoration Act', href: RFRA_URL },
              { text: '.' },
            ],
          },
          {
            content:
              'A coaching practice alone also could not hold the larger vision: a nationwide network for people who already had, or wanted to develop, a sincere spiritual practice with sacrament whether or not they used Moshe\'s professional services.',
          },
        ],
      },
      {
        title: 'A nationwide vision',
        paragraphs: [
          {
            content:
              'In 2021 Moshe purchased the entheo.community domain as that wider vision came into focus. On October 3, 2023, Entheo Community formally ratified its founding documents and declared its intention to become a nationwide network of active local entheogenic communities grounded in religious practice and education.',
          },
          {
            content:
              'The work draws on his experience as an educator, community builder, entrepreneur, spaceholder, coach, event organizer, facilitator, and longtime technology professional.',
          },
          {
            content: [
              { text: 'If this vision resonates with you, you are invited to ' },
              { text: 'join Entheo Community', href: MEMBERSHIP_URL },
              { text: '.' },
            ],
          },
          { content: 'Thank you for reading. — The Entheo Community Team' },
        ],
      },
    ],
  },
  {
    slug: 'our-beliefs',
    question: "What are Entheo Community's beliefs?",
    title: "What are Entheo Community's Beliefs?",
    summary:
      'Members should feel aligned with the beliefs of any faith-based organization they join. Entheo Community describes its syncretic faith as compatible with spiritual seekers across traditions.',
    landingAction: {
      label: 'Read our beliefs',
      href: '#belief',
    },
    sections: [
      {
        paragraphs: [
          {
            content:
              'It is important to be in agreement with the beliefs of any faith-based organization you join.',
          },
          {
            content: [
              { text: 'The complete Entheo Community statement of belief appears in the ' },
              { text: 'Our Beliefs section of the home page', href: '/#belief' },
              { text: '.' },
            ],
          },
          {
            content:
              'These beliefs are intended to be compatible with spiritual seekers from many faith traditions. We hope you find them meaningful as well.',
          },
        ],
      },
    ],
  },
  {
    slug: 'protections-safety',
    question: 'How does Entheo Community help protect me?',
    title: 'What Protection does Entheo Community Offer Me?',
    summary:
      'The community describes protection as a combination of organizational structure, education, written documentation, privacy, collective strength, and confidence in sincere religious practice.',
    landingAction: {
      label: 'More info',
      href: '/protections-safety',
    },
    notice:
      'This page describes Entheo Community\'s approach and is not legal advice or a guarantee against government action.',
    sections: [
      {
        paragraphs: [
          {
            content:
              'Entheo Community was founded in part to give members greater peace of mind in their practice with sacrament. Members and non-members hold the same underlying rights, but the community believes that organized practice, education, and documentation can make sincere religious exercise easier to demonstrate and defend.',
          },
        ],
      },
      {
        title: 'Organizational structure',
        paragraphs: [
          {
            content:
              'Entheo Community describes itself as an unincorporated faith-based organization that remains separate from government incorporation.',
          },
          {
            content: [
              { text: 'The ' },
              { text: 'Religious Freedom Restoration Act of 1993', href: RFRA_URL },
              {
                text: ' requires the federal government to demonstrate a compelling interest and use the least restrictive means when substantially burdening religious exercise.',
              },
            ],
          },
          {
            content: [
              {
                text: 'The community also points to the characteristics the IRS uses to evaluate a ',
              },
              {
                text: 'church or religious organization',
                href: 'https://www.irs.gov/charities-non-profits/churches-religious-organizations/definition-of-church',
              },
              {
                text: ', while recognizing that tax guidance does not itself define religious exercise.',
              },
            ],
          },
        ],
      },
      {
        title: 'Education',
        paragraphs: [
          {
            content:
              'Minister of Sacrament training is intended to help members practice safely and consistently. Topics include:',
          },
        ],
        items: [
          'Practicing safely within First Amendment rights',
          'Storage, transport, and preferred terminology',
          'Consent, ethics, and safety when practicing with others',
          'Intentionality and ceremony in different settings',
          'Responding calmly and clearly if rights are challenged',
          'Effects, dosing, and sacrament-specific best practices',
        ],
      },
      {
        title: 'Documentation',
        paragraphs: [
          {
            content:
              'The Community Participation Agreement records a member\'s statement that sacramental practice is part of sincere religious exercise. Completing ordination also creates a record of education in safe handling and practice.',
          },
          {
            content:
              'Entheo Community pledges to speak in support of active members who practice in alignment with its published standards and best practices.',
          },
        ],
      },
      {
        title: 'Privacy',
        paragraphs: [
          {
            content:
              'The community states that identifiable member information is kept private and is not available outside its staff without a legally sufficient reason.',
          },
        ],
      },
      {
        title: 'Numbers',
        paragraphs: [
          {
            content:
              'As membership grows, the community believes its collective visibility, legitimacy, and ability to advocate for members will grow as well.',
          },
        ],
      },
      {
        title: 'Confidence',
        paragraphs: [
          {
            content:
              'The final form of protection described by the community is the confidence that comes from careful preparation, sincere practice, and faith. That confidence does not remove legal uncertainty, but it can help members act with greater intention and care.',
          },
        ],
      },
    ],
  },
  {
    slug: 'legal-concerns',
    question: 'How does Entheo Community address legal concerns?',
    title: 'How Does Entheo Community Address Legal Concerns?',
    summary:
      'Entheo Community grounds its approach in the First Amendment and RFRA, operates as an unincorporated private church, and publishes best-practice guidance for navigating a legally uncertain area.',
    landingAction: {
      label: 'More info',
      href: '/legal-concerns',
    },
    notice:
      'This page presents Entheo Community\'s stated position. It is not legal advice, and membership cannot prevent arrest or guarantee a particular legal outcome.',
    sections: [
      {
        paragraphs: [
          {
            content: [
              { text: 'Entheo Community looks to the ' },
              { text: 'First Amendment', href: FIRST_AMENDMENT_URL },
              { text: ' and the ' },
              { text: 'Religious Freedom Restoration Act', href: RFRA_URL },
              {
                text: ' as the foundations for exercising religion free from substantial government burden unless a compelling interest is pursued through the least restrictive means.',
              },
            ],
          },
          {
            content:
              'The community describes itself as an unincorporated private church that does not seek routine oversight or recognition from public courts, the IRS, or the DEA.',
          },
        ],
      },
      {
        title: 'Courts',
        paragraphs: [
          {
            content:
              'The source material distinguishes legislation and statutes from judge-made common law and states the community\'s view that an unincorporated church retains broad independence from public jurisdiction in matters of sincere religious practice.',
          },
          {
            content:
              'Church membership cannot prevent an arrest. Entheo Community believes that following its best practices can reduce risk and strengthen a religious-liberty defense if one becomes necessary.',
          },
          {
            content: [
              { text: 'For members seeking counsel, the community maintains a ' },
              {
                text: 'reference list of lawyers',
                href: 'https://docs.google.com/spreadsheets/d/1oRFq4YSSYkUpvQraqTUg7NomeIgMgSWtveYacTZW7WU/edit?gid=0#gid=0',
              },
              { text: '. Choosing and consulting qualified counsel remains the member\'s responsibility.' },
            ],
          },
        ],
      },
      {
        title: 'IRS',
        paragraphs: [
          {
            content:
              'Entheo Community has not applied for an IRS recognition letter. Its stated position is that remaining separate from government recognition better supports its understanding of First Amendment independence.',
          },
          {
            content: [
              {
                text: 'The community nevertheless states that it follows the operational expectations of a ',
              },
              {
                text: '501(c)(3) nonprofit',
                href: 'https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations',
              },
              {
                text: ': funds serve its mission, do not inure to an individual, avoid political activity, support public-benefit purposes, and would pass to another qualifying nonprofit if the church dissolved.',
              },
            ],
          },
          {
            content: [
              { text: 'It also states that it satisfies most of the IRS\'s ' },
              {
                text: 'church-evaluation characteristics',
                href: 'https://www.irs.gov/charities-non-profits/churches-religious-organizations/definition-of-church',
              },
              { text: '.' },
            ],
          },
        ],
      },
      {
        title: 'DEA',
        paragraphs: [
          {
            content:
              'The community does not seek a DEA exemption from the Controlled Substances Act. Its source material cites the experience of other incorporated churches as a reason for maintaining independence rather than asking an agency to approve its religious practice.',
          },
          {
            content:
              'Entheo Community\'s position is that a church should practice independently of government agencies while still acting carefully, sincerely, and responsibly.',
          },
        ],
      },
      {
        title: 'Conclusion',
        paragraphs: [
          {
            content:
              'The source compares this uncertainty to a quantum state: the strength of a protection cannot be proven until it is tested. Entheo Community believes that detailed guidelines, documentation, education, and careful practice can reduce risk, but none of these measures makes a member legally invulnerable.',
          },
        ],
      },
    ],
  },
  {
    slug: 'terminology',
    question: 'Why do you call Entheo Community a Church or Ministry?',
    title: 'Why Do You Call Entheo Community a Church?',
    summary:
      'Words such as church, sacrament, minister, ordination, and religious exercise connect the practice to established spiritual and legal language; the community is syncretic rather than tied to one doctrine.',
    landingAction: {
      label: 'More info',
      href: '/terminology',
    },
    sections: [
      {
        paragraphs: [
          {
            content:
              'Words help shape how a practice is understood. Entheo Community has therefore chosen its terminology with care.',
          },
          {
            content: [
              {
                text: 'Terms such as church, sacrament, minister, ordination, and God can be difficult for people with religious trauma and can create the mistaken impression that Entheo Community is Christian. The community instead describes itself as a ',
              },
              { text: 'syncretic church', href: 'https://en.wikipedia.org/wiki/Syncretism' },
              { text: ', drawing room for many faith traditions rather than prescribing one.' },
            ],
          },
          {
            content:
              'At this stage of spiritual and cultural change, familiar religious terms help people relate this practice to traditions that are already widely recognized. The term church also appears throughout legal writing about religious freedom.',
          },
          {
            content:
              'As more entheogenic churches become established, the community expects this vocabulary to become more flexible and attention to shift toward the integrity of the practice itself.',
          },
          {
            content:
              'Sacrament belongs to a religious model, while medicine belongs to a healthcare model. The community uses sacrament because its role is to facilitate connection to Source, not to diagnose, treat, or fix a person.',
          },
          {
            content: [
              { text: 'Religious exercise is language taken directly from ' },
              { text: 'RFRA', href: RFRA_URL },
              {
                text: ' and is used interchangeably here with religious practice. The community also avoids street names for sacraments, favoring accurate and respectful scientific names when possible.',
              },
            ],
          },
          {
            content:
              'Entheo Community does not require one religion or doctrine. Members are welcome to practice these sacraments with or alongside the traditions of an existing faith when that feels aligned.',
          },
          { content: 'Words carry power. Use them wisely.' },
        ],
      },
    ],
  },
  {
    slug: 'ordinations',
    question: "What are Entheo Community's minister ordinations?",
    title: "What Are Entheo Community's Ordinations?",
    summary:
      'Members may pursue Minister of Sacrament, Fellowship, or Ceremony paths, each adding training, responsibilities, and specific privileges in carrying sacrament, organizing fellowships, or facilitating ceremonies.',
    landingAction: {
      label: 'More info',
      href: '/ordinations',
    },
    sections: [
      {
        title: 'Introduction',
        paragraphs: [
          {
            content:
              'All members may attend church events, including facilitated ceremonies with sacrament. Ordination adds particular privileges and responsibilities.',
          },
          { content: 'Entheo Community describes three ministry paths:' },
        ],
        ordered: true,
        items: ['Minister of Sacrament', 'Minister of Fellowship', 'Minister of Ceremony'],
      },
      {
        title: 'Minister of Sacrament',
        paragraphs: [
          {
            content:
              'A Minister of Sacrament may possess sacrament beyond a single facilitated dose, including amounts used for self-guided practice such as a microdosing course. Because some sacraments may be legally controlled, this role requires specific safety education.',
          },
          {
            content:
              'Training covers safe use, storage and transport, preferred terminology, health conditions and drug contraindications, interaction with law enforcement, and other practical responsibilities.',
          },
          {
            content: [
              { text: 'Before receiving sacrament outside a facilitated setting, a member must pass the ' },
              { text: 'Minister of Sacrament Ordination Assessment', href: SACRAMENT_ASSESSMENT_URL },
              {
                text: '. The resulting membership and training records are intended to document safe exchange and sincere religious use.',
              },
            ],
          },
        ],
      },
      {
        title: 'Minister of Fellowship',
        paragraphs: [
          {
            content:
              'A Minister of Fellowship believes in the Entheo Community mission and wants to grow a local fellowship with the organization\'s support.',
          },
          {
            content:
              'The ordination offers training and authority to host official events and use approved community materials. It covers event creation, terminology, advertising, onboarding, and other practices for sustaining a fellowship.',
          },
          {
            content:
              'Ministers of Fellowship may use the church platform to automatically build a mailing list from past attendees and maintain a fellowship calendar. Those who are also Ministers of Ceremony may host official group ceremonies.',
          },
        ],
      },
      {
        title: 'Minister of Ceremony',
        paragraphs: [
          {
            content:
              'A Minister of Ceremony is trained to facilitate ceremonies with sacrament safely. The process begins by selecting a mentor from among Entheo Community\'s existing Ministers of Ceremony.',
          },
          {
            content:
              'Academic preparation includes required readings and a written assessment. The practical portion involves shadowing and co-facilitating six journeys with progressively greater responsibility.',
          },
          {
            content:
              'Training journeys are facilitated without financial compensation to the trainee, allowing participants who may not otherwise afford a journey to make a smaller donation that supports the ministry and its operations.',
          },
          {
            content:
              'After completing the process, the minister receives the Journey Facilitator ordination and may be listed in the member directory.',
          },
          {
            content: [
              { text: 'For the full curriculum, read the ' },
              { text: 'Minister of Ceremony Ordination Training Handbook', href: CEREMONY_HANDBOOK_URL },
              { text: '.' },
            ],
          },
        ],
      },
      {
        title: 'How to get started',
        paragraphs: [
          {
            content: [
              { text: 'Contact Entheo Community to ask about the next step in an ordination path.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'sourcing',
    question: 'How is sacrament sourced in Entheo Community?',
    title: "How is Entheo Community's Sacrament Sourced?",
    summary:
      'Members may receive single ceremonial doses from ordained facilitators. Self-guided practice requires added training, and every member remains responsible for verifying and testing any source.',
    landingAction: {
      label: 'More info',
      href: '/sourcing',
    },
    sections: [
      {
        paragraphs: [
          {
            content: [
              { text: 'Members may receive a single dose of sacrament during ceremonies conducted by ordained ' },
              { text: 'Journey Facilitators', href: 'https://app.onechurchsoftware.com/ec/groups/4' },
              { text: '.' },
            ],
          },
          {
            content: [
              {
                text: 'Self-guided practice requires an additional level of safety knowledge provided through the ',
              },
              { text: 'Sacrament Carrier ordination', href: SACRAMENT_ASSESSMENT_URL },
              { text: '.' },
            ],
          },
          {
            content: [
              { text: 'The ' },
              { text: 'Sacrament Carrier training', href: SACRAMENT_HANDBOOK_URL },
              {
                text: ' covers intention, safe use and medical contraindications, storage and transport, interaction with authorities, preferred terminology, and sacrament-specific considerations.',
              },
            ],
          },
          {
            content:
              'During assessment, members identify the sacraments they wish to carry. Completed training is recorded in the member profile, and additional sacraments may be added by revisiting the assessment later.',
          },
          {
            content: [
              {
                text: 'An ordained Sacrament Carrier has the community\'s blessing to exchange sacrament with another carrier and may join the ',
              },
              {
                text: 'Sacrament Carriers group',
                href: 'https://app.onechurchsoftware.com/ec/groups/9',
              },
              {
                text: ', where members who choose to be listed as providers can be contacted individually.',
              },
            ],
          },
          {
            content: [
              { text: 'To begin, read the ' },
              { text: 'Sacrament Carrier Handbook', href: SACRAMENT_HANDBOOK_URL },
              { text: ' and complete the ' },
              { text: 'Sacrament Carrier Ordination Assessment', href: SACRAMENT_ASSESSMENT_URL },
              { text: '.' },
            ],
          },
        ],
      },
      {
        title: 'Responsibility for testing',
        paragraphs: [
          {
            content:
              'A provider\'s appearance in an Entheo Community group is not a guarantee of that provider or their sacrament. Members are responsible for testing anything they receive unless they are fully confident in its safety.',
          },
          {
            content:
              'Ask a provider for test results and what they know about the source and production. A few direct questions can reveal important information about safety.',
          },
        ],
      },
    ],
  },
] as const

export function getFaqEntry(slug: string) {
  return FAQ_ENTRIES.find((entry) => entry.slug === slug)
}
