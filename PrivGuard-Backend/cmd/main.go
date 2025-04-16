package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"github.com/SAURABH-CHOUDHARI/privguard-backend/config"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/db/migrations"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/internal/routes"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/storage"
	"github.com/SAURABH-CHOUDHARI/privguard-backend/pkg/webauthnutil"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Redis
	redisClient := config.InitRedis()

	// Initialize WebAuthn
	webauthn := webauthnutil.New()

	// Connect to Postgres
	db, err := storage.NewConnection()
	if err != nil {
		log.Fatal("❌ Could not connect to DB")
	}

	// Conditional migration
	if os.Getenv("RUN_MIGRATIONS") == "true" {
		migrations.AutoMigrate(db)
	}

	// Set up Repository with both DB and Redis
	vaultRoutes := storage.Repository{
		DB:          db,
		RedisClient: redisClient,
	}

	// Set up Fiber app
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173", // your frontend origin
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,OPTIONS", // include OPTIONS for preflight
	}))

	// Register all routes
	routes.SetupRoutes(app, vaultRoutes, webauthn)


	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}
