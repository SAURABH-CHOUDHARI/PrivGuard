// pkg/crypto/aes.go
package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"os"
	"fmt"
)

// EncryptAES encrypts plaintext using AES-256 with a given key and returns base64 ciphertext and IV
func EncryptAES(plaintext, key []byte) (string, string, error) {
	if len(key) != 32 {
		return "", "", errors.New("key must be 32 bytes for AES-256")
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", "", err
	}

	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", "", err
	}

	ciphertext := make([]byte, len(plaintext))
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext, plaintext)

	return base64.StdEncoding.EncodeToString(ciphertext), base64.StdEncoding.EncodeToString(iv), nil
}

// DecryptAES decrypts a base64 ciphertext using AES-256 with the given key and IV
func DecryptAES(ciphertextB64, ivB64 string, key []byte) (string, error) {
	if len(key) != 32 {
		return "", errors.New("key must be 32 bytes for AES-256")
	}

	ciphertext, err := base64.StdEncoding.DecodeString(ciphertextB64)
	if err != nil {
		return "", err
	}

	iv, err := base64.StdEncoding.DecodeString(ivB64)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plaintext := make([]byte, len(ciphertext))
	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(plaintext, ciphertext)

	return string(plaintext), nil
}

// LoadAESKey fetches AES key from env (or future SecretManager)
func LoadAESKey() ([]byte, error) {
	key, err := base64.StdEncoding.DecodeString(os.Getenv("MASTER_ENCRYPTION_KEY"))
	if err != nil {
		return nil, fmt.Errorf("failed to decode MASTER_ENCRYPTION_KEY: %w", err)
	}

	if len(key) != 32 {
		return nil, errors.New("MASTER_ENCRYPTION_KEY must be exactly 32 bytes after base64 decoding")
	}

	return key, nil
}
