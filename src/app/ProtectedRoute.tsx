import { useEffect, useRef, type ReactNode } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import { api } from "@core/api";
import { isLocale, messages, type Locale } from "@core/i18n";
import { useSession, type Capability } from "@core/session";
import { ButtonLink } from "@ui/components/Button/Button";

import styles from "./ProtectedRoute.module.css";

export interface ProtectedRouteProps {
  children?: ReactNode;
  requiredCapability?: Capability;
}

export function ProtectedRoute({
  children,
  requiredCapability = "portal.view",
}: ProtectedRouteProps) {
  const params = useParams();
  const locale: Locale = isLocale(params.locale) ? params.locale : "ar";
  const copy = messages[locale];
  const sessionState = useSession();
  const errorRef = useRef<HTMLDivElement>(null);

  const isDenied =
    sessionState.status === "authenticated" &&
    !sessionState.session.capabilities.includes(requiredCapability);

  useEffect(() => {
    if (
      sessionState.status === "unauthenticated" ||
      sessionState.status === "error" ||
      isDenied
    ) {
      errorRef.current?.focus();
    }
  }, [sessionState.status, isDenied]);

  if (sessionState.status === "loading") {
    return (
      <div className={styles.centerPage}>
        <div role="status" aria-live="polite" className={styles.loading}>
          <span>{copy.portal.loading}</span>
        </div>
      </div>
    );
  }

  if (sessionState.status === "unauthenticated") {
    return (
      <div className={styles.centerPage}>
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={styles.panel}
          data-testid="signed-out-screen"
        >
          <p className={styles.eyebrow}>{copy.portal.title}</p>
          <h1 className={styles.title}>{copy.portal.signedOutTitle}</h1>
          <p className={styles.body}>{copy.portal.signedOutBody}</p>
          <div className={styles.actions}>
            <ButtonLink href={api.loginUrl({ locale })}>{copy.portal.logIn}</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState.status === "error") {
    return (
      <div className={styles.centerPage}>
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={styles.panel}
          data-testid="auth-error-screen"
        >
          <p className={styles.eyebrow}>{copy.portal.title}</p>
          <h1 className={styles.title}>{copy.portal.authFailedTitle}</h1>
          <p className={styles.body}>{copy.portal.authFailedBody}</p>
          <div className={styles.actions}>
            <ButtonLink href={api.loginUrl({ locale })}>{copy.portal.logIn}</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  if (isDenied) {
    return (
      <div className={styles.centerPage}>
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={styles.panel}
          data-testid="access-denied-screen"
        >
          <p className={styles.eyebrow}>{copy.portal.title}</p>
          <h1 className={styles.title}>{copy.portal.accessDeniedTitle}</h1>
          <p className={styles.body}>{copy.portal.accessDeniedBody}</p>
          <div className={styles.actions}>
            <Link to={`/${locale}/`} className={styles.body}>
              {copy.portal.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet context={locale} />;
}
