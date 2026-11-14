
import type { RepositorySubmissionItem } from "@core/api";
import styles from "./SubmissionStatusCard.module.css";

type Repository = {
  githubOwner: string;
  githubRepo: string;
};

type Props = {
  repositories: Repository[];
  submissions: RepositorySubmissionItem[];
  assignmentTitle: string;
  isLoading: boolean;
  isFetching: boolean;
  onRefresh: () => void;
};

type SubmissionState = "draft" | "submitted" | "in_review" | "merged";

function getSubmissionState(
  submission?: RepositorySubmissionItem,
): SubmissionState {
  if (!submission) return "draft";

  if (
    submission.status === "merged" ||
    submission.pullRequest?.state === "merged"
  ) {
    return "merged";
  }

  if (
    submission.status === "in_review" ||
    submission.pullRequest?.state === "open"
  ) {
    return "in_review";
  }

  return "submitted";
}

function findSubmission(
  submissions: RepositorySubmissionItem[],
  { githubOwner, githubRepo }: Repository,
) {
  return submissions.find(
    (item) =>
      item.productRepository.githubOwner === githubOwner &&
      item.productRepository.githubRepo === githubRepo,
  );
}

function PullRequestLink({
  url,
  label,
}: {
  url?: string | null;
  label: string;
}) {
  if (!url) return null;

  return (
    <a
      className={styles.prLink}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
    >
      View Pull Request
    </a>
  );
}

function RepositoryStatus({
  repository,
  submission,
  assignmentTitle,
}: {
  repository: Repository;
  submission?: RepositorySubmissionItem;
  assignmentTitle: string;
}) {
  const name = `${repository.githubOwner}/${repository.githubRepo}`;
  const state = getSubmissionState(submission);
  const prUrl = submission?.prUrl;

  return (
    <article className={styles.repoCard}>
      <h3 className={styles.repoName}>
        <a
          className={styles.repoLink}
          href={`https://github.com/${name}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${name} GitHub repository`}
        >
          {name}
        </a>
      </h3>

      {state === "draft" && (
        <>
          <p className={`${styles.badge} ${styles.badgeDraft}`}>Draft</p>

          <p className={styles.instructions}>
            Open a Pull Request with a title like:{" "}
            <code className={styles.code}>
              [week-06] {assignmentTitle}
            </code>
          </p>

          <p className={styles.hint}>
            Your submission status will sync automatically when the page loads.
          </p>
        </>
      )}

      {state === "merged" && (
        <>
          <p className={`${styles.badge} ${styles.badgeMerged}`}>
            ✓ Merged
          </p>

          <p className={styles.message}>
            Your Pull Request has been merged into main.
          </p>

          <PullRequestLink
            url={prUrl}
            label={`Open merged pull request for ${name}`}
          />
        </>
      )}

      {state === "in_review" && (
        <>
          <p className={`${styles.badge} ${styles.badgeReview}`}>
            ● In Review
          </p>

          {submission?.pullRequest && (
            <p className={styles.meta}>
              PR #{submission.pullRequest.number} —{" "}
              {submission.pullRequest.state}
            </p>
          )}

          <PullRequestLink
            url={prUrl}
            label={`Open pull request for ${name}`}
          />
        </>
      )}

      {state === "submitted" && (
        <>
          <p className={`${styles.badge} ${styles.badgeSubmitted}`}>
            Submitted
          </p>

          <PullRequestLink
            url={prUrl}
            label={`Open pull request for ${name}`}
          />
        </>
      )}
    </article>
  );
}

export function SubmissionStatusCard({
  repositories,
  submissions,
  assignmentTitle,
  isLoading,
  isFetching,
  onRefresh,
}: Props) {
  if (isLoading) {
    return (
      <section
        className={styles.card}
        role="region"
        aria-label="Submission status"
        aria-live="polite"
        aria-busy="true"
      >
        <p className={styles.loading}>Loading submission status...</p>
      </section>
    );
  }

  return (
    <section
      className={styles.card}
      role="region"
      aria-label="Submission status"
      aria-live="polite"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Submission Progress</h2>

        <button
          className={styles.refreshButton}
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "↻ Refresh from GitHub"}
        </button>
      </div>

      <div className={styles.list}>
        {repositories.map((repository) => (
          <RepositoryStatus
            key={`${repository.githubOwner}/${repository.githubRepo}`}
            repository={repository}
            submission={findSubmission(submissions, repository)}
            assignmentTitle={assignmentTitle}
          />
        ))}
      </div>
    </section>
  );
}
