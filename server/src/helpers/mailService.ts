export class MailService {
  // static sendInviteMail(
  //   invites: Invite[],
  //   creator: User | undefined,
  //   tenant: Tenant,
  //   link: string
  // ) {
  //   sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
  //   const messages = invites.map((invite) => {
  //     return {
  //       to: invite.email,
  //       from: 'questions@esn-tumi.de',
  //       subject: '[esn.world] Section invitation',
  //       templateId: 'd-7b47068bfed1419b8cbee43927774a3b',
  //       dynamicTemplateData: {
  //         invite,
  //         creator,
  //         tenant,
  //         link: link + invite.id,
  //       },
  //     };
  //   });
  //   return sgMail
  //     .send(messages)
  //     .catch(({ response }) => console.error(response.body))
  //     .then((data) => {
  //       data?.forEach((item) => {
  //         console.log(item);
  //       });
  //       return data;
  //     });
  // }
}
