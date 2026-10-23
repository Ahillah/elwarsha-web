import { useParams } from "react-router-dom";

import { messages, type Locale } from "@core/i18n";
import styles from "./WeeksPage.module.css";
import { useCohortWeeks } from "./useCohortWeeks.js";
import { CohortHeaderBar } from "./components/CohortHeaderBar.js";
import { WeekCard } from "./components/WeekCard.js";
import { LockedWeekCard } from "./components/LockedWeekCard.js";

/**
 * Week 3 Assignment: Weeks Summary Page
 *
 * Requirements:
 * 1. Backend: In elwarsha-api, add `currentWeekNumber Int @default(1)` to the Cohort model,
 *    run `prisma migrate dev --name add_cohort_current_week`, and wire it into WeeksService.
 * 2. Data fetching: Implement `useCohortWeeks(cohortSlug, locale)` in `useCohortWeeks.ts` using
 *    TanStack React Query (`useQuery`) and validate data with Zod schemas in `weeks.schema.ts`.
 * 3. Components (1 component per file):
 *    - `CohortHeaderBar.tsx`: Displays cohort title, start/end dates, and current week progress.
 *    - `WeekCard.tsx`: Displays an unlocked week card with badges, concept, and link to detail page.
 *    - `LockedWeekCard.tsx`: Displays a locked week card with padlock icon and disabled link.
 * 4. WeeksPage: Consume `useCohortWeeks`, render loading and error states, and map the cards.
 * 5. Testing: Add test coverage in `WeeksPage.test.tsx`.
 *
 * Reference:
 * Inspect `WeekDetailPage.tsx` and `useCohortWeekDetail.ts` for an end-to-end working example.
 */
export function WeeksPage({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const { cohortSlug = "cohort-01" } = useParams();
  const { data: weeks, isLoading, isError  , error} = useCohortWeeks(cohortSlug, locale);
  if(isLoading)
  {
    return <p>{copy.portal.loading}</p>
  }
  if(isError || !weeks)
  {
    return <p>
      {error instanceof Error ? error.message : copy.portal.weekNotFoundBody}
    </p>
  }
  const cohort = weeks[0]?.cohort;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {cohort && <CohortHeaderBar cohort={cohort} />}

        <p className={styles.eyebrow}>{copy.portal.weeks}</p>
        <h1>{copy.portal.weeksOverview}</h1>
        <p className={styles.lead}>{copy.portal.weeksSubtitle}</p>
      </header>
  

  
<section className={styles.weeksGrid}>
  {weeks.length === 0 ? (
    <p>
      {locale === "ar"
        ? "لا توجد أسابيع متاحة حاليًا"
        : "No weeks available yet"}
    </p>
  ) : (
    weeks.map((week) =>
      week.isLocked ? (
        <LockedWeekCard
          key={week.weekNumber}
          week={week}
          locale={locale}
        />
      ) : (
        <WeekCard
          key={week.weekNumber}
          week={week}
          locale={locale}
        />
      ),
    )
  )}
</section>

    </div>
  );
}
