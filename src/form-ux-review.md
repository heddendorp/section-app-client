# Form UX Review – Progressive Disclosure Opportunities

## Overview

This document captures a sweep of form-driven flows in the Angular legacy app. The focus is on where progressive disclosure or related UX refinements are missing today and suggested improvements for future work. File references below include line numbers as of this review.

## High-Impact Gaps

- `src/app/modules/events/pages/event-edit-page/event-edit-page.component.html:175` & `:352`
  - **Issue**: General and Specification tabs surface every toggle and numeric control simultaneously.
  - **Opportunity**: Gate registration-mode–specific fields (pricing, external links, participant limits) and de-registration settings behind collapsible "Advanced" sections tied to control values.
- `src/app/modules/settings/tabs/section-settings-tab/section-settings-tab.component.html:111` & `:168`
  - **Issue**: Registration-limit inputs and home-page link fields remain visible regardless of relevance.
  - **Opportunity**: Hide subordinate controls until `enabled` or `HomePageStrategy.Link` is selected to reduce noise for admins.
- `src/app/modules/settings/tabs/de-registration-settings-tab/de-registration-settings-tab.component.html:40` & `:106`
  - **Issue**: Deadline inputs stay visible even when the capability is off.
  - **Opportunity**: Wrap numeric inputs in conditional blocks keyed to the checkbox state so teams only see timing fields after enabling the feature.
- `src/app/modules/event-templates/components/create-event-dialog/create-event-dialog.component.html:35`
  - **Issue**: Price and registration-link inputs remain on screen despite being irrelevant for several registration modes.
  - **Opportunity**: Replace with mode-specific subsections (e.g., “Stripe pricing”, “External signup”) that appear only when required.
- `src/app/modules/shared/components/new-data-item-dialog/new-data-item-dialog.component.html:37`
  - **Issue**: The “Choices for select” form array is displayed for every type even when disabled.
  - **Opportunity**: Only render the block when `type === SubmissionItemType.Select` to avoid confusing content authors.

## Moderate-Impact Opportunities

- `src/app/modules/event-templates/components/new-finance-entry-dialog/new-finance-entry-dialog.component.html:22`
  - Hide the scale input until `type === 'scaled'` and provide inline help for cost scaling.
- `src/app/modules/tenant/components/create-transaction-dialog/create-transaction-dialog.component.html:21`
  - Move the lengthy direction list and optional related-user field into an "Advanced routing" disclosure.
- `src/app/modules/tenant/pages/tenant-transactions-page/tenant-transactions-page.component.html:27`
  - Default to a compact search + preset range; tuck the multi-select filters into an expandable "More filters" section.
- `src/app/modules/tenant/pages/tenant-stats-page/tenant-stats-page.component.html:52`
  - Show only the timeframe combo by default; surface the manual date range picker when a "Custom range" option is selected.
- `src/app/modules/event-templates/components/event-form-dialog/event-form-dialog.component.html:42`
  - Convert the three long text areas into accordions (“Internal notes”, “Public description”, “Participant briefing”) that expand on demand.

## Additional UX Improvements

- `src/app/modules/events/pages/event-edit-page/event-edit-page.component.html:190`
  - Add helper chips or presets for organizer/participant status multi-selects to speed up selection.
- `src/app/modules/event-templates/components/finance-planner/finance-planner.component.html:94`
  - Surface live validation or warnings near forecast inputs (e.g., highlighting negative balances).
- `src/app/modules/shared/components/rate-event/rate-event.component.html:13`
  - Introduce a character counter and clearer anonymity guidance to encourage richer feedback.
- `src/app/modules/global-admin/tenants/add-credit-dialog/add-credit-dialog.component.html:16`
  - Pre-fill a contextual default amount and offer currency guidance when tenant currency differs from EUR.
- `src/app/modules/shared/components/new-data-item-dialog/new-data-item-dialog.component.html:56`
  - When choices are shown, limit initial entries to two and expose a drag handle to convey ordering.
- `src/app/modules/events/components/running/add-receipt-dialog/add-receipt-dialog.component.html:10`
  - Add explicit file-selection state (e.g., "No file selected" reminder) to prevent amount-only submissions.

## Exclusions / Already Appropriate

- Single-field or quick-search forms (`tutor-hub.component.html:57`, `tenant-events-page.component.html:20`, `rate-event.component.html:13`, publication tab on the event edit page) already surface only essential controls; progressive disclosure changes are unnecessary right now.
