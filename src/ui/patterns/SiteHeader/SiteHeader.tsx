import { NavLink, useNavigate } from "react-router-dom";

import { api } from "@core/api";
import { messages, type Locale } from "@core/i18n";
import { useSession } from "@core/session";
import { Badge } from "@ui/components/Badge/Badge";

import styles from "./SiteHeader.module.css";

export function SiteHeader({
  locale,
  onToggleLocale,
}: {
  locale: Locale;
  onToggleLocale: () => void;
}) {
  const copy = messages[locale];
  const prefix = `/${locale}`;
  const navigate = useNavigate();
  const sessionState = useSession();

  return (
    <header className={styles.header}>
      <NavLink className={styles.brand} to={`${prefix}/`}>
        <span className={styles.mark} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {copy.brand}
      </NavLink>
      <nav className={styles.nav} aria-label={copy.brand}>
        <NavLink to={`${prefix}/initiative/`}>{copy.nav.initiative}</NavLink>
        <NavLink to={`${prefix}/roadmap/`}>{copy.nav.roadmap}</NavLink>
        <NavLink to={`${prefix}/participation/`}>{copy.nav.participation}</NavLink>
        <NavLink to={`${prefix}/faq/`}>{copy.nav.faq}</NavLink>
        <NavLink to={`${prefix}/portal/`}>{copy.nav.portal}</NavLink>
      </nav>
      <div className={styles.actions}>
        <button className={styles.lang} type="button" onClick={onToggleLocale}>
          <Badge>{copy.language}</Badge>
        </button>

        {sessionState.status === "authenticated" && (
          <>
            <span className={styles.userName} data-testid="header-user-name">
              {sessionState.session.user.displayName}
            </span>
            <button
              type="button"
              className={styles.authBtn}
              onClick={async () => {
                await sessionState.logout();
                navigate(`${prefix}/`);
              }}
            >
              {copy.portal.signOut}
            </button>
          </>
        )}

        {sessionState.status === "unauthenticated" && (
          <a className={styles.authBtn} href={api.loginUrl({ locale })}>
            {copy.portal.logIn}
          </a>
        )}

        <NavLink className={styles.applyBtn} to={`${prefix}/apply/`}>
          {copy.nav.apply}
        </NavLink>
      </div>
    </header>
  );
}
