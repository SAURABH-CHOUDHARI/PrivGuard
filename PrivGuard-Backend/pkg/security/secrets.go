// pkg/security/secrets.go
package security

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

func GetMasterKey(secretName string) (string, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return "", fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := secretsmanager.NewFromConfig(cfg)

	result, err := client.GetSecretValue(context.TODO(), &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(secretName),
	})
	if err != nil {
		return "", fmt.Errorf("failed to get secret: %w", err)
	}

	var payload map[string]string
	if err := json.Unmarshal([]byte(*result.SecretString), &payload); err != nil {
		return "", fmt.Errorf("failed to parse secret: %w", err)
	}

	key, ok := payload["MASTER_ENCRYPTION_KEY"]
	if !ok {
		return "", fmt.Errorf("MASTER_ENCRYPTION_KEY not found in secret")
	}

	return key, nil
}
