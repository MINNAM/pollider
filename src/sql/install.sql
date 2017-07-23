-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema m
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema m
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pollider` DEFAULT CHARACTER SET utf8 ;
USE `pollider` ;

-- -----------------------------------------------------
-- Table `pollider`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`user` ;

CREATE TABLE IF NOT EXISTS `pollider`.`user` (
`id` INT NOT NULL AUTO_INCREMENT,
`username` VARCHAR(100) NULL,
`password` VARCHAR(100) NULL,
`first_name` VARCHAR(45) NULL,
`last_name` VARCHAR(45) NULL,
`permission` INT NULL,
`created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
`modified_date` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_type` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_type` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(45) NULL,
`name_singular` VARCHAR(45) NULL,
`name_plural` VARCHAR(45) NULL,
`home` INT NULL,
`hyperlink` VARCHAR(45) NULL,
`uploadable` VARCHAR(45) NULL,
`support_image` VARCHAR(45) NULL,
`support_audio` VARCHAR(45) NULL,
`support_document` VARCHAR(45) NULL,
`support_other` VARCHAR(45) NULL,
`support_video` VARCHAR(45) NULL,
`support_post` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_data_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_data_type` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_data_type` (
`id` INT NOT NULL,
`name` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post` (
`id` INT NOT NULL AUTO_INCREMENT,
`parent_id` INT NULL,
`alias_id` INT NULL,
`user_id` INT NOT NULL,
`post_type_id` INT NOT NULL,
`post_data_type_id` INT NOT NULL,
`commentable` INT NULL,
`name` VARCHAR(100) NULL,
`hyperlink` VARCHAR(100) NULL,
`extension` VARCHAR(45) NULL,
`size` INT NULL,
`status` VARCHAR(10) NULL,
`path` VARCHAR(200) NULL,
`filename` VARCHAR(200) NULL,
`container` INT NULL,
`open` INT NULL,
`public_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
`created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
`modified_date` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
INDEX `fk_post_user1_idx` (`user_id` ASC),
INDEX `fk_post_post_type1_idx` (`post_type_id` ASC),
INDEX `fk_post_post_data_type1_idx` (`post_data_type_id` ASC),
INDEX `fk_post_post1_idx` (`parent_id` ASC),
INDEX `fk_post_post2_idx` (`alias_id` ASC),
CONSTRAINT `fk_post_post_type1`
FOREIGN KEY (`post_type_id`)
REFERENCES `pollider`.`post_type` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION,
CONSTRAINT `fk_post_user1`
FOREIGN KEY (`user_id`)
REFERENCES `pollider`.`user` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
CONSTRAINT `fk_post_post1`
FOREIGN KEY (`parent_id`)
REFERENCES `pollider`.`post` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION,
CONSTRAINT `fk_post_post_data_type1`
FOREIGN KEY (`post_data_type_id`)
REFERENCES `pollider`.`post_data_type` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
CONSTRAINT `fk_post_post2`
FOREIGN KEY (`alias_id`)
REFERENCES `pollider`.`post` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `pollider`.`event`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`event` ;

CREATE TABLE IF NOT EXISTS `pollider`.`event` (
`id` INT NOT NULL AUTO_INCREMENT,
`user_id` INT NOT NULL,
`name` VARCHAR(45) NULL,
`date` VARCHAR(45) NULL,
`postal_code` VARCHAR(45) NULL,
`street_number` VARCHAR(45) NULL,
`street_name` VARCHAR(45) NULL,
`suite_number` VARCHAR(45) NULL,
`description` VARCHAR(45) NULL,
`city` VARCHAR(45) NULL,
`province` VARCHAR(45) NULL,
`country` VARCHAR(45) NULL,
`createdDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
`modifiedDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
INDEX `fk_event_user1_idx` (`user_id` ASC),
CONSTRAINT `fk_event_user1`
FOREIGN KEY (`user_id`)
REFERENCES `pollider`.`user` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`mailing_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`mailing_list` ;

CREATE TABLE IF NOT EXISTS `pollider`.`mailing_list` (
`id` INT NOT NULL AUTO_INCREMENT,
`user_id` INT NOT NULL,
`first_name` VARCHAR(45) NULL,
`last_name` VARCHAR(45) NULL,
`email` VARCHAR(100) NULL,
`createdDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
INDEX `fk_mailing_list_user1_idx` (`user_id` ASC),
CONSTRAINT `fk_mailing_list_user1`
FOREIGN KEY (`user_id`)
REFERENCES `pollider`.`user` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`site`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`site` ;

CREATE TABLE IF NOT EXISTS `pollider`.`site` (
`id` INT NOT NULL,
`parent_id` INT NULL,
`name` VARCHAR(45) NULL,
`value` VARCHAR(45) NULL,
PRIMARY KEY (`id`),
INDEX `fk_site_site1_idx` (`parent_id` ASC),
CONSTRAINT `fk_site_site1`
FOREIGN KEY (`parent_id`)
REFERENCES `pollider`.`site` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_meta`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_meta` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_meta` (
`id` INT NOT NULL AUTO_INCREMENT,
`post_type_id` INT NOT NULL,
`field` VARCHAR(45) NULL,
`data_type` VARCHAR(300) NULL,
`data` VARCHAR(1000) NULL,
`display` INT NULL,
`main` INT NULL,
PRIMARY KEY (`id`),
INDEX `fk_post_meta_post_type1_idx` (`post_type_id` ASC),
CONSTRAINT `fk_post_meta_post_type1`
FOREIGN KEY (`post_type_id`)
REFERENCES `pollider`.`post_type` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`message` ;

CREATE TABLE IF NOT EXISTS `pollider`.`message` (
`id` INT NOT NULL AUTO_INCREMENT,
`user_id` INT NOT NULL,
`first_name` VARCHAR(45) NULL,
`last_name` VARCHAR(45) NULL,
`email` VARCHAR(100) NULL,
`body` MEDIUMTEXT NULL,
`sent_date` DATETIME NULL,
`recieved_date` DATETIME NULL,
`created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
`modified_date` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`),
INDEX `fk_message_user1_idx` (`user_id` ASC),
CONSTRAINT `fk_message_user1`
FOREIGN KEY (`user_id`)
REFERENCES `pollider`.`user` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`analystic_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`analystic_type` ;

CREATE TABLE IF NOT EXISTS `pollider`.`analystic_type` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`analystic`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`analystic` ;

CREATE TABLE IF NOT EXISTS `pollider`.`analystic` (
`id` INT NOT NULL AUTO_INCREMENT,
`post_id` INT NOT NULL,
`analystic_type_id` INT NOT NULL,
`ip` VARCHAR(45) NULL,
`country` VARCHAR(45) NULL,
`city` VARCHAR(45) NULL,
`platform` VARCHAR(45) NULL,
`created_date` TIMESTAMP NULL,
PRIMARY KEY (`id`),
INDEX `fk_analystic_post1_idx` (`post_id` ASC),
INDEX `fk_analystic_analystic_type1_idx` (`analystic_type_id` ASC),
CONSTRAINT `fk_analystic_post1`
FOREIGN KEY (`post_id`)
REFERENCES `pollider`.`post` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
CONSTRAINT `fk_analystic_analystic_type1`
FOREIGN KEY (`analystic_type_id`)
REFERENCES `pollider`.`analystic_type` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_content_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_content_type` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_content_type` (
`id` INT NOT NULL,
`name` VARCHAR(45) NULL,
`component_name` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_data`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_data` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_data` (
`id` INT NOT NULL AUTO_INCREMENT,
`post_id` INT NOT NULL,
`post_content_type_id` INT NOT NULL,
`field` VARCHAR(45) NULL,
`content` LONGTEXT NULL,
`content_raw` LONGTEXT NULL,
PRIMARY KEY (`id`),
INDEX `fk_post_data_post1_idx` (`post_id` ASC),
INDEX `fk_post_data_poat_data_type1_idx` (`post_content_type_id` ASC),
CONSTRAINT `fk_post_data_post1`
FOREIGN KEY (`post_id`)
REFERENCES `pollider`.`post` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION,
CONSTRAINT `fk_post_data_poat_data_type1`
FOREIGN KEY (`post_content_type_id`)
REFERENCES `pollider`.`post_content_type` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`data_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`data_type` ;

CREATE TABLE IF NOT EXISTS `pollider`.`data_type` (
`id` INT NOT NULL,
`name` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pollider`.`post_cache`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pollider`.`post_cache` ;

CREATE TABLE IF NOT EXISTS `pollider`.`post_cache` (
`id` INT NOT NULL AUTO_INCREMENT,
`path` VARCHAR(200) NULL,
`filename` VARCHAR(200) NULL,
`extension` VARCHAR(45) NULL,
PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
