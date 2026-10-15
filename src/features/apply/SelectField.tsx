
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./CohortApplicationForm.module.css";

type SelectOption = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label: string;
    options: SelectOption[];
    registration: UseFormRegisterReturn;
    error?: string;
};

function SelectField({
    label,
    options,
    registration,
    error,
}: SelectFieldProps) {
    const id = registration.name;

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>

            <select
                className={styles.input}
                id={id}
                {...registration}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            >
                <option value="">Select an option</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className={styles.error} id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default SelectField;
