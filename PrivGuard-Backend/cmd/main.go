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
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize Redis
	config.InitRedis()

	// Connect to Postgres
	db, err := storage.NewConnection()
	if err != nil {
		log.Fatal(" Could not connect to DB")
	}

	// ✅ Conditional migration based on env var
	if os.Getenv("RUN_MIGRATIONS") == "true" {
		migrations.AutoMigrate(db)
	}

	// Set up Repository
	vaultRoutes := storage.Repository{DB: db}

	// Create Fiber app
	app := fiber.New()
	app.Use(logger.New()) // Logs incoming requests
	app.Use(cors.New())   // Enable CORS

	// Register Routes
	routes.RegisterRoutes(app, vaultRoutes)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}
