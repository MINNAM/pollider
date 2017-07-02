const installSQLTemplate = ( data ) => {

    return `-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema m
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema m
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS \`${data.name}\` DEFAULT CHARACTER SET utf8 ;
USE \`${data.name}\` ;

-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}user\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}user\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}user\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`username\` VARCHAR(100) NULL,
  \`password\` VARCHAR(100) NULL,
  \`first_name\` VARCHAR(45) NULL,
  \`last_name\` VARCHAR(45) NULL,
  \`permission\` INT NULL,
  \`created_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`modified_date\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_type\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_type\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_type\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(45) NULL,
  \`name_singular\` VARCHAR(45) NULL,
  \`name_plural\` VARCHAR(45) NULL,
  \`home\` INT NULL,
  \`hyperlink\` VARCHAR(45) NULL,
  \`uploadable\` VARCHAR(45) NULL,
  \`support_image\` VARCHAR(45) NULL,
  \`support_audio\` VARCHAR(45) NULL,
  \`support_document\` VARCHAR(45) NULL,
  \`support_other\` VARCHAR(45) NULL,
  \`support_video\` VARCHAR(45) NULL,
  \`support_post\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_data_type\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_data_type\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_data_type\` (
  \`id\` INT NOT NULL,
  \`name\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`parent_id\` INT NULL,
  \`alias_id\` INT NULL,
  \`user_id\` INT NOT NULL,
  \`post_type_id\` INT NOT NULL,
  \`post_data_type_id\` INT NOT NULL,
  \`commentable\` INT NULL,
  \`name\` VARCHAR(100) NULL,
  \`hyperlink\` VARCHAR(100) NULL,
  \`extension\` VARCHAR(45) NULL,
  \`size\` INT NULL,
  \`status\` VARCHAR(10) NULL,
  \`path\` VARCHAR(200) NULL,
  \`filename\` VARCHAR(200) NULL,
  \`container\` INT NULL,
  \`open\` INT NULL,
  \`public_date\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  \`created_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`modified_date\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}post_${data.table_prefix}user1_idx\` (\`user_id\` ASC),
  INDEX \`fk_${data.table_prefix}post_${data.table_prefix}post_type1_idx\` (\`post_type_id\` ASC),
  INDEX \`fk_${data.table_prefix}post_${data.table_prefix}post_data_type1_idx\` (\`post_data_type_id\` ASC),
  INDEX \`fk_${data.table_prefix}post_${data.table_prefix}post1_idx\` (\`parent_id\` ASC),
  INDEX \`fk_${data.table_prefix}post_${data.table_prefix}post2_idx\` (\`alias_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}post_${data.table_prefix}post_type1\`
    FOREIGN KEY (\`post_type_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post_type\` (\`id\`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}post_${data.table_prefix}user1\`
    FOREIGN KEY (\`user_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}user\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}post_${data.table_prefix}post1\`
    FOREIGN KEY (\`parent_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post\` (\`id\`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}post_${data.table_prefix}post_data_type1\`
    FOREIGN KEY (\`post_data_type_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post_data_type\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}post_${data.table_prefix}post2\`
    FOREIGN KEY (\`alias_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post\` (\`id\`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}event\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}event\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}event\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` INT NOT NULL,
  \`name\` VARCHAR(45) NULL,
  \`date\` VARCHAR(45) NULL,
  \`postal_code\` VARCHAR(45) NULL,
  \`street_number\` VARCHAR(45) NULL,
  \`street_name\` VARCHAR(45) NULL,
  \`suite_number\` VARCHAR(45) NULL,
  \`description\` VARCHAR(45) NULL,
  \`city\` VARCHAR(45) NULL,
  \`province\` VARCHAR(45) NULL,
  \`country\` VARCHAR(45) NULL,
  \`createdDate\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`modifiedDate\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}event_${data.table_prefix}user1_idx\` (\`user_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}event_${data.table_prefix}user1\`
    FOREIGN KEY (\`user_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}user\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}mailing_list\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}mailing_list\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}mailing_list\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` INT NOT NULL,
  \`first_name\` VARCHAR(45) NULL,
  \`last_name\` VARCHAR(45) NULL,
  \`email\` VARCHAR(100) NULL,
  \`createdDate\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}mailing_list_${data.table_prefix}user1_idx\` (\`user_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}mailing_list_${data.table_prefix}user1\`
    FOREIGN KEY (\`user_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}user\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}site\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}site\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}site\` (
  \`id\` INT NOT NULL,
  \`parent_id\` INT NULL,
  \`name\` VARCHAR(45) NULL,
  \`value\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}site_${data.table_prefix}site1_idx\` (\`parent_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}site_${data.table_prefix}site1\`
    FOREIGN KEY (\`parent_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}site\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_meta\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_meta\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_meta\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`post_type_id\` INT NOT NULL,
  \`field\` VARCHAR(45) NULL,
  \`data_type\` VARCHAR(300) NULL,
  \`data\` VARCHAR(1000) NULL,
  \`display\` INT NULL,
  \`main\` INT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}post_meta_${data.table_prefix}post_type1_idx\` (\`post_type_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}post_meta_${data.table_prefix}post_type1\`
    FOREIGN KEY (\`post_type_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post_type\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}message\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}message\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}message\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` INT NOT NULL,
  \`first_name\` VARCHAR(45) NULL,
  \`last_name\` VARCHAR(45) NULL,
  \`email\` VARCHAR(100) NULL,
  \`body\` MEDIUMTEXT NULL,
  \`sent_date\` DATETIME NULL,
  \`recieved_date\` DATETIME NULL,
  \`created_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`modified_date\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}message_${data.table_prefix}user1_idx\` (\`user_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}message_${data.table_prefix}user1\`
    FOREIGN KEY (\`user_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}user\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}analystic_type\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}analystic_type\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}analystic_type\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}analystic\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}analystic\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}analystic\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`post_id\` INT NOT NULL,
  \`analystic_type_id\` INT NOT NULL,
  \`ip\` VARCHAR(45) NULL,
  \`country\` VARCHAR(45) NULL,
  \`city\` VARCHAR(45) NULL,
  \`platform\` VARCHAR(45) NULL,
  \`created_date\` TIMESTAMP NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}analystic_${data.table_prefix}post1_idx\` (\`post_id\` ASC),
  INDEX \`fk_${data.table_prefix}analystic_${data.table_prefix}analystic_type1_idx\` (\`analystic_type_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}analystic_${data.table_prefix}post1\`
    FOREIGN KEY (\`post_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}analystic_${data.table_prefix}analystic_type1\`
    FOREIGN KEY (\`analystic_type_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}analystic_type\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_content_type\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_content_type\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_content_type\` (
  \`id\` INT NOT NULL,
  \`name\` VARCHAR(45) NULL,
  \`component_name\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_data\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_data\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_data\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`post_id\` INT NOT NULL,
  \`post_content_type_id\` INT NOT NULL,
  \`field\` VARCHAR(45) NULL,
  \`content\` LONGTEXT NULL,
  \`content_raw\` LONGTEXT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`fk_${data.table_prefix}post_data_${data.table_prefix}post1_idx\` (\`post_id\` ASC),
  INDEX \`fk_${data.table_prefix}post_data_${data.table_prefix}poat_data_type1_idx\` (\`post_content_type_id\` ASC),
  CONSTRAINT \`fk_${data.table_prefix}post_data_${data.table_prefix}post1\`
    FOREIGN KEY (\`post_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post\` (\`id\`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT \`fk_${data.table_prefix}post_data_${data.table_prefix}poat_data_type1\`
    FOREIGN KEY (\`post_content_type_id\`)
    REFERENCES \`${data.name}\`.\`${data.table_prefix}post_content_type\` (\`id\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}data_type\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}data_type\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}data_type\` (
  \`id\` INT NOT NULL,
  \`name\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table \`${data.name}\`.\`${data.table_prefix}post_cache\`
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`${data.name}\`.\`${data.table_prefix}post_cache\` ;

CREATE TABLE IF NOT EXISTS \`${data.name}\`.\`${data.table_prefix}post_cache\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`path\` VARCHAR(200) NULL,
  \`filename\` VARCHAR(200) NULL,
  \`extension\` VARCHAR(45) NULL,
  PRIMARY KEY (\`id\`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
`;

};

export default installSQLTemplate;
