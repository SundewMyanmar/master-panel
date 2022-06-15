import FormatManager from './FormatManager';

export const DEFAULT_VALIDATION_PATTERNS = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /^\+?[0-9]{7,15}$/,
};

export interface Rule {
    type: 'email' | 'phone' | 'match' | 'pattern';
    matchId: string;
    pattern: RegExp;
    message: string;
    onValidate: (form: object) => Boolean;
}
export interface Validator {
    fieldId: string;
    required: boolean;
    rules: Array<Rule>;
}

export function validateForm(form, validators: Array<Validator>, onFailed: (error: object) => void) {
    console.log('validate form => ', form);
    for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        if (!validator || validator == null) {
            continue;
        }

        let value = form[validator.fieldId];
        if (typeof value === 'string') {
            value = value.trim();
        }
        if (validator.required && (!value || value === null || value.length <= 0 || value === 0)) {
            onFailed({ title: 'Required', message: validator.message ?? `${FormatManager.camelToReadable(validator.fieldId)} is required.` });
            return false;
        }

        const rules = validator.rules;
        if (!rules || rules === null || rules.length <= 0) {
            continue;
        }

        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (!rule || rule == null) {
                continue;
            }
            if (rule.type === 'match') {
                const confirmValue = form[rule.matchId];
                console.log(`${value} !== ${confirmValue}`);
                if (value !== confirmValue) {
                    onFailed({
                        title: 'Not match',
                        message:
                            validator.message ??
                            rule.message ??
                            `${FormatManager.camelToReadable(validator.fieldId)} and ${FormatManager.camelToReadable(rule.matchId)} must be same.`,
                    });
                    return false;
                }
            }

            if (Object.keys(DEFAULT_VALIDATION_PATTERNS).includes(rule.type) || rule.pattern?.length > 0) {
                const pattern = DEFAULT_VALIDATION_PATTERNS[rule.type] || rule.pattern;
                if (!pattern.test(value)) {
                    onFailed({
                        title: 'Invalid',
                        message:
                            validator.message ??
                            rule.message ??
                            FormatManager.camelToReadable(validator.fieldId) + ' is invalid ' + (rule.type ? ' ' + rule.type + ' format.' : '.'),
                    });
                    return false;
                }
            }

            if (rule.onValidate) {
                if (rule.onValidate(form)) {
                    onFailed({ title: 'Invalid', message: validator.message ?? rule.message });
                }
            }
        }
    }

    return true;
}
