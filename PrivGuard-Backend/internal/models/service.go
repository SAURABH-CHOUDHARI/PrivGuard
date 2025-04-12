package models

import (
	"github.com/google/uuid"
	"time"
)

type Service struct {
	ID                uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	VaultID           uuid.UUID `gorm:"not null;index"`
	ServiceName       string    `gorm:"not null;index"`
	ServiceDomain     string
	LogoURL           string
	EncryptedPassword string    `gorm:"not null"`
	IV                string    `gorm:"not null"` 
	Notes             string
	CreatedAt         time.Time `gorm:"autoCreateTime"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime"`

	// Relations
	Vault Vault `gorm:"foreignKey:VaultID"`
}
