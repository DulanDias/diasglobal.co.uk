// RETIREMENT: when this role is filled, DELETE
// src/app/careers/management-trainee-sri-lanka/page.tsx, remove its sitemap entry, and
// remove the vacancy from VACANCIES. A filled role left live with JobPosting markup
// breaches Google's expired-job-postings content policy. validThrough is set so the
// posting self-expires in Google if that clean-up is missed.

export type ResponsibilityGroup = {
  id: string
  heading: string
  items: string[]
}

export type Vacancy = {
  slug: string
  title: string
  /** Human-readable location line for the at-a-glance strip. */
  location: string
  /** Human-readable working-pattern line. NOT a contractual term. */
  workingPattern: string
  /** Free-text workHours value for JobPosting. No employment-status assertion. */
  workHours: string
  /** Country name for JobPosting.applicantLocationRequirements. Plain name, not an ISO code. */
  applicantCountry: string
  summary: string
  remoteStatement: string
  responsibilities: ResponsibilityGroup[]
  essential: string[]
  desirable: string[]
  development: string[]
  engagementNote: string
  /** ISO 8601 date. */
  datePosted: string
  /** ISO 8601 datetime. See RETIREMENT NOTE at the head of this file. */
  validThrough: string
  identifier: string
  occupationalCategory: string
  industry: string
  /** Complete HTML description for JobPosting. Google requires responsibilities,
   *  qualifications, skills and working hours to be present here. */
  descriptionHtml: string
}

export const CAREERS_EMAIL_USER = 'Y2FyZWVycw==' // 'careers'
export const CAREERS_EMAIL_DOMAIN = 'ZGlhc2dsb2JhbC5jby51aw==' // 'diasglobal.co.uk'

/** Re-exported so callers of this module keep a single import site. */
export { FORMSPREE_ENDPOINT } from '@/lib/site'

export const APPLICATION_SUBJECT = 'Careers application — Management Trainee (Sri Lanka)'

export const APPLICATION_REFERENCE_PREFIX = 'DGL-MT-'

/** Ambiguity-free alphabet: no I, L, O, 0, 1. */
export const APPLICATION_REFERENCE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export const APPLICATION_REFERENCE_LENGTH = 6

