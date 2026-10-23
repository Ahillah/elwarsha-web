import  type { CohortRef } from "@features/weeks/weeks.schema.js";
import { Badge } from "@ui/components/Badge/Badge.js";
import styles from "../WeeksPage.module.css";
export interface CohortHeaderBarProps 
{
   cohort : CohortRef
}


export function CohortHeaderBar ({cohort}: CohortHeaderBarProps)
 {

return (
  <div className={styles.cohortBar}>
    <div className={styles.cohortInfo}>
      <span className={styles.cohortName}>{cohort.name}</span>

      <span className={styles.cohortDates}>
        {cohort.startsOn} – {cohort.endsOn}
      </span>
    </div>

    <Badge>
      Week {cohort.currentWeekNumber}
    </Badge>
  </div>
);



 }