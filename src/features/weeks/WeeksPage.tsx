import { useParams } from "react-router-dom";

import { messages, type Locale } from "@core/i18n";
import { PageSection } from "@ui/patterns/PageSection/PageSection";
import { StatePanel } from "@ui/patterns/StatePanel/StatePanel";
import { useCohortWeeks } from "./useCohortWeeks.js";
import { CohortHeaderBar } from "./components/CohortHeaderBar.js";
import { WeekCard } from "./components/WeekCard.js";
import { LockedWeekCard } from "./components/LockedWeekCard.js";

import styles from "./WeeksPage.module.css";

export function WeeksPage({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const { cohortSlug = "cohort-01" } = useParams();
  const { data: weeks, isLoading, isError, error } = useCohortWeeks(cohortSlug, locale);

  if (isLoading) {
    return (
      <PageSection eyebrow={copy.portal.title} title={copy.portal.loading}>
        <StatePanel title={copy.portal.loading} body="" />
      </PageSection>
    );
  }

  if (isError || !weeks) {
    return (
      <PageSection eyebrow={copy.portal.title} title={copy.portal.weeks}>
        <StatePanel
          title={copy.error}
          body={error instanceof Error ? error.message : copy.portal.empty}
        />
      </PageSection>
    );
  }

  const cohort = weeks[0]?.cohort;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{copy.portal.title}</p>
        <h1>{copy.portal.weeksOverview}</h1>
        <p className={styles.lead}>{copy.portal.weeksSubtitle}</p>

        {cohort && <CohortHeaderBar cohort={cohort} />}
      </header>

      <div className={styles.weeksGrid}>
        {weeks.map((week) => {
          const isLocked = week.isLocked || week.status === "upcoming";

          if (isLocked) {
            return <LockedWeekCard key={week.weekNumber} week={week} copy={copy} />;
          }

          return (
            <WeekCard
              key={week.weekNumber}
              week={week}
              cohortSlug={cohortSlug}
              locale={locale}
              copy={copy}
            />
          );
        })}
      </div>
    </main>
  );
}
