
export type CurrentStatus =
    | "student"
    | "recent_graduate"
    | "employed_tech"
    | "career_switcher"
    | "other";

export type GitExperience =
    | "none"
    | "basics"
    | "comfortable";
export interface CohortApplicationFormValues {
    fullName: string;
    email: string;
    whatsappNumber: string;
    githubHandle: string;
    discordHandle: string;
    currentStatus: CurrentStatus;
    collegeMajor: string;
    programmingExperience: string;
    technologies: string;
    gitExperience: GitExperience;
    personalPageUrl: string;
    githubRepoUrl: string;
    aiUsage: string;
    motivation: string;
}
