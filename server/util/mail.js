const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendVerifyMail(email, name, token) {
    const msg = {
        to: email,
        from: 'hassanelshazly2010@gmail.com',
        subject: 'Moria Verification Mail',

        text: `Dear ${name}, Welcome to Moria platform 
            Please, verfiy your account using the following link 
            https://moria-asu.herokuapp.com/verify-acount/${token}`,

        html: `<div style="font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;
                color:#294661;align-content: center; max-width:600px;margin: auto; padding: 10px;">

                    <div style="font-size:21px">
                        Dear ${name},
                    </div>

                    <div style="font-size:18px">
                        <br>
                        Welcome to Moria platform <br>
                        Let's verify your account to unlock the full features.
                    </div>

                    <div style="font-size:14px">
                        <br>
                        Your link is active for 48 hours. After that, you will need to resend the verification email.
                    </div>

                    <div style="font-size:18px;text-align: center;">
                        <a href="https://moria-asu.herokuapp.com/verify-account/${token}"> <br>Verify My Account</a> 
                    </div>

                    <div style="font-size:12px;text-align: center;">
                        <p><br><br> © Moria Team</p>
                        <a style="padding:0 5px" href="https://www.facebook.com">Facebook</a>
                        <a style="padding:0 5px" href="https://www.twitter.com">Twitter</a>
                        <a style="padding:0 5px" href="https://www.linkedin.com">LinkedIn</a>
                        <a style="padding:0 5px" href="https://www.github.com">GitHub</a>
                    </div>
                </div>`,
    }
    sgMail.send(msg);
}

module.exports = {
    sendVerifyMail
}