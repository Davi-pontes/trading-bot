-- AlterTable
ALTER TABLE `UserBotConfig` MODIFY `key` VARCHAR(255) NULL,
    MODIFY `secret` VARCHAR(255) NULL,
    MODIFY `passphrase` VARCHAR(255) NULL,
    MODIFY `riskThreshold` INTEGER NULL,
    MODIFY `amountForSetMargin` DOUBLE NULL,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `variation` INTEGER NULL,
    MODIFY `leverage` DOUBLE NULL,
    MODIFY `balance` INTEGER NULL,
    MODIFY `profitPercentage` DOUBLE NULL,
    MODIFY `from` DOUBLE NULL,
    MODIFY `evenPositive` DOUBLE NULL,
    MODIFY `evenNegative` DOUBLE NULL;
