// api/handlers/totp_handler.go
package handlers

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
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

		// Fetch user data from Redis
		cacheKey := "user:" + clerkID
		cachedUser, err := repo.RedisClient.Get(c.Context(), cacheKey).Result()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to retrieve user data from Redis",
			})
		}

		var user struct {
			FirstName string `json:"FirstName"`
		}
		if err := json.Unmarshal([]byte(cachedUser), &user); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unmarshal user data",
			})
		}

		// Check if TOTP secret already exists
		var existingSecret models.TOTPSecret
		err = repo.DB.Where("user_id = ?", userID).First(&existingSecret).Error
		if err == nil {
			// Secret already exists, return existing URI
			provisioningURI := fmt.Sprintf(
				"otpauth://totp/PrivGuard:%s?secret=%s&issuer=PrivGuard",
				user.FirstName, existingSecret.Secret,
			)
			return c.JSON(fiber.Map{
				"provisioning_uri": provisioningURI,
			})
		}
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to query TOTP secret"})
		}

		// Generate and store a new secret
		secret, uri, err := services.GenerateTOTP(userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate TOTP secret",
			})
		}

		provisioningURI := strings.Replace(uri, "PrivGuard:"+userID, "PrivGuard:"+user.FirstName, 1)

		newSecret := models.TOTPSecret{
			UserID:    userID,
			Secret:    secret,
			Enabled:   false,
			CreatedAt: time.Now(),
		}
		if err := repo.DB.Create(&newSecret).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not save secret"})
		}

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

func CheckTOTPexist(repo storage.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(string)

		var totp models.TOTPSecret
		result := repo.DB.Where("user_id = ?", userID).First(&totp)

		if result.RowsAffected == 0 {
			return c.JSON(fiber.Map{"message": "TOTP does not exist"})
		}

		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
		}

		return c.JSON(fiber.Map{"message": "TOTP is present"})
	}
}
