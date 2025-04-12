package services

import (

	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"gorm.io/gorm"
)

// GetOrCreateUser looks up a user by Clerk ID or creates them if not found.
func GetOrCreateUser(db *gorm.DB, clerkID, email, firstName,lastName  string) (*models.User, error) {
	var user models.User

	// Try to find existing user by ClerkID
	err := db.Where("clerk_id = ?", clerkID).First(&user).Error
	if err == nil {
		return &user, nil // ✅ user already exists
	}

	if err != gorm.ErrRecordNotFound {
		return nil, err // ❌ some other DB error
	}


	// 🆕 Create new user (let GORM/Postgres handle UUID if model is set properly)
	newUser := models.User{
		ClerkID:   clerkID,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := db.Create(&newUser).Error; err != nil {
		return nil, err
	}

	// ✅ Optional but safe: reload full user with populated fields
	if err := db.First(&user, "clerk_id = ?", clerkID).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

