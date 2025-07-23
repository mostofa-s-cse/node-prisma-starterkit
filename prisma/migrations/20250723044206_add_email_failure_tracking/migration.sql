-- CreateTable
CREATE TABLE `EmailFailure` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `error` TEXT NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `maxAttempts` INTEGER NOT NULL DEFAULT 5,
    `lastAttempt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextRetry` DATETIME(3) NULL,
    `isResolved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailFailure_jobId_key`(`jobId`),
    INDEX `EmailFailure_email_idx`(`email`),
    INDEX `EmailFailure_isResolved_idx`(`isResolved`),
    INDEX `EmailFailure_nextRetry_idx`(`nextRetry`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
