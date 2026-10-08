export type Project = {
  id: string; // slug
  order: number; // 1..6, rendering order comes only from this
  name: string;
  kind: string; // short type label
  summary: string; // <= 45 words, from Section 3.3
  stack: string[];
  links: { live?: string; source: string };
  status: 'live' | 'internal' | 'archive';
  media: {
    src: string; // asset path relative to public/
    alt: string;
    width: number;
    height: number;
  };
};

export const projects: Project[] = [
  {
    id: 'avalin-laboratories',
    order: 1,
    name: 'Avalin Laboratories',
    kind: 'Corporate website',
    summary:
      'Corporate website for Avalin Laboratories. A responsive Next.js platform with a consistent design system, structured product-led sections and clear navigation across desktop, tablet and mobile.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: {
      live: 'https://www.avalinlaboratories.com/',
      source: 'https://github.com/Bakhtiar-Abid-Laskar/AVALIN-LABORTORIES',
    },
    status: 'live',
    media: {
      src: '/media/projects/avalin-laboratories.png',
      alt: 'Avalin Laboratories corporate website homepage',
      width: 1440,
      height: 900,
    },
  },
  {
    id: 'nilakshith-enterprises',
    order: 2,
    name: 'Nilakshith Enterprises',
    kind: 'Business website',
    summary:
      'Website for a broadband, WiFi and CCTV installation business serving Silchar, Karimganj and Hailakandi. Dedicated service pages for broadband, CCTV and networking, enquiry and WhatsApp contact flows, technical SEO, optimised images and critical CSS, deployed on Vercel.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Vercel'],
    links: {
      live: 'https://www.nilakshithenterprise.com/',
      source: 'https://github.com/Bakhtiar-Abid-Laskar/Nilakshith-Enterprises',
    },
    status: 'live',
    media: {
      src: '/media/projects/nilakshith-enterprises.png',
      alt: 'Nilakshith Enterprises business website homepage',
      width: 1440,
      height: 900,
    },
  },
  {
    id: 'southcity-hospital',
    order: 3,
    name: 'South City Hospital',
    kind: 'Healthcare website & admin portal',
    summary:
      'Website for South City Hospital, serving patients across the Barak Valley. A Turborepo monorepo with a public Next.js site (departments, doctors, facilities, booking) and a separate admin portal sharing typed data models backed by Supabase. Includes security and launch audits.',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Turborepo',
    ],
    links: {
      live: 'https://southcityhospital.in/',
      source: 'https://github.com/Bakhtiar-Abid-Laskar/SouthCityHospital',
    },
    status: 'live',
    media: {
      src: '/media/projects/southcity-hospital.png',
      alt: 'South City Hospital public healthcare website',
      width: 1440,
      height: 900,
    },
  },
  {
    id: 'digital-solution-ims',
    order: 4,
    name: 'Digital Solution Internal Management System',
    kind: 'Internal operations platform',
    summary:
      'Management system for a consumer electronics repair business. A Next.js admin panel and Expo React Native mobile app on one Supabase backend. Role-based workflows for customer intake, job assignment, billing, inventory, geofenced attendance, and notifications, with database-generated codes and row-level security.',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Expo',
      'React Native',
      'Supabase',
      'PostgreSQL',
      'Recharts',
      'Leaflet',
    ],
    links: {
      source:
        'https://github.com/Bakhtiar-Abid-Laskar/DIGITAL-SOLUTION-INTERNAL-MANAGEMENT-SYSTEM',
    },
    status: 'internal',
    media: {
      src: '/media/projects/digital-solution-ims.svg',
      alt: 'Digital Solution Internal Management System architecture diagram',
      width: 1440,
      height: 900,
    },
  },
  {
    id: 'ustm-academia',
    order: 5,
    name: 'USTM Academia',
    kind: 'Student resource portal',
    summary:
      'Academic resource portal for students of the University of Science and Technology Meghalaya. Previous year question papers and syllabi organised by course, semester and subject, with Algolia instant search, in-browser PDF viewing from Google Drive, and an installable PWA.',
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Algolia',
      'Google Drive API',
      'Vercel',
    ],
    links: {
      live: 'https://ustm-academia.vercel.app/',
      source: 'https://github.com/Bakhtiar-Abid-Laskar/USTM_academia',
    },
    status: 'live',
    media: {
      src: '/media/projects/ustm-academia.png',
      alt: 'USTM Academia student portal homepage',
      width: 1440,
      height: 900,
    },
  },
  {
    id: 'ecommerce-sales-dashboard',
    order: 6,
    name: 'E-Commerce Sales Analysis Dashboard',
    kind: 'Data analysis dashboard',
    summary:
      'Interactive Power BI dashboard analysing sales performance across states, identifying customer trends, top-selling products, and profitability metrics through comparative charts, visual summaries, and geographic territory maps.',
    stack: [
      'Microsoft Power BI',
      'Data Analysis',
      'DAX',
      'Data Visualization',
    ],
    links: {
      source:
        'https://github.com/Bakhtiar-Abid-Laskar/Ecommerce-Sales-Analysis-Dashboard-Using-MS-Power-BI',
    },
    status: 'archive',
    media: {
      src: '/media/projects/ecommerce-sales-dashboard.png',
      alt: 'E-Commerce Sales Analysis Power BI Dashboard',
      width: 1440,
      height: 900,
    },
  },
];

export default projects;
