import { Link } from "react-router-dom";
import type { messages, Locale } from "@core/i18n";
import type { Week } from "../weeks.schema.js";
import styles from "../WeeksPage.module.css";

export interface WeekCardProps {
  week: Week;
  cohortSlug: string;
  locale: Locale;
  copy: (typeof messages)[Locale];
}

export function WeekCard({ week, cohortSlug, locale, copy }: WeekCardProps) {
  const isActive = !week.isLocked && (week.isCurrent || week.status === "active");
  const statusText =
    week.status === "completed" ? copy.portal.completed : copy.portal.inProgress;

  const statusClass =
    week.status === "completed" ? styles.statusCompleted : styles.statusActive;

  return (
    <Link
      to={`/${locale}/portal/cohorts/${cohortSlug}/weeks/${week.weekNumber}`}
      className={`${styles.weekCard} ${isActive ? styles.cardActive : ""}`}
    >
      <div>
        <div className={styles.cardTop}>
          <span className={styles.weekNumber}>
            {copy.portal.week} {String(week.weekNumber).padStart(2, "0")}
          </span>
          <span className={`${styles.statusPill} ${statusClass}`}>{statusText}</span>
        </div>

        <span className={styles.conceptTag}>{week.concept}</span>
        <h2 className={styles.weekTitle}>{week.title}</h2>
        <p className={styles.guidingQuestion}>{week.guidingQuestion}</p>
      </div>

      <div className={styles.assignmentSection}>
        {week.assignment ? (
          <>
            <p className={styles.assignmentLabel}>{copy.portal.assignmentDetails}</p>
            <p className={styles.assignmentTitle}>{week.assignment.title}</p>
            {week.assignment.labels.length > 0 && (
              <div className={styles.labelsList}>
                {week.assignment.labels.map((label: string) => (
                  <span key={label} className={styles.tagPill}>
                    #{label}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.assignmentLabel}>{copy.portal.upcoming}</p>
        )}

        <div className={styles.cardFooter}>
          <span>{copy.portal.viewWeek}</span>
          <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
        </div>
      </div>
    </Link>
  );
}
