import { useQuery } from "@tanstack/react-query";

import { api } from "@core/api";
import type { Locale } from "@core/i18n";
import { weekSchema, type Week } from "./weeks.schema.js";

export function useCohortWeeks(
  cohortSlug: string,
  locale: Locale,
  options?: { enabled?: boolean },
) {
  return useQuery<Week[]>({
    queryKey: ["cohorts", cohortSlug, "weeks", { locale }],
    queryFn: async () => {
      const data = await api.listCohortWeeks(cohortSlug, { locale });
      return weekSchema.array().parse(data);
    },
    enabled: Boolean(cohortSlug) && (options?.enabled ?? true),
  });
}
