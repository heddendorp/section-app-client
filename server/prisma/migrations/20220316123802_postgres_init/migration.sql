-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NONE', 'TRIAL', 'FULL', 'SPONSOR', 'ALUMNI');

-- CreateEnum
CREATE TYPE "PublicationState" AS ENUM ('DRAFT', 'APPROVAL', 'ORGANIZERS', 'PUBLIC');

-- CreateEnum
CREATE TYPE "SubmissionItemType" AS ENUM ('FILE', 'NUMBER', 'TEXT', 'LONGTEXT', 'DATE', 'RATING', 'BOOLEAN', 'SELECT');

-- CreateEnum
CREATE TYPE "SubmissionTime" AS ENUM ('REGISTRATION', 'BEFORE', 'DURING', 'AFTER');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('ORGANIZER', 'PARTICIPANT', 'CALENDAR');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationMode" AS ENUM ('STRIPE', 'ONLINE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('SILLY', 'DEBUG', 'INFO', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "privacyPolicyPage" TEXT NOT NULL DEFAULT E'',
    "imprintPage" TEXT NOT NULL DEFAULT E'',
    "aboutPage" TEXT NOT NULL DEFAULT E'',
    "faqPage" TEXT,
    "tacPage" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authId" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL,
    "esnCardOverride" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "iban" TEXT,
    "lastName" TEXT NOT NULL,
    "paypal" TEXT,
    "phone" TEXT,
    "picture" TEXT NOT NULL,
    "university" TEXT,
    "calendarToken" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT E'NONE',
    "redeemedAt" TIMESTAMP(3),
    "tenantId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "redeemerId" UUID,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeUserData" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "paymentMethodId" TEXT,
    "usersOfTenantsTenantId" UUID NOT NULL,
    "usersOfTenantsUserId" UUID NOT NULL,

    CONSTRAINT "StripeUserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersOfTenantsTenantId" UUID NOT NULL,
    "usersOfTenantsUserId" UUID NOT NULL,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePayment" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "checkoutSession" TEXT NOT NULL,
    "events" JSONB NOT NULL,
    "feeAmount" DECIMAL(65,30),
    "netAmount" DECIMAL(65,30),
    "paymentIntent" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "paymentMethodType" TEXT,
    "refundedAmount" DECIMAL(65,30),
    "shipping" JSONB,
    "status" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "StripePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT NOT NULL,
    "isMembershipFee" BOOLEAN NOT NULL,
    "stripePaymentId" UUID NOT NULL,
    "userId" UUID,
    "tumiEventId" UUID,
    "tenantId" UUID,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundedRegistration" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chargeId" TEXT NOT NULL,
    "eventId" UUID NOT NULL,
    "refundId" TEXT NOT NULL,
    "registrationId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "RefundedRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOfTenants" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "status" "MembershipStatus" NOT NULL DEFAULT E'NONE',
    "tenantId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "UsersOfTenants_pkey" PRIMARY KEY ("userId","tenantId")
);

-- CreateTable
CREATE TABLE "EventOrganizer" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "EventOrganizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTemplate" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" UUID,
    "comment" TEXT NOT NULL,
    "coordinates" JSONB,
    "description" TEXT NOT NULL,
    "duration" DECIMAL(65,30) NOT NULL,
    "finances" JSONB NOT NULL,
    "icon" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organizerText" TEXT NOT NULL,
    "participantText" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "EventTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTemplateCategory" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "EventTemplateCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TumiEvent" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordinates" JSONB,
    "creatorId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "eventOrganizerId" UUID NOT NULL,
    "eventTemplateId" UUID NOT NULL,
    "icon" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organizerLimit" INTEGER NOT NULL DEFAULT 0,
    "organizerSignup" "MembershipStatus"[],
    "organizerText" TEXT NOT NULL,
    "participantLimit" INTEGER NOT NULL DEFAULT 0,
    "participantSignup" "MembershipStatus"[],
    "participantText" TEXT NOT NULL,
    "prices" JSONB,
    "publicationState" "PublicationState" NOT NULL DEFAULT E'DRAFT',
    "registrationLink" TEXT,
    "registrationMode" "RegistrationMode" NOT NULL,
    "registrationStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "TumiEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availability" "MembershipStatus"[],
    "description" TEXT NOT NULL,
    "isESNcard" BOOLEAN NOT NULL DEFAULT false,
    "leadImageId" UUID,
    "needsShippingAddress" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "prices" JSONB NOT NULL,
    "publicationState" "PublicationState" NOT NULL DEFAULT E'DRAFT',
    "tenantId" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "container" TEXT NOT NULL,
    "creatorId" UUID NOT NULL,
    "originalBlob" TEXT NOT NULL,
    "previewBlob" TEXT,
    "type" TEXT NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancellationReason" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT E'PENDING',
    "paymentId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancellationReason" TEXT,
    "cost" DECIMAL(65,30) NOT NULL,
    "pickupTime" TIMESTAMP(3),
    "productId" UUID NOT NULL,
    "purchaseId" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "shoppingCartId" UUID,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualAmount" DECIMAL(65,30),
    "amount" DECIMAL(65,30) NOT NULL,
    "calculationInfo" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "details" TEXT,
    "eventId" UUID NOT NULL,
    "moneySent" BOOLEAN NOT NULL DEFAULT false,
    "moneySentTo" UUID,
    "name" TEXT NOT NULL,
    "onInvoice" BOOLEAN NOT NULL,

    CONSTRAINT "CostItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "blob" TEXT NOT NULL,
    "container" TEXT NOT NULL,
    "costItemId" UUID NOT NULL,
    "md5" TEXT,
    "preview" TEXT,
    "type" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoShare" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cols" INTEGER NOT NULL DEFAULT 2,
    "container" TEXT NOT NULL,
    "creatorId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "originalBlob" TEXT NOT NULL,
    "previewBlob" TEXT,
    "rows" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL,

    CONSTRAINT "PhotoShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancellationReason" TEXT,
    "checkInTime" TIMESTAMP(3),
    "eventId" UUID NOT NULL,
    "manualCheckin" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" UUID,
    "status" "RegistrationStatus" NOT NULL DEFAULT E'SUCCESSFUL',
    "type" "RegistrationType" NOT NULL DEFAULT E'PARTICIPANT',
    "userId" UUID NOT NULL,
    "registrationCodeId" UUID,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistrationCode" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "registrationToRemoveId" UUID,
    "registrationCreatedId" UUID,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sepaAllowed" BOOLEAN NOT NULL DEFAULT false,
    "eventId" UUID NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT E'PENDING',
    "paymentId" UUID,

    CONSTRAINT "EventRegistrationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSubmissionItem" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB,
    "eventId" UUID,
    "instruction" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" UUID,
    "required" BOOLEAN NOT NULL,
    "submissionTime" "SubmissionTime" NOT NULL,
    "type" "SubmissionItemType" NOT NULL,

    CONSTRAINT "EventSubmissionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSubmission" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "eventRegistrationId" UUID,
    "lineItemId" UUID,
    "submissionItemId" UUID NOT NULL,

    CONSTRAINT "EventSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT E'general',
    "data" JSONB,
    "oldData" JSONB,
    "involvedUser" UUID,
    "severity" "LogSeverity" NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_shortName_key" ON "Tenant"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "User_calendarToken_key" ON "User"("calendarToken");

