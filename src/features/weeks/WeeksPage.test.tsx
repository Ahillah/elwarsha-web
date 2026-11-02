import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@core/api";
import { renderWithQueryClient } from "@test/query-wrapper";
import { WeeksPage } from "./WeeksPage.js";

import type { Week } from "./weeks.schema.js";

vi.mock("@core/api", () => ({
  api: {
    listCohortWeeks: vi.fn(),
  },
}));

describe("WeeksPage", () => {
  const sampleWeeks: Week[] = [
    {
      weekNumber: 1,
      title: "Navigate the codebase and trace system boundaries",
      tagline: "Find boundaries before changing code",
      concept: "Architecture and modularity",
      guidingQuestion: "How does a request travel without breaking boundaries?",
      startDate: "2026-10-01",
      endDate: "2026-10-07",
      isCurrent: true,
      status: "active",
      isLocked: false,
      cohort: {
        id: "cohort-1",
        slug: "cohort-01",
        name: "Cohort 01",
        currentWeekNumber: 3,
        startsOn: "2026-10-01",
        endsOn: "2026-11-26",
      },
      bigIdea: "Trace a complete vertical slice through the architecture.",
      outcomes: ["Trace a request from HTTP entry to module"],
      coreConcepts: ["Separation of concerns", "Dependency injection"],
      appliedThroughTheStack: [
        { layer: "React", details: "Feature folders and state hooks" },
      ],
      assignment: {
        id: "assignment-1",
        title: "Navigate the codebase and open a focused PR",
        summary: "Understand boundaries and open PR",
        status: "published",
        labels: ["frontend", "backend", "review"],
        detailsMd: "### Deliverables\n- Open PR",
      },
      resources: {
        required: [],
        assignment: [],
        alternative: [],
      },
      reflectionQuestion: "Which boundary would you break?",
      prerequisites: [],
    },
    {
      weekNumber: 2,
      title: "Connecting Frontend & Backend",
      concept: "",
      guidingQuestion: "",
      startDate: "2026-10-08",
      endDate: "2026-10-14",
      isCurrent: false,
      status: "upcoming",
      isLocked: true,
      cohort: {
        id: "cohort-1",
        slug: "cohort-01",
        name: "Cohort 01",
        currentWeekNumber: 3,
        startsOn: "2026-10-01",
        endsOn: "2026-11-26",
      },
      bigIdea: "",
      outcomes: [],
      coreConcepts: [],
      appliedThroughTheStack: [],
      assignment: null,
      resources: {
        required: [],
        assignment: [],
        alternative: [],
      },
      reflectionQuestion: "",
      prerequisites: [],
    },
  ];

  beforeEach(() => {
    vi.mocked(api.listCohortWeeks).mockReset();
  });

  it("renders error state when fetch fails", async () => {
    vi.mocked(api.listCohortWeeks).mockRejectedValue(new Error("Network error"));

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/en/portal/cohorts/cohort-01/weeks"]}>
        <Routes>
          <Route
            path="/:locale/portal/cohorts/:cohortSlug/weeks"
            element={<WeeksPage locale="en" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Weeks" })).toBeInTheDocument();
    expect(
      screen.getByText("Something broke in the workshop. Reload and try again."),
    ).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders cohort banner and week cards when loaded", async () => {
    vi.mocked(api.listCohortWeeks).mockResolvedValue(sampleWeeks);

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/en/portal/cohorts/cohort-01/weeks"]}>
        <Routes>
          <Route
            path="/:locale/portal/cohorts/:cohortSlug/weeks"
            element={<WeeksPage locale="en" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Cohort Weeks Overview" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cohort 01")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Navigate the codebase and trace system boundaries",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Architecture and modularity")).toBeInTheDocument();
    expect(screen.getByText("#frontend")).toBeInTheDocument();

    const weekLinks = screen.getAllByRole("link");
    expect(weekLinks[0]).toHaveAttribute("href", "/en/portal/cohorts/cohort-01/weeks/1");
  });

  it("renders Arabic labels in Arabic locale", async () => {
    const arabicWeeks = [
      {
        ...sampleWeeks[0],
        title: "استكشاف الكود وتتبع حدود النظام",
        concept: "المعمارية والوحدات",
        guidingQuestion: "إزاي الطلب بيمشي؟",
        cohort: {
          ...sampleWeeks[0].cohort,
          name: "الدفعة الأولى",
          nameAr: "الدفعة الأولى",
        },
      },
    ];
    vi.mocked(api.listCohortWeeks).mockResolvedValue(arabicWeeks);

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/ar/portal/cohorts/cohort-01/weeks"]}>
        <Routes>
          <Route
            path="/:locale/portal/cohorts/:cohortSlug/weeks"
            element={<WeeksPage locale="ar" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "نظرة عامة على أسابيع الدفعة" }),
    ).toBeInTheDocument();
    expect(screen.getByText("الدفعة الأولى")).toBeInTheDocument();
    expect(screen.getByText("استكشاف الكود وتتبع حدود النظام")).toBeInTheDocument();
    expect(screen.getByText("المعمارية والوحدات")).toBeInTheDocument();
  });

  it("renders upcoming weeks as locked showing only title without concept or assignment", async () => {
    vi.mocked(api.listCohortWeeks).mockResolvedValue(sampleWeeks);

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/en/portal/cohorts/cohort-01/weeks"]}>
        <Routes>
          <Route
            path="/:locale/portal/cohorts/:cohortSlug/weeks"
            element={<WeeksPage locale="en" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Connecting Frontend & Backend",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByText("State and data modeling")).not.toBeInTheDocument();
    expect(
      screen.queryByText("How do frontend and backend communicate?"),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Locked until week begins/i)).toBeInTheDocument();

    const weekLinks = screen.getAllByRole("link");
    expect(weekLinks).toHaveLength(1);
    expect(weekLinks[0]).toHaveAttribute("href", "/en/portal/cohorts/cohort-01/weeks/1");
  });
});
