import lambda from '../../services/aws/lambda';

export default ({arn, payload}) => async result => {
    await lambda.execute(arn, payload, {async: true});
    return result;
}