package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func RegisterRoutes(app *fiber.App, repo storage.Repository) {
	api := app.Group("/api")

	protected := api.Group("/protected", middleware.AuthMiddleware(repo))
	protected.Get("/vault", handlers.VaultHandler(repo))
	protected.Post("/vault/add", handlers.AddPasswordHandler(repo))
	protected.Get("/vault/:id", handlers.GetPasswordDetailHandler(repo))

	
}
