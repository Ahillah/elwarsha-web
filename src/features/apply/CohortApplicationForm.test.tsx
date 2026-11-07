import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { api, ElWarshaApiError } from "@core/api";
import { CohortApplicationForm } from "./CohortApplicationForm.js";
import userEvent from "@testing-library/user-event";

vi.mock("@core/api", () => {
  class MockElWarshaApiError extends Error {
    constructor(
      readonly status: number,
      readonly body: {
        detail?: string;
        invalidParams?: Array<{ name: string; reason: string }>;
      } | null,
    ) {
      super(body?.detail ?? "Mock error");
    }
  }

  return {
    api: {
      applyCohort: vi.fn(),
    },
    ElWarshaApiError: MockElWarshaApiError,
  };
});

describe("CohortApplicationForm", () => {
  beforeEach(() => {
    vi.mocked(api.applyCohort).mockReset();
  });

  it("renders all four sections and the submit button", () => {
    render(<CohortApplicationForm locale="en" />);
    // using getByRole
    expect(
      screen.getByRole("group", { name: /Personal & Contact Information/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Academic & Technical Background/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Personal Page Task/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Motivation & Commitment/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Submit Application/i }),
    ).toBeInTheDocument();
  });

  it("displays structured validation errors (422) below problematic inputs", async () => {
    const error422 = new ElWarshaApiError(422, {
      type: "https://elwarsha.dev/errors/validation-failed",
      title: "Validation Failed",
      status: 422,
      detail: "Validation failed",
      invalidParams: [
        { name: "email", reason: "Must be a valid email address" },
        { name: "motivation", reason: "Motivation must be at least 50 characters" },
      ],
    });

    vi.mocked(api.applyCohort).mockRejectedValueOnce(error422);

    const user = userEvent.setup();

    render(<CohortApplicationForm locale="en" />);
    // using userEvent to click the submit button to ensure all validations are triggered
    await user.click(screen.getByRole("button", { name: /Submit Application/i }));

    expect(await screen.findByText("Must be a valid email address")).toBeInTheDocument();
    expect(
      screen.getByText("Motivation must be at least 50 characters"),
    ).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Email Address/i);
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    // expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
    // Check the email error message instead of its ID.
    expect(emailInput).toHaveAccessibleDescription(/valid email/i);
  });

  it("displays duplicate submission conflict (409) in a global alert", async () => {
    const error409 = new ElWarshaApiError(409, {
      type: "https://elwarsha.dev/errors/duplicate-application",
      status: 409,
      detail:
        "An application with this email or GitHub handle already exists for cohort-2",
    });

    vi.mocked(api.applyCohort).mockRejectedValueOnce(error409);
    const user = userEvent.setup();
    render(<CohortApplicationForm locale="en" />);

    //fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));
    await user.click(screen.getByRole("button", { name: /Submit Application/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/already exists/i);
  });

  it("displays a confirmation receipt card upon 201 Created", async () => {
    vi.mocked(api.applyCohort).mockResolvedValueOnce({
      id: "app_7b2f1e9a",
      cohortSlug: "cohort-2",
      email: "sara@example.com",
      status: "received",
      createdAt: new Date().toISOString(),
    });

    const user = userEvent.setup();
    render(<CohortApplicationForm locale="en" />);

    /*fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Sara Mahmoud" },
    });*/
    await user.type(screen.getByLabelText(/Full Name/i), "Sara Mahmoud");
    /*
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "sara@example.com" },
    });
*/
    await user.type(screen.getByLabelText(/Email Address/i), "sara@example.com");
    /*
    fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));

*/
    await user.click(screen.getByRole("button", { name: /Submit Application/i }));

    // fireEvent.click(screen.getByRole("button", { name: /Submit Application/i }));
    expect(await screen.findByText(/Application Received!/i)).toBeInTheDocument();
    // Use queryByRole to check that the element is not present
    expect(
      screen.queryByRole("button", { name: /Submit Application/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("app_7b2f1e9a")).toBeInTheDocument();
  });
});
