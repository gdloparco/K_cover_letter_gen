package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// callLLM sends a prompt to the local Ollama instance and returns the text response.
// Ollama must be running: `ollama serve` with the model already pulled.
func callLLM(prompt string) (string, error) {
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	model := os.Getenv("OLLAMA_MODEL")
	if model == "" {
		model = "llama3.2"
	}

	client := &http.Client{Timeout: 120 * time.Second}

	payload := map[string]any{
		"model": model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"stream": false,
		"options": map[string]any{
			"temperature": 0.4,
			"num_predict": 900,
		},
	}

	reqBody, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("error marshalling request: %w", err)
	}

	req, err := http.NewRequest("POST", ollamaURL+"/api/chat", bytes.NewReader(reqBody))
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("ollama unavailable — is `ollama serve` running? %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("ollama error %d: %s", resp.StatusCode, string(body))
	}

	type ollamaResponse struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	}

	var parsed ollamaResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("error parsing response: %w", err)
	}
	if parsed.Message.Content == "" {
		return "", fmt.Errorf("empty response from Ollama")
	}

	return parsed.Message.Content, nil
}

// GetValuesFromJobDescription extracts company values from a job description.
func GetValuesFromJobDescription(jobDescription string) (string, error) {
	prompt := fmt.Sprintf(`Extract company values from the following job description.
By "company values" I mean: ethos, culture, philosophy about the workplace — not perks or job-specific requirements.
If you cannot find company values, respond only with: COMPANY VALUES NOT FOUND
If you find values, respond with a simple HTML list. Start with <ul>. Each value should be a <li> with a 1-2 word label in <b> tags, followed by a colon and a short description.
Do not include any text outside the HTML.

Job Description:
%s`, jobDescription)

	return callLLM(prompt)
}

// FindValuesFromWebsite calls the Python scraper service to extract raw values from a company website.
func FindValuesFromWebsite(companyName, websiteUrl string) (string, []string, error) {
	scraperURL := os.Getenv("SCRAPER_URL")
	if scraperURL == "" {
		scraperURL = "http://localhost:8085"
	}
	scraperURL += "/get-company-values"

	reqData := map[string]string{
		"company_name":        companyName,
		"company_website_url": websiteUrl,
	}

	reqBody, err := json.Marshal(reqData)
	if err != nil {
		return "", nil, err
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(scraperURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return "", nil, fmt.Errorf("scraper unavailable: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}

	type scraperResponse struct {
		RawCompanyValues string   `json:"raw_company_values"`
		SearchedLinks    []string `json:"searched_links"`
	}

	var scraperResp scraperResponse
	if err := json.Unmarshal(body, &scraperResp); err != nil {
		return "", nil, err
	}

	return scraperResp.RawCompanyValues, scraperResp.SearchedLinks, nil
}

// RefineValuesFromScraper cleans up raw scraped text into a formatted HTML values list.
func RefineValuesFromScraper(rawCompanyValues string) (string, error) {
	prompt := fmt.Sprintf(`The following text was scraped from a company website and may contain irrelevant content mixed with company values, ethos, and culture statements.
Extract only the company values from it.
If you cannot find any company values, respond only with: COMPANY VALUES NOT FOUND
If you find values, respond with a simple HTML list. Start with <ul>. Each value should be a <li> with a 1-2 word label in <b> tags, followed by a colon and a short description.
Do not include any text outside the HTML.

Scraped text:
%s`, rawCompanyValues)

	return callLLM(prompt)
}
