package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/middleware"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/api/handlers"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
)

func RegisterRoutes(router fiber.Router, repo storage.Repository,  ) {
	protected := router.Group("/protected", middleware.AuthMiddleware(repo))
    
    // Vault routes
    vault := protected.Group("/vault")
    vault.Get("/", handlers.VaultHandler(repo))
    vault.Post("/add", handlers.AddPasswordHandler(repo))
    vault.Get("/:id", handlers.GetPasswordDetailHandler(repo))	
    vault.Delete("/:id", handlers.DeletePasswordHandler(repo))	
    vault.Post("/:id/update-note", handlers.UpdateServiceNotesHandler(repo))	
    vault.Post("/:id/update-password", handlers.UpdateServicePasswordHandler(repo))	
}
