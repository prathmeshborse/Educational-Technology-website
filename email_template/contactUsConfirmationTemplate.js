const contactUsConfirmationTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>We've Received Your Query</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f7fc;font-family:Arial,sans-serif;">

        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

            <div style="background:#2563eb;padding:25px;text-align:center;">
                <h1 style="color:white;margin:0;">
                    Query Received ✅
                </h1>
            </div>

            <div style="padding:30px;">

                <p style="font-size:16px;">
                    Hi <strong>${name}</strong>,
                </p>

                <p style="font-size:16px;line-height:1.6;">
                    Thank you for contacting us. We have successfully received your query and our support team has been notified.
                </p>

                <p style="font-size:16px;line-height:1.6;">
                    A team member will review your message and get back to you as soon as possible.
                </p>

                <div style="
                    background:#f8fafc;
                    border-left:4px solid #2563eb;
                    padding:15px;
                    margin:25px 0;
                    border-radius:5px;
                ">
                    <p style="margin:0;">
                        ⏳ Typical response time: <strong>24-48 hours</strong>
                    </p>
                </div>

                <p style="font-size:16px;line-height:1.6;">
                    In the meantime, feel free to continue exploring our courses and learning resources.
                </p>

                <p style="font-size:16px;">
                    Thank you for choosing EdTech.
                </p>

                <br>

                <p>
                    Best Regards,<br>
                    <strong>EdTech Support Team</strong>
                </p>

            </div>
        </div>

    </body>
    </html>
    `;
};

module.exports = contactUsConfirmationTemplate;