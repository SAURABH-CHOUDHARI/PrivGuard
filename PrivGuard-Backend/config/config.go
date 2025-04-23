package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

func InitRedis() *redis.Client {
	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "redis:6379" // Fallback
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:         redisAddr,
		Password:     os.Getenv("DB_PASS"),
		DB:           0,
		// Performance optimizations
		PoolSize:     100,                  // Increase from default (10) for high concurrency
		MinIdleConns: 20,                   // Keep connections ready
		PoolTimeout:  4 * time.Second,      // How long to wait for connection if pool is exhausted
		ReadTimeout:  100 * time.Millisecond, // Lower read timeout for faster failure detection
		WriteTimeout: 100 * time.Millisecond, // Lower write timeout
		DialTimeout:  200 * time.Millisecond, // Connection establishment timeout
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf(" Could not connect to Redis: %v", err)
	}

	log.Println(" Connected to Redis successfully!")

	return rdb
}