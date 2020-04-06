import React, {ComponentType} from 'react';
import SelectFormField, {SelectFormFieldProps} from './SelectFormField';

export const MemberRoleFormField: ComponentType<MemberRoleFormFieldProps> = (props: MemberRoleFormFieldProps) => (
    <SelectFormField values={['owner', 'admin', 'manager', 'member', 'guest']} {...props} />
);

export interface MemberRoleFormFieldProps extends SelectFormFieldProps {}

export default MemberRoleFormField