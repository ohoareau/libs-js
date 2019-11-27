import lambdaFactory from "../../factories/lambda";

export default {
    supports: dsn => /^arn:/.test(dsn),
    execute: lambdaFactory().execute,
}