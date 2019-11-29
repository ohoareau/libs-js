import {ErrorSerialization} from '..';

export default interface SerializableErrorInterface {
    serialize(): ErrorSerialization;
}