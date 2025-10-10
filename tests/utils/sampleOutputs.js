import { ExtractorRegistry } from '../../src/extractors/ExtractorRegistry';
const location = { country: 'USA', city: 'New York' };
const date = { year: 2020, month: 1 };
const SAMPLE_OUTPUTS = {
    contact: {
        first_name: 'John',
        last_name: 'Doe',
        phone: null,
        title: 'Software Engineer',
        location,
        email: 'john.doe@example.com',
    },
    experience: [
        {
            title: 'Senior Engineer',
            company: 'Acme Corp',
            location: 'Remote',
            employment_type: 'Full-time',
            description: 'Did important things.',
            start_date: date,
            end_date: null,
            department: null,
            is_current: true,
        },
    ],
    education: [
        {
            school: 'Example University',
            degree: 'BSc Computer Science',
            field_of_study: 'Computer Science',
            description: 'Studied CS.',
            start_date: date,
            end_date: date,
        },
    ],
    skills: [
        {
            name: 'TypeScript',
            level: 8,
        },
    ],
    projects: [
        {
            name: 'Resume Extractor',
            start_date: date,
            end_date: null,
            description: 'Built resume parser.',
            associated_employer: 'Acme Corp',
        },
    ],
    certification: [
        {
            name: 'AWS Solutions Architect',
            organization: 'Amazon',
            issue_date: '2023-01-01',
            expiration_date: null,
            description: 'Cloud certification.',
            url: null,
        },
    ],
    language: [
        {
            name: 'English',
            proficiency: 9,
        },
    ],
    summary: {
        title: 'Lead Engineer',
        short_summary: 'Experienced engineer.',
        full_summary: 'Experienced engineer with leadership background.',
    },
    honors: [
        {
            title: 'Employee of the Year',
            date: '2022',
            issuer: 'Acme Corp',
            description: 'Awarded for outstanding contributions.',
        },
    ],
    social_links: [
        {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/johndoe',
            username: 'johndoe',
        },
    ],
};
export const getSampleOutput = (key) => {
    const extractor = ExtractorRegistry.create(key);
    const schema = extractor.getSchema();
    const sample = SAMPLE_OUTPUTS[key];
    // Validate at build time to ensure structure matches schema
    schema.parse(sample);
    return sample;
};
export const getAllSampleOutputs = () => {
    return Object.entries(SAMPLE_OUTPUTS).map(([key, value]) => ({
        key: key,
        value,
    }));
};
//# sourceMappingURL=sampleOutputs.js.map