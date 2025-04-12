package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/google/uuid"
)

func VaultHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userIDStr, ok := c.Locals("user_id").(string)
		if !ok || userIDStr == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized: User ID not found",
			})
		}

		// Parse UUID from string
		userUUID, err := uuid.Parse(userIDStr)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid user ID format",
			})
		}

		var vault models.Vault
		err = repo.DB.Preload("Services").Where("user_id = ?", userUUID).First(&vault).Error

		if err != nil {
			// Vault not found, so let's create it
			vault = models.Vault{
				UserID:   userUUID,
				Services: []models.Service{},
			}
			if err := repo.DB.Create(&vault).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create new vault",
				})
			}
		}

		// Construct response without decrypting passwords
		services := make([]fiber.Map, 0, len(vault.Services))
		for _, s := range vault.Services {
			services = append(services, fiber.Map{
				"id":        s.ID,
				"service":   s.ServiceName,
				"domain":    s.ServiceDomain,
				"logo":      s.LogoURL,
				"notes":     s.Notes,
				"encrypted": true,
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Vault ready",
			"vault":   services,
		})
	}
}
