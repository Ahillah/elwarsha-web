import { messages, type Locale } from "@core/i18n";
import { PageSection } from "@ui/patterns/PageSection/PageSection";

import { useTasks } from "./useTasks.js";
import { productFixture } from "@core/catalog/fixtures";
import { useAssignmentSubmissions } from "@features/submissions/useSubmission";
import { SubmissionStatusCard } from "@features/submissions/SubmissionStatusCard";
export function TasksPage({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const { tasks } = useTasks();
  const task = tasks?.[0];
  const {
  data: submissionsData,
  isLoading: isSubmissionsLoading,
  isFetching: isSubmissionsFetching,
  refetch,
} = useAssignmentSubmissions("cohort-01", task?.weekNumber ?? 0);

  return (
    <PageSection
      eyebrow={copy.portal.assignments}
      title={task?.title ?? copy.portal.loading}
    >
      {task ? (
  <>
    <p>
      {copy.portal.week} {task.weekNumber}
    </p>

    <SubmissionStatusCard
      repositories={productFixture.repositories ?? []}
      submissions={submissionsData?.submissions ?? []}
      assignmentTitle={task.title}
      isLoading={isSubmissionsLoading}
      isFetching={isSubmissionsFetching}
      onRefresh={() => refetch()}
    />
  </>
) : null}
    </PageSection>
  );
}
