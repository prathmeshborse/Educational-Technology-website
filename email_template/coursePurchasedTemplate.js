const coursePurchasedTemplate = (courseName, studentName, frontendUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Course Enrollment Successful</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f7fc;font-family:Arial,sans-serif;">
        
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

            <div style="background:#2563eb;padding:25px;text-align:center;">
                <h1 style="color:white;margin:0;">
                    Enrollment Successful!
                </h1>
            </div>

            <div style="padding:30px;">

                <p style="font-size:16px;">
                    Hi <strong>${studentName}</strong>,
                </p>

                <p style="font-size:16px;line-height:1.6;">
                    Congratulations! Your payment has been successfully processed and
                    you have been enrolled in the following course:
                </p>

                <div style="
                    background:#f8fafc;
                    border-left:4px solid #2563eb;
                    padding:15px;
                    margin:20px 0;
                    border-radius:5px;
                ">
                    <h2 style="margin:0;color:#2563eb;">
                        ${courseName}
                    </h2>
                </div>

                <p style="font-size:16px;line-height:1.6;">
                    You can now access all course content and start learning immediately.
                </p>

                <p style="font-size:16px;line-height:1.6;">
                    We hope you enjoy the course and gain valuable knowledge and skills.
                </p>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

                <p style="font-size:14px;color:#6b7280;">
                    If you have any questions or face any issues accessing your course,
                    please contact our support team.
                </p>

                <p style="font-size:16px;">
                    Happy Learning!
                </p>

                <p style="margin-top:25px;">
                    <strong>EdTech Team</strong>
                </p>
                
                <div style="text-align:center; margin:30px 0;">
                    <a
                        href="${frontendUrl}/dashboard/enrolled-courses"
                        style="
                            background:#2563eb;
                            color:white;
                            padding:12px 24px;
                            text-decoration:none;
                            border-radius:5px;
                            display:inline-block;
                            font-weight:bold;
                        "
                    >
                        Go To My Course
                    </a>
                </div>

            </div>
        </div>

    </body>
    </html>
    `;
};

module.exports = coursePurchasedTemplate;