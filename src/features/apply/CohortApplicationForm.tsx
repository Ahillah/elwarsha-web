
import { useForm } from "react-hook-form";
import { messages, type Locale } from "@core/i18n";
import styles from "./CohortApplicationForm.module.css";
import FormField from "./FormField";
import SelectField from "./SelectField";
import type { CohortApplicationFormValues } from "./types";
import { api, ElWarshaApiError } from "@core/api";
import { useState } from "react";

export interface CohortApplicationFormProps {
    locale: Locale;
    cohortSlug?: string;
}

export function CohortApplicationForm({
    locale,
    cohortSlug = "cohort-2",
}: CohortApplicationFormProps) {
    const isAr = locale === "ar";
    const copy = messages[locale].apply;
    const [successMessage, setSuccessMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<CohortApplicationFormValues>();

    const motivation = watch("motivation") || "";




    const onSubmit = async (data: CohortApplicationFormValues) => {
        clearErrors();
        setSuccessMessage("");
        setServerError("");

        try {
            await api.applyCohort(cohortSlug, data);

            setSuccessMessage(
                isAr
                    ? "تم إرسال طلب التقديم بنجاح"
                    : "Application submitted successfully",
            );
        } catch (error) {
            if (
                error instanceof ElWarshaApiError &&
                error.body?.invalidParams?.length
            ) {
                for (const issue of error.body.invalidParams) {
                    const fieldName =
                        issue.name as keyof CohortApplicationFormValues;

                    setError(fieldName, {
                        type: "server",
                        message: issue.reason,
                    });
                }
            } else {
                setServerError(
                    error instanceof Error
                        ? error.message
                        : isAr
                            ? "حدث خطأ أثناء إرسال الطلب"
                            : "Failed to submit application",
                );
            }
        }
    };



    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            {successMessage && (
                <p className={styles.successMessage} role="status">
                    {successMessage}
                </p>
            )}

            {serverError && (
                <p className={styles.serverError} role="alert">
                    {serverError}
                </p>
            )}
            <fieldset>
                <legend>{isAr ? "البيانات الشخصية" : "Personal Information"}</legend>

                <FormField
                    label={isAr ? "الاسم بالكامل" : "Full Name"}
                    registration={register("fullName", {
                        required: isAr ? "الاسم مطلوب" : "Full name is required",
                        validate: (value) =>
                            value.trim().length >= 3 ||
                            (isAr ? "الاسم يجب ألا يقل عن 3 أحرف" : "Name must be at least 3 characters"),
                        maxLength: {
                            value: 100,
                            message: isAr ? "الحد الأقصى 100 حرف" : "Maximum 100 characters",
                        },
                    })}
                    error={errors.fullName?.message}
                />

                <FormField
                    label="Email"
                    type="email"
                    registration={register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                        },
                    })}
                    error={errors.email?.message}
                />

                <FormField
                    label="WhatsApp Number"
                    type="tel"
                    registration={register("whatsappNumber", {
                        required: "WhatsApp number is required",
                        pattern: {
                            value: /^\+?\d{10,15}$/,
                            message: "Enter 10 to 15 digits, optionally starting with +",
                        },
                    })}
                    error={errors.whatsappNumber?.message}
                />

                <FormField
                    label="GitHub Handle"
                    registration={register("githubHandle", {
                        required: "GitHub username is required",
                        pattern: {
                            value: /^(?!-)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/,
                            message: "Enter a valid GitHub username",
                        },
                    })}
                    error={errors.githubHandle?.message}
                />

                <FormField
                    label="Discord Handle"
                    registration={register("discordHandle", {
                        required: "Discord handle is required",
                    })}
                    error={errors.discordHandle?.message}
                />
            </fieldset>

            <fieldset>
                <legend>{isAr ? "الدراسة والخبرة" : "Education and Experience"}</legend>

                <SelectField
                    label="Current Status"
                    options={[
                        { label: "Student", value: "student" },
                        { label: "Graduate", value: "recent_graduate" },
                        { label: "Working in tech", value: "employed_tech" },
                        { label: "Switching career", value: "career_switcher" },
                        { label: "Other", value: "other" }
                    ]}
                    registration={register("currentStatus", {
                        required: "Current status is required",
                    })}
                    error={errors.currentStatus?.message}
                />

                <FormField
                    label="College Major"
                    registration={register("collegeMajor", {
                        required: "College major is required",
                    })}
                    error={errors.collegeMajor?.message}
                />

                <FormField
                    label="Programming Experience"
                    registration={register("programmingExperience", {
                        required: "Programming experience is required",
                    })}
                    error={errors.programmingExperience?.message}
                />

                <FormField
                    label="Technologies"
                    type="textarea"
                    registration={register("technologies", {
                        required: "Technologies is required",
                    })}
                    error={errors.technologies?.message}
                />

                <SelectField
                    label="Git Experience"
                    options={[
                        { label: "Never", value: "none" },
                        { label: "Basics only", value: "basics" },
                        { label: "Comfortable", value: "comfortable" }]}
                    registration={register("gitExperience", {
                        required: "Git experience is required",
                    })}
                    error={errors.gitExperience?.message}
                />
            </fieldset>

            <fieldset>
                <legend>{isAr ? "الروابط" : "Links"}</legend>

                <FormField
                    label="Published Personal Page Link"
                    type="url"
                    registration={register("personalPageUrl", {
                        required: "Personal page link is required",
                        pattern: {
                            value: /^https?:\/\/.+/,
                            message: "Link must start with http:// or https://",
                        },
                    })}
                    error={errors.personalPageUrl?.message}
                />

                <FormField
                    label="GitHub Repository Link"
                    type="url"
                    registration={register("githubRepoUrl", {
                        required: "GitHub repository link is required",
                        pattern: {
                            value: /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/,
                            message: "Enter a valid GitHub repository URL",
                        },
                    })}
                    error={errors.githubRepoUrl?.message}
                />
            </fieldset>

            <fieldset>
                <legend>{isAr ? "استخدام الذكاء الاصطناعي والدافع" : "AI Usage and Motivation"}</legend>

                <FormField
                    label="AI Usage"
                    type="textarea"
                    registration={register("aiUsage", {
                        required: "AI usage is required",
                    })}
                    error={errors.aiUsage?.message}
                />

                <div className={styles.fieldWrapper}>
                    <FormField
                        label="Motivation"
                        type="textarea"
                        registration={register("motivation", {
                            required: "Motivation is required",
                            minLength: {
                                value: 50,
                                message: "Motivation must be at least 50 characters",
                            },
                        })}
                        error={errors.motivation?.message}
                    />
                    <p className={`${styles.characterCount} ${motivation.length >= 50 ? styles.validCount : ''}`}>
                        {motivation.length}/50 {isAr ? "حرف كحد أدنى" : "characters minimum"}
                    </p>
                </div>
            </fieldset>

            <button
                className={styles.submitButton}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? isAr
                        ? "جارٍ الإرسال..."
                        : "Submitting..."
                    : copy.submit}
            </button>
        </form>
    );
}
