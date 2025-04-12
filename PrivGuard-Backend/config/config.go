package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

// Redis client instance
var RDB *redis.Client

// InitRedis initializes Redis connection
func InitRedis() {
	redisAddr := os.Getenv("REDIS_URL") // Changed from "DB_ADDR" to "REDIS_URL"

	RDB = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: os.Getenv("DB_PASS"),
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := RDB.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}

	log.Println("Connected to Redis successfully!")
}
