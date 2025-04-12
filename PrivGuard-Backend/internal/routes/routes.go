package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func RegisterRoutes(app *fiber.App, vaultRoutes storage.Repository) {
	api := app.Group("/api")

	protected := api.Group("/protected", middleware.AuthMiddleware(vaultRoutes.DB))
	protected.Get("/vault", handlers.VaultHandler(vaultRoutes))
	protected.Post("/vault/add", handlers.AddPasswordHandler(vaultRoutes))
	protected.Get("/vault/:id", handlers.GetPasswordDetailHandler(vaultRoutes))

	
}
