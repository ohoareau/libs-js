import i18n from 'i18next';

type ValueType = any;
type ResultType = undefined|string;

export const fax = (v: ValueType): ResultType => (v && !/^[(+)0-9]{5,}$/.test(v)) ? i18n.t('constraints_fax') : undefined;
export const anything = (): ResultType => undefined;
export const count = (v: ValueType): ResultType => !v
    ? undefined
    : (isNaN(Number(v))
            ? i18n.t('constraints_count_not_a_number')
            : (/^[0-9]+$/.test(`${v}`)
                    ? (v < 0
                        ? i18n.t('constraints_count_not_positive')
                        : (v > 100
                                ? i18n.t('constraints_count_too_high', {max: 100})
                                : undefined
                        ))
                    : i18n.t('constraints_count_not_integer')
            )
    )
;
export const email = (v: ValueType): ResultType => v && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)
    ? i18n.t('constraints_email')
    : undefined
;
export const number = (v: ValueType): ResultType => v && isNaN(Number(v)) ? i18n.t('constraints_number') : undefined;
export const password = (v: ValueType): ResultType =>
    (v && (
        !/[0-9]+/.test(v)
        || !/[!+=*$€&@#(§%ù£`?,;.<>¨^°\-_)"]+/.test(v)
        || !/[A-Z]+/.test(v)
        || !/[a-z]+/.test(v)
        || !/^.{8,}$/.test(v)
    ))
        ? i18n.t('constraints_password')
        : undefined
;
export const phone = (v: ValueType): ResultType => v && !/^[(+)0-9]{5,}$/.test(v) ? i18n.t('constraints_phone') : undefined;
export const required = v => v ? undefined : i18n.t('constraints_required');
export const securityCode = v => v && !/^[0-9]{6}$/.test(v) ? i18n.t('constraints_security_code') : undefined;
export const zipCode = v => v && !/^[0-9]{5}$/.test(v) ? i18n.t('constraints_zip_code') : undefined;
export const value = v => v && isNaN(Number(v.value)) ? i18n.t('constraints_value_number') : undefined;
export const url = v => v && !/^http[s]?:\/\/.+/.test(v) ? i18n.t('constraints_url') : undefined;
