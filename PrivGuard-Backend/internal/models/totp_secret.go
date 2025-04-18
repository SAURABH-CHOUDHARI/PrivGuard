package models

import(
	"time"
)


type TOTPSecret struct {
    UserID   string `gorm:"primaryKey"`
    Secret   string // base32‑encoded
    Enabled  bool
    CreatedAt time.Time
}