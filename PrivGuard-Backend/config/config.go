package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

// Optionally still expose context if you like
var Ctx = context.Background()

func InitRedis() *redis.Client {
	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379" // Fallback
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: os.Getenv("DB_PASS"), // use "" if unauthenticated
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf(" Could not connect to Redis: %v", err)
	}

	log.Println(" Connected to Redis successfully!")

	return rdb
}
