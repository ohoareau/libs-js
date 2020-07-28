import sgMail from '@sendgrid/mail';

const factory = () => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    const sendMail = (msg) => {
        sgMail.send(msg);
    };
    return {
        sendMail,
    }
}

export default factory()