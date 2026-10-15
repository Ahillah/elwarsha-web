
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./CohortApplicationForm.module.css";

type FormFieldProps = {
    label: string;
    type?: "text" | "email" | "tel" | "url" | "textarea";
    error?: string;
    registration: UseFormRegisterReturn;
};

function FormField({
    label,
    type = "text",
    error,
    registration,
}: FormFieldProps) {
    const id = registration.name;

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    className={styles.input}
                    id={id}
                    {...registration}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            ) : (
                <input
                    className={styles.input}
                    id={id}
                    type={type}
                    {...registration}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            )}

            {error && (
                <p className={styles.error} id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default FormField;
