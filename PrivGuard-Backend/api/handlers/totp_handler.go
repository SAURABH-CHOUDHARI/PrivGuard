// api/handlers/totp_handler.go
package handlers

import (
	"encoding/json"
	"strings"


	"github.com/gofiber/fiber/v2"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/services"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/models"
	"time"
)

func GetTOTPSetupHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)
		clerkID := c.Locals("clerk_id").(string)

		// Fetch user data from Redis using the userID (this assumes you're using Redis for user cache)
		cacheKey := "user:" + clerkID // Assuming you're storing users with the key "user:{userID}"
		cachedUser, err := repo.RedisClient.Get(c.Context(), cacheKey).Result()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to retrieve user data from Redis",
			})
		}

		// Assuming cachedUser is a JSON string and can be unmarshalled into a struct
		var user struct {
			FirstName string `json:"FirstName"`
		}

		err = json.Unmarshal([]byte(cachedUser), &user)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unmarshal user data",
			})
		}

		// Generate TOTP secret and URI
		secret, uri, err := services.GenerateTOTP(userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate TOTP secret",
			})
		}

		// Replace user ID in URI with user’s name (e.g., "PrivGuard:FirstName LastName")
		provisioningURI := strings.Replace(uri, "PrivGuard:"+userID, "PrivGuard:"+user.FirstName, 1)

		// Save or update TOTP secret in DB (set Enabled = false)
		repo.DB.Where("user_id = ?", userID).Delete(&models.TOTPSecret{}) // clear existing

		err = repo.DB.Create(&models.TOTPSecret{
			UserID:    userID,
			Secret:    secret,
			Enabled:   false,
			CreatedAt: time.Now(),
		}).Error

		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not save secret"})
		}

		// Return the provisioning URI with user name
		return c.JSON(fiber.Map{
			"provisioning_uri": provisioningURI,
		})
	}
}

func VerifyTOTPHandler(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)

		var body struct {
			Code string `json:"code"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		var totp models.TOTPSecret
		if err := repo.DB.First(&totp, "user_id = ?", userID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "TOTP not setup"})
		}

		if !services.VerifyTOTP(totp.Secret, body.Code) {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid TOTP code"})
		}

		totp.Enabled = true
		repo.DB.Save(&totp)

		return c.JSON(fiber.Map{"message": "TOTP verified and enabled"})
	}
}
