import { values } from './values';
import Context from "../Context";
import MissingCallerError from "../errors/MissingCallerError";

export const owned = (ownerField: string = 'owner', membersField: string = 'members') => [
    values({
        [ownerField]: ({id, updatedAt}) => ({id, updatedAt}),
        [membersField]: ({id, role, createdAt, updatedAt}) => ({[id]: {id, role, createdAt, updatedAt}}),
    }, (ctx: Context) => {
        const date = new Date(Date.now()).toISOString();
        const caller = ctx.get('caller');
        if (!caller || !caller.id) {
            throw new MissingCallerError();
        }
        return {id: caller.id, createdAt: date, updatedAt: date, role: 'owner'};
    }),
];
