const mailSender = require("../utils/mailSender");
const contactUsTemplate = require("../email_template/contactUsTemplate");
const contactUsConfirmationTemplate = require("../email_template/contactUsConfirmationTemplate");

exports.contactUs = async (req, res) => {
    try {
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

        await mailSender(
            "jmkn704@gmail.com",
            "New User Query",
            contactUsTemplate(
                firstname,
                lastname,
                email,
                countrycode,
                phoneNo,
                message
            )
        );

        const userMailResponse = await mailSender(email, "We've Received Your Query",
             contactUsConfirmationTemplate(`${firstname} ${lastname}`));
        
        return res.json({
            success: true,
            message: "Email send successfully",
            userMailResponse
        });
    } 
    catch (error) {
        console.log("Error in contactUs", error);
        return res.json({
        success: false,
        message: "Something went wrong...",
        });
    }
};

// file name: ContactUsController.js