const nodemailer = require("nodemailer");
const appError = require('../service/appError');
const { successHandle } = require('../service/responseHandler');

const sendMail = (user, verification, res, next) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.ACCOUNT,
        clientId: process.env.CLINENTID,
        clientSecret: process.env.CLINENTSECRET,
        refreshToken: process.env.REFRESHTOKEN
      }
    });
    console.log(user.email)
    transporter.sendMail({
      from: process.env.ACCOUNT,
      to: user.email,
      subject: 'metaWall-忘記密碼',
      text: '新密碼',
      html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#EFECE7">
      <tbody>
        <tr>
          <td align="center" style="padding:40px 0"> 
            <img src="https://i.imgur.com/69zSXao.png" alt="metaWall">
          </td>
        </tr>
        <tr>
          <td align="center" valign="top" style="padding-bottom:40px;padding-left:20px;padding-right:20px">
            <table align="center" width="650" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
              <tbody>
                <tr>
                  <td align="left" style="padding:20px">
                    <div>
                      <p>${user.name}，您好</p>
                      <p>以下為您的驗證碼，請使用重新登入後更改新密碼</p>
                      <p style="text-align:center; font-size: 24px">${verification}</p>
                      <div style="text-align:center;margin-bottom:20px;">
                    </div>
                      <p style="font-size:12px;"><strong style="color:#03438d;">本郵件請勿直接回覆。</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>`,
    }).then((info) => {
      successHandle(res, '發送成功');
    }).catch((err) => {
      return appError(400, '發送失敗，請重新輸入', next);
    })
  }

module.exports = sendMail