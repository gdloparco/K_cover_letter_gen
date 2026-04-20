package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

// ExtractResumeText sends the uploaded resume file to the scraper service
// and returns the extracted plain text.
func ExtractResumeText(fileBytes []byte, filename string) (string, error) {
	scraperURL := os.Getenv("SCRAPER_URL")
	if scraperURL == "" {
		scraperURL = "http://localhost:8085"
	}

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	part, err := writer.CreateFormFile("resume", filename)
	if err != nil {
		return "", fmt.Errorf("error creating form file: %w", err)
	}
	if _, err := part.Write(fileBytes); err != nil {
		return "", fmt.Errorf("error writing file bytes: %w", err)
	}
	writer.Close()

	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequest("POST", scraperURL+"/extract-resume", &body)
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("scraper unavailable: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("resume extraction failed (%d): %s", resp.StatusCode, string(respBody))
	}

	var result struct {
		ResumeText string `json:"resume_text"`
		Error      string `json:"error"`
	}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return "", fmt.Errorf("error parsing response: %w", err)
	}
	if result.Error != "" {
		return "", fmt.Errorf("scraper error: %s", result.Error)
	}

	return result.ResumeText, nil
}
