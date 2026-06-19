const contactUsTemplate = (firstname, lastname, email, countrycode, phoneNo, message ) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New User Query</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f7fc;font-family:Arial,sans-serif;">

        <div style="max-width:650px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

            <div style="background:#2563eb;padding:20px;text-align:center;">
                <h1 style="color:white;margin:0;">
                    New Contact Us Query 📩
                </h1>
            </div>

            <div style="padding:30px;">

                <p style="font-size:16px;">
                    A new user has submitted a query through the Contact Us form.
                </p>

                <table style="width:100%;border-collapse:collapse;margin-top:20px;">
                    <tr>
                        <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Name</strong></td>
                        <td style="padding:10px;border:1px solid #e5e7eb;">
                            ${firstname} ${lastname}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Email</strong></td>
                        <td style="padding:10px;border:1px solid #e5e7eb;">
                            ${email}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Phone</strong></td>
                        <td style="padding:10px;border:1px solid #e5e7eb;">
                            +${countrycode} ${phoneNo}
                        </td>
                    </tr>
                </table>

                <div style="
                    margin-top:25px;
                    padding:20px;
                    background:#f8fafc;
                    border-left:4px solid #2563eb;
                    border-radius:5px;
                ">
                    <h3 style="margin-top:0;">
                        User Message
                    </h3>

                    <p style="margin:0;line-height:1.6;">
                        ${message}
                    </p>
                </div>

                <p style="margin-top:30px;color:#6b7280;font-size:14px;">
                    This email was automatically generated from the EdTech Contact Us form.
                </p>

            </div>
        </div>

    </body>
    </html>
    `;
};

module.exports = contactUsTemplate;