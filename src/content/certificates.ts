export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  issuer: {
    name: string;
    organization: string;
    website: string;
    accreditation?: string;
  };
  period: string;
  issueDate: string;
  credentialId: string;
  summary: string;
  keyHighlights: string[];
  skills: string[];
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
    aspectRatio: string;
  };
}

export const certificates: Certificate[] = [
  {
    id: 'bahash-python-ml-internship',
    title: 'Python & Machine Learning Internship',
    subtitle: 'Research & Applied Machine Learning Internship',
    role: 'Machine Learning & Python Intern',
    issuer: {
      name: 'Bahash-AI',
      organization: 'Bahash Private Limited',
      website: 'https://www.bahash.in',
      accreditation: 'MSME Registered Enterprise',
    },
    period: 'Jan 18, 2026 – Feb 8, 2026',
    issueDate: 'March 19, 2026',
    credentialId: 'BIP/26/1',
    summary:
      'Completed an intensive research-focused internship at Bahash-AI (Bahash Private Limited), actively contributing to research-related tasks, algorithmic model development, and practical machine learning project pipelines.',
    keyHighlights: [
      'Contributed to applied machine learning research and engineering pipelines',
      'Developed data preprocessing workflows and model evaluations in Python',
      'Commended by leadership for diligence, responsibility, and quick technical learning',
    ],
    skills: ['Python', 'Machine Learning', 'Data Preprocessing', 'Algorithms', 'Research & Evaluation'],
    media: {
      src: '/media/certificates/bahash-python-ml-internship.webp',
      alt: 'Bahash-AI Python and Machine Learning Internship Certificate for Bakhtiar Abid Laskar (Certificate No. BIP/26/1)',
      width: 800,
      height: 1035,
      aspectRatio: '800/1035',
    },
  },
  {
    id: 'bahash-python-internship',
    title: 'Python Programming Internship',
    subtitle: 'Core Python Architecture & Programmatic Systems',
    role: 'Python Developer Intern',
    issuer: {
      name: 'Bahash-AI',
      organization: 'Bahash Private Limited',
      website: 'https://www.bahash.in',
      accreditation: 'MSME Registered Enterprise',
    },
    period: '22-June-2025 – 11-Jul-2025',
    issueDate: '12-July-2025',
    credentialId: 'BIP/25/1',
    summary:
      'Completed an extensive internship program on Python Programming at Bahash-AI, engineering modular Python scripts, algorithmic data structures, and backend automation routines.',
    keyHighlights: [
      'Implemented clean, modular Python applications and data structures',
      'Constructed algorithmic automation scripts and backend utility workflows',
      'Awarded official internship completion certificate under CID: BIP/25/1',
    ],
    skills: ['Python', 'Core Programming', 'Data Structures', 'Automation', 'Backend Logic'],
    media: {
      src: '/media/certificates/bahash-python-internship.webp',
      alt: 'Bahash-AI Python Programming Internship Completion Certificate for Bakhtiar Abid Laskar (CID: BIP/25/1)',
      width: 800,
      height: 618,
      aspectRatio: '800/618',
    },
  },
];

export default certificates;
