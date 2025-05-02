-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'vendor', 'admin', 'driver');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('product', 'service', 'delivery');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'basic', 'premium', 'elite');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('active', 'pending', 'suspended');

-- CreateEnum
CREATE TYPE "CategoryClassification" AS ENUM ('product', 'service');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'out_of_stock', 'disabled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdraw', 'purchase', 'reward');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "RewardSource" AS ENUM ('referral', 'sale', 'contribution');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('passport', 'ID_card', 'drivers_license');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "DriverType" AS ENUM ('ride', 'delivery', 'both');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('available', 'busy', 'offline');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('requested', 'accepted', 'enroute', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('referral', 'ride_completion', 'listing_creation', 'course_completion', 'other');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('user_signup', 'product_listing', 'service_listing', 'order_placed', 'ride_booked', 'delivery_booked', 'reward_earned');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "swifin_id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'pending',
    "country" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sfnc_balance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "sfnl_balance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "polygon_wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vendor_name" TEXT NOT NULL,
    "vendor_type" "VendorType" NOT NULL,
    "subscription_plan" "SubscriptionPlan" NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'pending',
    "profile_image" TEXT,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "classification" "CategoryClassification" NOT NULL,
    "depth" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock_quantity" INTEGER,
    "media_urls" JSONB NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "classification" "CategoryClassification" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "total_amount_sfnc" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "delivery_required" BOOLEAN NOT NULL,
    "secret_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_each_sfnc" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "related_order_id" TEXT,
    "type" "TransactionType" NOT NULL,
    "amount_sfnc" DECIMAL(65,30) NOT NULL,
    "blockchain_tx_hash" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SfnlReward" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" "RewardSource" NOT NULL,
    "amount_sfnl" DECIMAL(65,30) NOT NULL,
    "referral_level" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SfnlReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "document_url" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "driver_type" "DriverType" NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "availability_status" "AvailabilityStatus" NOT NULL,
    "last_known_latitude" DECIMAL(65,30) NOT NULL,
    "last_known_longitude" DECIMAL(65,30) NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "total_rides" INTEGER NOT NULL,
    "total_deliveries" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideDeliveryBooking" (
    "id" TEXT NOT NULL,
    "rider_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "pickup_latitude" DECIMAL(65,30) NOT NULL,
    "pickup_longitude" DECIMAL(65,30) NOT NULL,
    "dropoff_latitude" DECIMAL(65,30) NOT NULL,
    "dropoff_longitude" DECIMAL(65,30) NOT NULL,
    "estimated_distance_km" DECIMAL(65,30) NOT NULL,
    "estimated_fare_sfnc" DECIMAL(65,30) NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "secret_code" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RideDeliveryBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorMembershipPayment" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "plan_type" "SubscriptionPlan" NOT NULL,
    "amount_paid_sfnc" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "payment_status" "TransactionStatus" NOT NULL,
    "blockchain_tx_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorMembershipPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabourMiningActivity" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "reward_sfnl" DECIMAL(65,30) NOT NULL,
    "related_entity_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabourMiningActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceAnalytics" (
    "id" TEXT NOT NULL,
    "event_type" "AnalyticsEventType" NOT NULL,
    "user_id" TEXT,
    "metadata" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_swifin_id_key" ON "User"("swifin_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_user_id_key" ON "Vendor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_related_order_id_key" ON "Transaction"("related_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_user_id_key" ON "Driver"("user_id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_related_order_id_fkey" FOREIGN KEY ("related_order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SfnlReward" ADD CONSTRAINT "SfnlReward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideDeliveryBooking" ADD CONSTRAINT "RideDeliveryBooking_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideDeliveryBooking" ADD CONSTRAINT "RideDeliveryBooking_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorMembershipPayment" ADD CONSTRAINT "VendorMembershipPayment_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourMiningActivity" ADD CONSTRAINT "LabourMiningActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceAnalytics" ADD CONSTRAINT "MarketplaceAnalytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
