import { Component } from '@angular/core';
import { LoadPagesGQL } from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

const buildPrivacyPolicyPage = (organizerPrivacyPolicy?: string) => {
  const organizerPolicy = organizerPrivacyPolicy ?? '';
  const organizerNotice = organizerPolicy.trim()
    ? organizerPolicy
    : '**[Organizer privacy policy text goes here]**';

  return `# Privacy & Data Protection

## Why are there two privacy notices?

This platform is used to organize events on behalf of different organizers (for example student groups, associations, or other organizations).

Because of this, two separate privacy notices apply:

1. **Platform Privacy Notice**
   Explains how the platform operator processes personal data for technical operation.

2. **Organizer Privacy Notice**
   Provided by the organizer and explains how your personal data is processed in the context of a specific event.

Both notices serve different purposes and are legally independent from each other.

## A) Platform Privacy Notice

*Technical operation of the platform*

### 1. Platform Operator

This platform is operated by:

- **Lukas Heddendorp**
- Email: **[lukas@evorto.app](mailto:lukas@evorto.app)**

The platform provides technical infrastructure for customers to manage and organize events.

### 2. Role under GDPR

**Important note on responsibilities:**
The platform operator acts exclusively as a data processor within the meaning of Art. 28 GDPR.

The respective customers (organizers) are data controllers within the meaning of Art. 4 No. 7 GDPR and are legally responsible for the purposes and contents of data processing related to events.

### 3. Personal data processed by the platform

The platform processes personal data only to the extent necessary for technical operation.

#### a) Participant data

- Name
- Email address
- Optional information (for example phone number or messenger handle), if voluntarily provided

The scope of additional data fields is defined and controlled by the respective organizer.

#### b) Technical and system data

For security and operational purposes, the following data may be processed temporarily:

- IP address
- Browser and device information
- Access timestamps
- Error and system logs

### 4. Purpose of processing

Personal data is processed exclusively for:

- Providing and operating the platform
- Handling event registrations
- Sending system-related emails (for example confirmations)
- Ensuring security, stability, and error analysis

The platform operator does not use personal data for own content-related purposes.

### 5. Legal basis

Processing is based on:

- Performance of contractual obligations towards customers (Art. 6(1)(b) GDPR)
- Compliance with legal obligations
- Legitimate interest in operating a secure and stable platform (Art. 6(1)(f) GDPR)

Responsibility for event-specific data processing lies with the respective organizer.

### 6. Hosting and sub-processors

The platform uses the following sub-processors:

- Microsoft Azure - hosting and infrastructure (EU data centers, including Germany)
- Stripe - payment processing
- Auth0 - authentication and login
- Resend - email delivery
- Sentry - error monitoring

All sub-processors are contractually bound in accordance with Art. 28 GDPR.

### 7. Data sharing

Personal data is shared only:

- based on instructions from the respective organizer
- with sub-processors required for platform operation
- where legally required

The platform operator does not disclose data independently.

### 8. Data retention

Personal data is stored only as long as required for contractual obligations or legal requirements.

Deletion or correction takes place upon instruction by the organizer or after termination of the contractual relationship.

You can also delete your account and associated personal data in a self-service way from your [profile](/profile).

### 9. Data subject rights

Data subjects have the rights under Art. 15-21 GDPR (access, rectification, erasure, restriction, objection).

Requests should generally be addressed to the respective organizer as data controller.
The platform operator supports organizers in fulfilling these requests.

## B) Organizer Privacy Notice

*Event-specific data processing*

The following privacy notice is provided by the organizer of the event.

The organizer is solely responsible for the purposes, legal basis, and duration of processing personal data related to the event.

### Organizer-provided privacy information

The organizer has provided the following privacy notice:

${organizerNotice}

If you have questions regarding this notice, please contact the organizer directly using the contact details provided above.
`;
};

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss'],
  imports: [MarkdownComponent, AsyncPipe],
})
export class PrivacyPolicyPageComponent {
  public pageContent$: Observable<string>;

  constructor(private loadPages: LoadPagesGQL) {
    this.pageContent$ = this.loadPages.fetch().pipe(
      map((res) => {
        const tenant = res.data.currentTenant;
        if (!tenant) {
          return '## Page not found';
        }
        return buildPrivacyPolicyPage(tenant.privacyPolicyPage);
      }),
    );
  }
}
