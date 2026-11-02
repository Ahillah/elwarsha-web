import type { messages, Locale } from "@core/i18n";
import type { Week } from "../weeks.schema.js";
import styles from "../WeeksPage.module.css";

export interface LockedWeekCardProps {
  week: Week;
  copy: (typeof messages)[Locale];
}

export function LockedWeekCard({ week, copy }: LockedWeekCardProps) {
  return (
    <div className={`${styles.weekCard} ${styles.cardLocked}`} aria-disabled="true">
      <div>
        <div className={styles.cardTop}>
          <span className={styles.weekNumber}>
            {copy.portal.week} {String(week.weekNumber).padStart(2, "0")}
          </span>
          <span className={`${styles.statusPill} ${styles.statusUpcoming}`}>
            🔒 {copy.portal.upcoming}
          </span>
        </div>

        <h2 className={styles.weekTitle}>{week.title}</h2>
      </div>

      <div className={styles.lockedFooter}>
        <span>🔒</span>
        <span>{copy.portal.lockedNotice}</span>
      </div>
    </div>
  );
}
