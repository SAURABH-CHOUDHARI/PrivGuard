package models

import (
	"github.com/google/uuid"
	"time"
)

type WebAuthnCredential struct {
	ID              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID          string    `gorm:"index;not null"` // Clerk or internal User ID
	CredentialID    string    `gorm:"unique;not null"` // Base64 encoded
	PublicKey       []byte    `gorm:"not null"` // Raw public key
	AttestationType string
	AAGUID          string
	SignCount       uint32
	CloneWarning    bool
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
