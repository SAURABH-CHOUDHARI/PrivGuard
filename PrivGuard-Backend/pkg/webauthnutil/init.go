package webauthnutil

import (
	"log"
	"os"
	"strings"

	"github.com/go-webauthn/webauthn/webauthn"
)

// New initializes a new WebAuthn instance with env config and returns it.
func New() *webauthn.WebAuthn {
	rpID := os.Getenv("WEBAUTHN_RPID")             // e.g., "privguard.com"
	rpDisplayName := os.Getenv("WEBAUTHN_RP_NAME") // e.g., "PrivGuard"
	rpOrigins := strings.Split(os.Getenv("WEBAUTHN_RP_ORIGINS"), ",") // e.g., "https://privguard.com,http://localhost:5173"

	wa, err := webauthn.New(&webauthn.Config{
		RPDisplayName: rpDisplayName,
		RPID:          rpID,
		RPOrigins:     rpOrigins,
	})
	if err != nil {
		log.Fatalf("❌ Failed to initialize WebAuthn: %v", err)
	}
	return wa
}
