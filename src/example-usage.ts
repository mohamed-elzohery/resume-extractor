import { ContactExtractor, ExperienceExtractor, EducationExtractor } from './extractors';

/**
 * Example usage of the extractor classes
 */
async function extractResumeData(resumeText: string) {
    // Initialize extractors
    const contactExtractor = new ContactExtractor();
    const experienceExtractor = new ExperienceExtractor();
    const educationExtractor = new EducationExtractor();

    try {
        // Extract different sections
        const contactInfo = await contactExtractor.extract(resumeText);
        const experiences = await experienceExtractor.extract(resumeText);
        const education = await educationExtractor.extract(resumeText);

        return {
            contact: contactInfo,
            experience: experiences,
            education: education
        };
    } catch (error) {
        console.error('Error extracting resume data:', error);
        throw error;
    }
}

export { extractResumeData };