import { Badge } from "@ui/components/Badge/Badge";
import styles from "../WeeksPage.module.css";

export interface CohortHeaderBarProps {
  cohort: {
    name: string;
    slug: string;
    startsOn: string;
    endsOn: string;
  };
}

export function CohortHeaderBar({ cohort }: CohortHeaderBarProps) {
  return (
    <div className={styles.cohortBar}>
      <div className={styles.cohortInfo}>
        <span className={styles.cohortName}>{cohort.name}</span>
        <span className={styles.cohortDates}>
          {cohort.startsOn} — {cohort.endsOn}
        </span>
      </div>
      <Badge>{cohort.slug}</Badge>
    </div>
  );
}
