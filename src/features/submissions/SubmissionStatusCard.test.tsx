
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RepositorySubmissionItem } from "@core/api";
import { SubmissionStatusCard } from "./SubmissionStatusCard.js";

const repositories = [
  { githubOwner: "El-warsha", githubRepo: "elwarsha-web" },
  { githubOwner: "El-warsha", githubRepo: "elwarsha-api" },
];

const baseProps = {
  repositories,
  submissions: [] as RepositorySubmissionItem[],
  assignmentTitle: "Refactor modules",
  isLoading: false,
  isFetching: false,
  onRefresh: vi.fn(),
};

describe("SubmissionStatusCard", () => {
  it("renders loading state", () => {
    render(
      <SubmissionStatusCard {...baseProps} isLoading={true} />,
    );

    expect(
      screen.getByText("Loading submission status..."),
    ).toBeInTheDocument();
  });

  it("renders repositories in draft state", () => {
    render(<SubmissionStatusCard {...baseProps} />);

    expect(screen.getByText("El-warsha/elwarsha-web")).toBeInTheDocument();
    expect(screen.getByText("El-warsha/elwarsha-api")).toBeInTheDocument();

    expect(screen.getAllByText("Draft")).toHaveLength(2);

    expect(
      screen.getAllByText("[week-06] Refactor modules"),
    ).toHaveLength(2);
  });

  it("renders an open pull request", () => {
    const submission = {
      ...({} as RepositorySubmissionItem),
      status: "in_review",
      prUrl: "https://github.com/El-warsha/elwarsha-web/pull/42",
      productRepository: {
        githubOwner: "El-warsha",
        githubRepo: "elwarsha-web",
      },
      pullRequest: {
        number: 42,
        state: "open",
      },
    } as RepositorySubmissionItem;

    render(
      <SubmissionStatusCard
        {...baseProps}
        submissions={[submission]}
      />,
    );

    expect(screen.getByText("● In Review")).toBeInTheDocument();
    expect(screen.getByText(/PR #42/)).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Open pull request for El-warsha/elwarsha-web",
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/El-warsha/elwarsha-web/pull/42",
    );
  });

  it("renders merged state", () => {
    const submission = {
      ...({} as RepositorySubmissionItem),
      status: "merged",
      productRepository: {
        githubOwner: "El-warsha",
        githubRepo: "elwarsha-web",
      },
      pullRequest: null,
    } as RepositorySubmissionItem;

    render(
      <SubmissionStatusCard
        {...baseProps}
        submissions={[submission]}
      />,
    );

    expect(screen.getByText("✓ Merged")).toBeInTheDocument();

    expect(
      screen.getByText("Your Pull Request has been merged into main."),
    ).toBeInTheDocument();
  });

  it("calls onRefresh when clicking refresh button", async () => {
    const onRefresh = vi.fn();
    const user = userEvent.setup();

    render(
      <SubmissionStatusCard {...baseProps} onRefresh={onRefresh} />,
    );

    await user.click(
      screen.getByRole("button", { name: "↻ Refresh from GitHub" }),
    );

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
