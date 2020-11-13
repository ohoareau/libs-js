import React from 'react';
import {context, form} from "./types";

export const Dynaform = ({form: form, context: context}: DynaformProps) => (
    <div>
        DYNA FORM
        <pre>{JSON.stringify(form, null, 4)}</pre>
    </div>
);

export interface DynaformProps {
    form: form,
    context: context,
}
export default Dynaform