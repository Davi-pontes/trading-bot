-- CreateTable
CREATE TABLE `UserBotConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `secret` VARCHAR(255) NOT NULL,
    `passphrase` VARCHAR(255) NOT NULL,
    `accessLevel` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `riskThreshold` INTEGER NOT NULL,
    `amountForSetMargin` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `variation` INTEGER NOT NULL,
    `leverage` DOUBLE NOT NULL,
    `balance` INTEGER NOT NULL,
    `profitPercentage` DOUBLE NOT NULL,
    `from` DOUBLE NOT NULL,
    `evenPositive` DOUBLE NOT NULL,
    `evenNegative` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserBotConfig_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
