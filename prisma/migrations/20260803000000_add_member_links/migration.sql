-- AlterTable
ALTER TABLE `ClassMember` DROP COLUMN `nim`;

-- AlterTable
ALTER TABLE `ClassMember` ADD COLUMN `githubUrl` VARCHAR(191) NULL,
    ADD COLUMN `linkedinUrl` VARCHAR(191) NULL;