-- CreateIndex
CREATE UNIQUE INDEX "StripeUserData_usersOfTenantsUserId_usersOfTenantsTenantId_key" ON "StripeUserData"("usersOfTenantsUserId", "usersOfTenantsTenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_usersOfTenantsUserId_usersOfTenantsTenantId_key" ON "ShoppingCart"("usersOfTenantsUserId", "usersOfTenantsTenantId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayment_checkoutSession_key" ON "StripePayment"("checkoutSession");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayment_paymentIntent_key" ON "StripePayment"("paymentIntent");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_paymentId_key" ON "Purchase"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_paymentId_key" ON "EventRegistration"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistrationCode_registrationToRemoveId_key" ON "EventRegistrationCode"("registrationToRemoveId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistrationCode_paymentId_key" ON "EventRegistrationCode"("paymentId");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_redeemerId_fkey" FOREIGN KEY ("redeemerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeUserData" ADD CONSTRAINT "StripeUserData_usersOfTenantsUserId_usersOfTenantsTenantId_fkey" FOREIGN KEY ("usersOfTenantsUserId", "usersOfTenantsTenantId") REFERENCES "UsersOfTenants"("userId", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_usersOfTenantsUserId_usersOfTenantsTenantId_fkey" FOREIGN KEY ("usersOfTenantsUserId", "usersOfTenantsTenantId") REFERENCES "UsersOfTenants"("userId", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayment" ADD CONSTRAINT "StripePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stripePaymentId_fkey" FOREIGN KEY ("stripePaymentId") REFERENCES "StripePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tumiEventId_fkey" FOREIGN KEY ("tumiEventId") REFERENCES "TumiEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundedRegistration" ADD CONSTRAINT "RefundedRegistration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOfTenants" ADD CONSTRAINT "UsersOfTenants_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOfTenants" ADD CONSTRAINT "UsersOfTenants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTemplate" ADD CONSTRAINT "EventTemplate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTemplate" ADD CONSTRAINT "EventTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventTemplateCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTemplateCategory" ADD CONSTRAINT "EventTemplateCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TumiEvent" ADD CONSTRAINT "TumiEvent_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TumiEvent" ADD CONSTRAINT "TumiEvent_eventOrganizerId_fkey" FOREIGN KEY ("eventOrganizerId") REFERENCES "EventOrganizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TumiEvent" ADD CONSTRAINT "TumiEvent_eventTemplateId_fkey" FOREIGN KEY ("eventTemplateId") REFERENCES "EventTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "StripePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostItem" ADD CONSTRAINT "CostItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TumiEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoShare" ADD CONSTRAINT "PhotoShare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoShare" ADD CONSTRAINT "PhotoShare_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TumiEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "StripePayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TumiEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_registrationCodeId_fkey" FOREIGN KEY ("registrationCodeId") REFERENCES "EventRegistrationCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationCode" ADD CONSTRAINT "EventRegistrationCode_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "StripePayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationCode" ADD CONSTRAINT "EventRegistrationCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TumiEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSubmissionItem" ADD CONSTRAINT "EventSubmissionItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TumiEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSubmissionItem" ADD CONSTRAINT "EventSubmissionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSubmission" ADD CONSTRAINT "EventSubmission_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSubmission" ADD CONSTRAINT "EventSubmission_eventRegistrationId_fkey" FOREIGN KEY ("eventRegistrationId") REFERENCES "EventRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSubmission" ADD CONSTRAINT "EventSubmission_submissionItemId_fkey" FOREIGN KEY ("submissionItemId") REFERENCES "EventSubmissionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
