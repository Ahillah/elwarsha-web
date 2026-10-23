import { z } from "zod";

export const cohortRefSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  nameAr: z.string().nullable().optional(),
  currentWeekNumber: z.number().int().min(1).max(8),
  startsOn: z.string(),
  endsOn: z.string(),

});

export const weekResourceItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  layers: z.string(),
  format: z.string(),
  time: z.string(),
  why: z.string(),
});

export const weekResourcesSchema = z.object({
  required: z.array(weekResourceItemSchema).default([]),
  assignment: z.array(weekResourceItemSchema).default([]),
  alternative: z.array(weekResourceItemSchema).default([]),
});

export const weekAppliedLayerSchema = z.object({
  layer: z.string(),
  details: z.string(),
});

export const weekAssignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  summary: z.string().default(""),
  status: z.enum(["draft", "published", "closed"]),
  labels: z.array(z.string()).default([]),
  detailsMd: z.string().default(""),
});

export const weekSchema = z.object({
  weekNumber: z.number().int().min(1).max(8),
  title: z.string(),
  tagline: z.string().optional(),
  concept: z.string().default(""),
  guidingQuestion: z.string().default(""),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["completed", "active", "upcoming", "draft"]),
  isCurrent: z.boolean(),
  isLocked: z.boolean().default(false),
  cohort: cohortRefSchema,
  bigIdea: z.string().default(""),
  outcomes: z.array(z.string()).default([]),
  coreConcepts: z.array(z.string()).default([]),
  appliedThroughTheStack: z.array(weekAppliedLayerSchema).default([]),
  assignment: weekAssignmentSchema.nullable(),
  resources: weekResourcesSchema.default({
    required: [],
    assignment: [],
    alternative: [],
  }),
  reflectionQuestion: z.string().default(""),
  prerequisites: z.array(z.string()).default([]),
});

export type CohortRef = z.infer<typeof cohortRefSchema>;
export type WeekResourceItem = z.infer<typeof weekResourceItemSchema>;
export type WeekResources = z.infer<typeof weekResourcesSchema>;
export type WeekAppliedLayer = z.infer<typeof weekAppliedLayerSchema>;
export type WeekAssignment = z.infer<typeof weekAssignmentSchema>;
export type Week = z.infer<typeof weekSchema>;
