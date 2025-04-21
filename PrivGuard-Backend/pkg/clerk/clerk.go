package clerk

import (
	"context"
	"crypto/rsa"
	"errors"
	"fmt"
	"net/http"
	"sync"

	"github.com/golang-jwt/jwt/v4"
	"github.com/lestrrat-go/jwx/jwk"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

var (
	clerkJWKS     jwk.Set
	jwksFetchOnce sync.Once
	jwksFetchErr  error
)

const clerkJWKSecretName = "privguard/clerk-jwks-url"

var (
	secretFetchOnce sync.Once
	cachedJWKURL    string
	secretFetchErr  error
)

func getClerkJWKURLFromSecretsManager() (string, error) {
	secretFetchOnce.Do(func() {
		cfg, err := config.LoadDefaultConfig(context.Background())
		if err != nil {
			secretFetchErr = fmt.Errorf("failed to load AWS config: %w", err)
			return
		}

		client := secretsmanager.NewFromConfig(cfg)
		out, err := client.GetSecretValue(context.Background(), &secretsmanager.GetSecretValueInput{
			SecretId: aws.String(clerkJWKSecretName),
		})
		if err != nil {
			secretFetchErr = fmt.Errorf("failed to get secret: %w", err)
			return
		}

		cachedJWKURL = aws.ToString(out.SecretString)
	})

	return cachedJWKURL, secretFetchErr
}

func getClerkJWKS() error {
	jwksFetchOnce.Do(func() {
		url, err := getClerkJWKURLFromSecretsManager()
		if err != nil {
			jwksFetchErr = err
			return
		}

		resp, err := http.Get(url)
		if err != nil {
			jwksFetchErr = fmt.Errorf("failed to fetch Clerk JWKS: %w", err)
			return
		}
		defer resp.Body.Close()

		clerkJWKS, jwksFetchErr = jwk.ParseReader(resp.Body)
	})
	return jwksFetchErr
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	if err := getClerkJWKS(); err != nil {
		return nil, err
	}

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("unexpected signing method")
		}

		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("missing 'kid' header")
		}

		key, found := clerkJWKS.LookupKeyID(kid)
		if !found {
			return nil, errors.New("matching JWK not found")
		}

		var rsaPublicKey rsa.PublicKey
		if err := key.Raw(&rsaPublicKey); err != nil {
			return nil, fmt.Errorf("failed to parse RSA public key: %w", err)
		}

		return &rsaPublicKey, nil
	})
}
