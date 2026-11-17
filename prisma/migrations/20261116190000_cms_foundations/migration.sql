-- AlterTable
ALTER TABLE `users` ADD COLUMN `session_version` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `programs` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `articles` ADD COLUMN `program_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `donations` ADD COLUMN `refunded_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `stripe_event_created` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `stripe_payment_intent_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_session_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `article_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `url` TEXT NOT NULL,
    `caption_fr` TEXT NULL,
    `caption_en` TEXT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `article_images_article_id_display_order_idx`(`article_id`, `display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `program_id` INTEGER NOT NULL,
    `url` TEXT NOT NULL,
    `caption_fr` TEXT NULL,
    `caption_en` TEXT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `program_images_program_id_display_order_idx`(`program_id`, `display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_revisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity` VARCHAR(64) NOT NULL,
    `record_id` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(32) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `content_revisions_entity_record_id_created_at_idx`(`entity`, `record_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_drafts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity` VARCHAR(64) NOT NULL,
    `record_id` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `content_drafts_entity_record_id_key`(`entity`, `record_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_events` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_limits` (
    `key` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `request_limits_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `donations_stripe_session_id_key` ON `donations`(`stripe_session_id`);

-- CreateIndex
CREATE UNIQUE INDEX `donations_stripe_payment_intent_id_key` ON `donations`(`stripe_payment_intent_id`);

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_images` ADD CONSTRAINT `article_images_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_images` ADD CONSTRAINT `program_images_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

