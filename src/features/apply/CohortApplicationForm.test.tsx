
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, ElWarshaApiError } from "@core/api";
import { CohortApplicationForm } from "./CohortApplicationForm.js";

vi.mock("@core/api", () => ({
    api: {
        applyCohort: vi.fn(),
    },
    ElWarshaApiError: class MockError extends Error {
        constructor(
            public status: number,
            public body: {
                detail?: string;
                invalidParams?: Array<{ name: string; reason: string }>;
            } | null,
        ) {
            super(body?.detail ?? `Request failed with ${status}`);
        }
    },
}));

function fillValidForm() {
    const fields: Record<string, string> = {
        "Full Name": "Ahillah Example",
        Email: "ahillah@example.com",
        "WhatsApp Number": "+201234567890",
        "GitHub Handle": "ahillah-dev",
        "Discord Handle": "ahillah",
        "Current Status": "student",
        "College Major": "Computer Engineering",
        "Programming Experience": "C# and ASP.NET Core",
        Technologies: "C#, ASP.NET Core, SQL Server",
        "Git Experience": "basics",
        "Published Personal Page Link": "https://example.com",
        "GitHub Repository Link":
            "https://github.com/ahillah/CalculatorApp",
        "AI Usage": "Used AI for explanations and debugging",
        Motivation:
            "I want to learn through practical collaboration and improve my development skills.",
    };

    for (const [label, value] of Object.entries(fields)) {
        fireEvent.change(screen.getByLabelText(label), {
            target: { value },
        });
    }
}

describe("CohortApplicationForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all four form sections", () => {
        render(<CohortApplicationForm locale="en" />);

        expect(
            screen.getByRole("group", { name: "Personal Information" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("group", {
                name: "Education and Experience",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("group", { name: "Links" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("group", {
                name: "AI Usage and Motivation",
            }),
        ).toBeInTheDocument();
    });

    it("displays backend 422 errors below the invalid fields", async () => {
        vi.mocked(api.applyCohort).mockRejectedValueOnce(
            new ElWarshaApiError(422, {
                invalidParams: [
                    {
                        name: "email",
                        reason: "Email is already registered",
                    },
                ],
            }),
        );

        render(<CohortApplicationForm locale="en" />);

        fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: "Submit Application" }),
        );

        const errorMessage = await screen.findByText(
            "Email is already registered",
        );

        const emailInput = screen.getByLabelText("Email");

        expect(emailInput.parentElement).toContainElement(errorMessage);
    });

    it("shows an alert when the backend returns a 409 conflict", async () => {
        vi.mocked(api.applyCohort).mockRejectedValueOnce(
            new ElWarshaApiError(409, {
                detail: "You have already applied to this cohort",
            }),
        );

        render(<CohortApplicationForm locale="en" />);

        fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: "Submit Application" }),
        );

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "You have already applied to this cohort",
        );
    });

    it("shows a success message after a successful submission", async () => {
        vi.mocked(api.applyCohort).mockResolvedValueOnce({
            id: "app_123456",
            cohortSlug: "cohort-2",
            email: "ahillah@example.com",
            status: "received",
            createdAt: "2026-10-10T12:00:00.000Z",
        });

        render(<CohortApplicationForm locale="en" />);

        fillValidForm();

        fireEvent.click(
            screen.getByRole("button", { name: "Submit Application" }),
        );

        expect(
            await screen.findByText("Application submitted successfully"),
        ).toBeInTheDocument();

        expect(api.applyCohort).toHaveBeenCalledOnce();
    });
});
