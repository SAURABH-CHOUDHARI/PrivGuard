package routes

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/gofiber/fiber/v2"
	"time"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func RegisterPasskeyRoutes(router fiber.Router, repo storage.Repository, wa *webauthn.WebAuthn) {

	auth := router.Group("/auth", middleware.AuthMiddleware(repo))


	 // TOTP setup & verify
	 auth.Get("/totp/setup", handlers.GetTOTPSetupHandler(repo))
	 auth.Post("/totp/verify", handlers.VerifyTOTPHandler(repo))


	auth.Post("/register/start",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "register_start"),
		handlers.StartRegistrationHandler(repo, wa))

	auth.Post("/register/finish",
		middleware.UserRateLimit(repo, 20, 1*time.Minute, "register_finish"),
		handlers.FinishRegistrationHandler(repo, wa))

	auth.Post("/login/start",
		middleware.UserRateLimit(repo, 100, 1*time.Minute, "login_start"),
		handlers.StartLoginHandler(repo, wa))

	auth.Post("/login/finish",
		middleware.UserRateLimit(repo, 100, 1*time.Minute, "login_finish"),
		handlers.FinishLoginHandler(repo, wa))

}
