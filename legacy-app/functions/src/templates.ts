import mjml2html = require('mjml');
import moment = require('moment');

export const eventSignup = (event: any, user: any, signup: any) =>
  mjml2html(
    `
  <mjml>
  <mj-body background-color="#ccd3e0">
    <mj-section background-color="#fff" padding-bottom="20px" padding-top="20px">
      <mj-column width="100%">
        <mj-image src="https://esn-tumi.de/assets/images/logo.png" alt="" align="center" border="none" width="200px" padding-left="0px" padding-right="0px" padding-bottom="10px" padding-top="10px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="#356cc7" padding-bottom="0px" padding-top="0">
      <mj-column width="100%">
        <mj-text align="center" font-size="13px" color="#ABCDEA" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="18px" padding-top="28px">HELLO
          <p style="font-size:16px; color:white">${user.firstName} ${user.lastName} (${user.email})</p>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#356cc7" padding-bottom="5px" padding-top="0">
      <mj-column width="100%">
        <mj-divider border-color="#ffffff" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="28px" padding-top="28px"><span style="font-size:20px; font-weight:bold">Your Signup was successful</span>
          <br/>
          <span style="font-size:15px">Please find more info below</span></mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#568feb" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Event</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${
          event.name
        } <br> ${moment(event.start.toDate()).format('DD.MM. HH:mm')} - ${moment(event.end.toDate()).format(
      'DD.MM. HH:mm'
    )}</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Registration Date</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${moment().format(
          'DD.MM. HH:mm'
        )}</mj-text>
      </mj-column>
      ${priceColumn(event, signup)}
    </mj-section>
    <mj-section background-color="#356CC7" padding-bottom="20px" padding-top="20px">
      <mj-column width="50%">
        <mj-button background-color="#ffae00" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" padding="15px 30px" border-radius="10px" href="https://esn-tumi.de/events/show/${
          event.id
        }" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="10px">See Event Info</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#356cc7" padding-bottom="5px" padding-top="0">
      <mj-column width="100%">
        <mj-divider border-color="#ffffff" border-width="2px" border-style="solid" padding-left="20px" padding-right="20px" padding-bottom="0px" padding-top="0"></mj-divider>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="20px">Best,
          <br/>
          <span style="font-size:15px">The TUMi Team</span></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`,
    {}
  ).html;

const priceColumn = (event: any, signup: any) => {
  if (event.hasFee) {
    if (!signup.hasPayed) {
      return `<mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Price</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${event.price}€ (payable at event)</mj-text>
      </mj-column>`;
    } else {
      return `<mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Amount Payed</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${event.price}€</mj-text>
      </mj-column>`;
    }
  }
  return '';
};
