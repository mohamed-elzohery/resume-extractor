import type { BuiltInExtractorKey } from '../types/extractor.types';
import type { BaseExtractor } from './base/BaseExtractor';
import { CertificationExtractor } from './implementations/CertificationExtractor';
import { ContactExtractor } from './implementations/ContactExtractor';
import { EducationExtractor } from './implementations/EducationExtractor';
import { ExperienceExtractor } from './implementations/ExperienceExtractor';
import { HonorsExtractor } from './implementations/HonorsExtractor';
import { LanguageExtractor } from './implementations/LanguageExtractor';
import { ProjectExtractor } from './implementations/ProjectExtractor';
import { SkillsExtractor } from './implementations/SkillsExtractor';
import { SocialLinksExtractor } from './implementations/SocialLinksExtractor';
import { SummaryExtractor } from './implementations/SummaryExtractor';

type ExtractorFactoryFn = () => BaseExtractor;

const registry = new Map<string, ExtractorFactoryFn>();

const builtInFactories: Record<BuiltInExtractorKey, ExtractorFactoryFn> = {
    contact: () => new ContactExtractor(),
    experience: () => new ExperienceExtractor(),
    education: () => new EducationExtractor(),
    skills: () => new SkillsExtractor(),
    projects: () => new ProjectExtractor(),
    certification: () => new CertificationExtractor(),
    language: () => new LanguageExtractor(),
    summary: () => new SummaryExtractor(),
    honors: () => new HonorsExtractor(),
    social_links: () => new SocialLinksExtractor(),
};

Object.entries(builtInFactories).forEach(([key, factory]) => {
    registry.set(key, factory);
});

export const ExtractorRegistry = {
    register(key: string, factory: ExtractorFactoryFn) {
        registry.set(key, factory);
    },
    has(key: string) {
        return registry.has(key);
    },
    create(key: string): BaseExtractor {
        const factory = registry.get(key);
        if (!factory) {
            throw new Error(`Extractor "${key}" is not registered.`);
        }
        return factory();
    },
    list(): string[] {
        return Array.from(registry.keys());
    },
};
