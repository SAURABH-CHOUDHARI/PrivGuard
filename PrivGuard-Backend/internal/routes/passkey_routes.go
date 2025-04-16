package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/go-webauthn/webauthn/webauthn"
	
	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
)

func RegisterPasskeyRoutes(router fiber.Router, repo storage.Repository,  wa *webauthn.WebAuthn) {

	auth := router.Group("/auth", middleware.AuthMiddleware(repo))

	auth.Post("/register/start", handlers.StartRegistrationHandler(repo, wa))
	auth.Post("/register/finish", handlers.FinishRegistrationHandler(repo, wa))
	auth.Post("/login/start", handlers.StartLoginHandler(repo, wa))
	auth.Post("/login/finish", handlers.FinishLoginHandler(repo, wa))

}
