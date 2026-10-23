import type { Week } from "../weeks.schema.js";
import type { Locale } from "@core/i18n";
import styles from "../WeeksPage.module.css";

export interface LockedWeekCardProps {
  week: Week;
  locale: Locale;
}

export function LockedWeekCard({
  week,
  locale,
}: LockedWeekCardProps) {

return (
  <article className={`${styles.weekCard} ${styles.cardLocked}`}>
    <div>
      <div className={styles.cardTop}>
        <span className={styles.weekNumber}>
          Week {week.weekNumber}
        </span>

        <span aria-hidden="true">🔒</span>
      </div>

      <p className={styles.conceptTag}>{week.concept}</p>

      <h2 className={styles.weekTitle}>{week.title}</h2>
    </div>

    <div className={styles.lockedFooter}>
      <span aria-hidden="true">🔒</span>
      <span>Week details are locked</span>
    </div>
  </article>
);

}