export const MANAGEMENT_TRAINEE: Vacancy = {
  slug: 'management-trainee-sri-lanka',
  title: 'Management Trainee',
  location: 'Remote — Sri Lanka',
  workingPattern: 'Full-time equivalent, coordinated to UK business hours',
  workHours: 'Full-time equivalent, coordinated to UK business hours',
  applicantCountry: 'Sri Lanka',
  summary:
    'A broad, hands-on role for someone who wants to learn how a small international business actually runs, from the bookkeeping up. You will support the Director across finance, tax and compliance, operations, HR administration and business development, and rotate through the company’s functions rather than sitting in one of them.',
  remoteStatement:
    'This is a 100% remote role, performed from Sri Lanka. There is no office attendance.',
  responsibilities: [
    {
      id: 'general-operations',
      heading: 'General and operations',
      items: [
        'Supporting the day-to-day running of the business and its administration.',
        'Providing executive and personal support to the Director where it is needed.',
        'Keeping documentation and records in order, and preparing reports.',
        'Coordinating projects and chasing them through to completion.',
        'Looking for ways the way we work could be made simpler, and proposing them.',
      ],
    },
    {
      id: 'business-development',
      heading: 'Business development and client relations',
      items: [
        'Researching markets, competitors and opportunities, and writing up what you find.',
        'Supporting sales and marketing activity.',
        'Communicating with clients and helping to look after those relationships.',
        'Coordinating with suppliers, vendors and other stakeholders.',
      ],
    },
    {
      id: 'finance-accounting',
      heading: 'Finance and accounting',
      items: [
        'Bookkeeping, and keeping the financial records accurate and current.',
        'Accounts payable and receivable — raising invoices, tracking payments, running reconciliations.',
        'Bank and petty-cash reconciliations, and expense tracking.',
        'Helping to prepare budgets, monitor cash flow and produce management and financial reports.',
        'Liaising with our external accountants and auditors.',
      ],
    },
    {
      id: 'taxation-compliance',
      heading: 'Taxation and compliance',
      items: [
        'Helping to prepare tax computations, returns and filings, and keeping the supporting records — income tax, VAT and other applicable taxes.',
        'Supporting statutory, regulatory and corporate governance compliance and the documentation behind it.',
        'Liaising with tax advisers and the relevant authorities.',
      ],
    },
    {
      id: 'hr-administration',
      heading: 'Human resources and administration',
      items: [
        'HR administration, and maintaining employee and consultant records.',
        'Helping with recruitment, onboarding and the paperwork that goes with them.',
        'Coordinating leave and attendance records and payroll inputs.',
        'Supporting the roll-out of HR policies.',
      ],
    },
    {
      id: 'rotation',
      heading: 'Rotation and special projects',
      items: [
        'Rotational exposure across the company’s functions, so you build rounded management capability rather than depth in one silo.',
        'Special projects as agreed.',
      ],
    },
  ],
  essential: [
    'You are located in Sri Lanka and able to work from there.',
    'You are legally able to work in Sri Lanka.',
    'A qualification in accounting, business, finance or a related field — or equivalent practical experience.',
    'You can write clear, accurate business English for correspondence with UK clients and advisers.',
    'You are comfortable with spreadsheets, accounting software and online collaboration tools.',
    'You are accurate with detail and methodical about records.',
    'You are comfortable asking a question when something is unclear, rather than guessing.',
    'You have a reliable internet connection and somewhere quiet to work, good enough for video calls during UK business hours.',
  ],
  desirable: [
    'Part-qualified with, or studying towards, CA Sri Lanka, CIMA, ACCA or similar.',
    'Bookkeeping experience, including running reconciliations.',
    'Exposure to Sri Lankan income tax and VAT filings.',
    'Experience supporting HR or payroll administration.',
    'Sinhala and/or Tamil, for liaison with local suppliers and authorities.',
  ],
  development: [
    'Breadth: finance, tax, compliance, HR, operations and business development, in one role.',
    'Rotational exposure across the company’s functions, so you finish with a rounded view rather than one specialism.',
    'Working directly with the Director, close to how decisions are actually made.',
    'Exposure to both UK and Sri Lankan business practice.',
  ],
  engagementNote: 'Engagement details will be discussed at offer stage.',
  datePosted: '2026-09-01',
  validThrough: '2026-12-31T23:59:59+00:00',
  identifier: 'DGL-MT-LK-2026-01',
  occupationalCategory: 'Business and Financial Operations',
  industry: 'Investment and business services',
  descriptionHtml:
    '<p>Dias Global Limited is a UK company with interests across real assets, technology and entrepreneurial ventures. This is a broad, hands-on Management Trainee role, performed remotely from Sri Lanka.</p>' +
    '<h3>General and operations</h3>' +
    '<ul>' +
    '<li>Supporting the day-to-day running of the business and its administration.</li>' +
    '<li>Providing executive and personal support to the Director where it is needed.</li>' +
    '<li>Keeping documentation and records in order, and preparing reports.</li>' +
    '<li>Coordinating projects and chasing them through to completion.</li>' +
    '<li>Looking for ways the way we work could be made simpler, and proposing them.</li>' +
    '</ul>' +
    '<h3>Business development and client relations</h3>' +
    '<ul>' +
    '<li>Researching markets, competitors and opportunities, and writing up what you find.</li>' +
    '<li>Supporting sales and marketing activity.</li>' +
    '<li>Communicating with clients and helping to look after those relationships.</li>' +
    '<li>Coordinating with suppliers, vendors and other stakeholders.</li>' +
    '</ul>' +
    '<h3>Finance and accounting</h3>' +
    '<ul>' +
    '<li>Bookkeeping, and keeping the financial records accurate and current.</li>' +
    '<li>Accounts payable and receivable — raising invoices, tracking payments, running reconciliations.</li>' +
    '<li>Bank and petty-cash reconciliations, and expense tracking.</li>' +
    '<li>Helping to prepare budgets, monitor cash flow and produce management and financial reports.</li>' +
    '<li>Liaising with our external accountants and auditors.</li>' +
    '</ul>' +
    '<h3>Taxation and compliance</h3>' +
    '<ul>' +
    '<li>Helping to prepare tax computations, returns and filings, and keeping the supporting records — income tax, VAT and other applicable taxes.</li>' +
    '<li>Supporting statutory, regulatory and corporate governance compliance and the documentation behind it.</li>' +
    '<li>Liaising with tax advisers and the relevant authorities.</li>' +
    '</ul>' +
    '<h3>Human resources and administration</h3>' +
    '<ul>' +
    '<li>HR administration, and maintaining employee and consultant records.</li>' +
    '<li>Helping with recruitment, onboarding and the paperwork that goes with them.</li>' +
    '<li>Coordinating leave and attendance records and payroll inputs.</li>' +
    '<li>Supporting the roll-out of HR policies.</li>' +
    '</ul>' +
    '<h3>Rotation and special projects</h3>' +
    '<ul>' +
    '<li>Rotational exposure across the company’s functions, so you build rounded management capability rather than depth in one silo.</li>' +
    '<li>Special projects as agreed.</li>' +
    '</ul>' +
    '<h3>What we are looking for</h3>' +
    '<p>Essential:</p>' +
    '<ul>' +
    '<li>You are located in Sri Lanka and able to work from there.</li>' +
    '<li>You are legally able to work in Sri Lanka.</li>' +
    '<li>A qualification in accounting, business, finance or a related field — or equivalent practical experience.</li>' +
    '<li>You can write clear, accurate business English for correspondence with UK clients and advisers.</li>' +
    '<li>You are comfortable with spreadsheets, accounting software and online collaboration tools.</li>' +
    '<li>You are accurate with detail and methodical about records.</li>' +
    '<li>You are comfortable asking a question when something is unclear, rather than guessing.</li>' +
    '<li>You have a reliable internet connection and somewhere quiet to work, good enough for video calls during UK business hours.</li>' +
    '</ul>' +
    '<p>Desirable:</p>' +
    '<ul>' +
    '<li>Part-qualified with, or studying towards, CA Sri Lanka, CIMA, ACCA or similar.</li>' +
    '<li>Bookkeeping experience, including running reconciliations.</li>' +
    '<li>Exposure to Sri Lankan income tax and VAT filings.</li>' +
    '<li>Experience supporting HR or payroll administration.</li>' +
    '<li>Sinhala and/or Tamil, for liaison with local suppliers and authorities.</li>' +
    '</ul>' +
    '<h3>Working pattern</h3>' +
    '<p>This role is performed remotely from Sri Lanka, on a full-time-equivalent basis, coordinated to UK business hours. This is a 100% remote role; there is no office attendance.</p>' +
    '<h3>How to apply</h3>' +
    // NB: no email address here. descriptionHtml is rendered verbatim into the
    // JobPosting JSON-LD, so a plaintext address would defeat the base64
    // obfuscation used everywhere else on the page. The application form is the
    // apply route Google needs; the address is assembled client-side beside it.
    '<p>Apply through the application form on this role page. The form also gives you our careers email address if you would rather send your CV and a short covering note directly.</p>',
}

export const VACANCIES: Vacancy[] = [MANAGEMENT_TRAINEE]

export function vacancyUrl(slug: string): string {
  return `/careers/${slug}`
}
