export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Profile {
  name: string;
  role: string;
  institution: string;
  degree: string;
  location: string;
  about: string;
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
  photo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  education: EducationItem[];
  skills: SkillGroup[];
}

export const profile: Profile = {
  name: 'Bakhtiar Abid Laskar',
  role: 'Full-Stack Developer building production web and mobile systems',
  institution: 'University of Science and Technology Meghalaya',
  degree: 'B.Tech in Computer Science & Engineering',
  location: 'India',
  about:
    'Computer Science Engineering undergraduate at the University of Science and Technology Meghalaya. I design and build production web applications, cross-platform mobile systems, and data dashboards. My work centers on clean architecture, reliable database systems, and responsive user interfaces.',
  contact: {
    email: 'bakhtiarabidlaskar1@gmail.com',
    phone: '+91 9101607353',
    github: 'https://github.com/Bakhtiar-Abid-Laskar',
    linkedin: 'https://www.linkedin.com/in/bakhtiar-abid-laskar/',
  },
  photo: {
    src: '/media/avatar.svg',
    alt: 'Bakhtiar Abid Laskar',
    width: 400,
    height: 400,
  },
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'University of Science and Technology Meghalaya',
      period: 'Present',
    },
    {
      degree: 'Class 12 (Higher Secondary)',
      institution: 'Narsing HS School Silchar',
      period: '2021–2023',
    },
    {
      degree: 'Class 10 (Secondary)',
      institution: 'M.A.C. Memorial Academy',
      period: '2021',
    },
  ],
  skills: [
    {
      category: 'Frontend & Mobile',
      items: [
        'Next.js',
        'React',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'HTML',
        'CSS',
        'Expo',
        'React Native',
      ],
    },
    {
      category: 'Backend & Database',
      items: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs'],
    },
    {
      category: 'Data & Analytics',
      items: ['Python', 'Microsoft Power BI'],
    },
    {
      category: 'Core & Tools',
      items: ['C', 'Git', 'GitHub', 'Vercel', 'MS Office', 'Canva'],
    },
  ],
};

export default profile;
