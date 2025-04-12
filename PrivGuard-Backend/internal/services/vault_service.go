package services

import (
	"fmt"
	"log"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/crypto"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func AddPasswordToVault(db *gorm.DB, userID string, serviceName, domain, logo, rawPassword, notes string) error {
	log.Println("🔧 Starting AddPasswordToVault...")

	// Step 1: Parse userID
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		log.Printf(" Invalid UUID: %v\n", err)
		return fmt.Errorf("invalid user ID: %w", err)
	}
	log.Printf(" Parsed userID: %s\n", parsedUserID)

	// Step 2: Find user
	var user models.User
	if err := db.Where("id = ?", parsedUserID).First(&user).Error; err != nil {
		log.Printf(" Failed to find user: %v\n", err)
		return fmt.Errorf("failed to find user with ID %s: %w", parsedUserID, err)
	}
	log.Printf(" User found: %s (%s)\n", user.FirstName, user.Email)

	// Step 3: Get or create vault
	var vault models.Vault
	if err := db.FirstOrCreate(&vault, models.Vault{UserID: user.ID}).Error; err != nil {
		log.Printf(" Failed to get/create vault: %v\n", err)
		return fmt.Errorf("failed to find/create vault: %w", err)
	}
	log.Printf(" Vault ID: %s for user %s\n", vault.ID, user.ID)

	// Step 4: Load encryption key
	key, err := crypto.LoadAESKey()
	if err != nil {
		log.Printf(" Failed to load AES key: %v\n", err)
		return fmt.Errorf("failed to load encryption key: %w", err)
	}
	log.Printf(" AES key loaded successfully (len: %d)\n", len(key))

	// Step 5: Encrypt password
	encryptedPass, iv, err := crypto.EncryptAES([]byte(rawPassword), key)
	if err != nil {
		log.Printf(" Encryption failed: %v\n", err)
		return fmt.Errorf("failed to encrypt password: %w", err)
	}
	log.Println(" Password encrypted")

	// Step 6: Create service entry
	service := models.Service{
		ID:                uuid.New(),
		VaultID:           vault.ID,
		ServiceName:       serviceName,
		ServiceDomain:     domain,
		LogoURL:           logo,
		EncryptedPassword: encryptedPass,
		Notes:             notes,
		IV:                iv,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}
	log.Printf("📦 Service struct prepared: %+v\n", service)

	// Step 7: Save to DB
	if err := db.Create(&service).Error; err != nil {
		log.Printf(" Failed to save service: %v\n", err)
		return fmt.Errorf("failed to save password: %w", err)
	}
	log.Println(" Password saved to vault")

	return nil
}


func GetOrCreateVault(db *gorm.DB, userID string) (uuid.UUID, error) {
    parsedUserID, err := uuid.Parse(userID)
    if err != nil {
        return uuid.Nil, fmt.Errorf("invalid user ID: %w", err)
    }

    var vault models.Vault
    err = db.Where("user_id = ?", parsedUserID).First(&vault).Error

    if err == gorm.ErrRecordNotFound {
        vault = models.Vault{
            ID:     uuid.New(),
            UserID: parsedUserID,
        }
        if err := db.Create(&vault).Error; err != nil {
            return uuid.Nil, err
        }
        return vault.ID, nil
    } else if err != nil {
        return uuid.Nil, err
    }

    return vault.ID, nil
}



