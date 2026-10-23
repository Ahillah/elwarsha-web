import type { Week } from "../weeks.schema.js";
import { Badge } from "@ui/components/Badge/Badge.js";
import { Link } from "react-router-dom";
import type { Locale } from "@core/i18n";
import styles from "../WeeksPage.module.css";

export interface WeekCardProps {
  week: Week;
locale: Locale;
}

export function WeekCard({ week, locale }: WeekCardProps) {
  
return (
  <Link
    className={`${styles.weekCard} ${
      week.status === "active" ? styles.cardActive : ""
    }`}
    to={`/${locale}/portal/cohorts/${week.cohort.slug}/weeks/${week.weekNumber}`}
  >
    <div>
      <div className={styles.cardTop}>
        <span className={styles.weekNumber}>
          Week {week.weekNumber}
        </span>

        <Badge>{week.status}</Badge>
      </div>

      <p className={styles.conceptTag}>{week.concept}</p>

      <h2 className={styles.weekTitle}>{week.title}</h2>

      {week.guidingQuestion && (
        <p className={styles.guidingQuestion}>
          {week.guidingQuestion}
        </p>
      )}
    </div>

    <div className={styles.cardFooter}>
      <span>View week details →</span>
    </div>
  </Link>
);

}
