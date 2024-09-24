package services

import (
	"bytes"
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GetValuesFromJobDescription will extract Company Values from the Job Description using a OpenAI API
func GetValuesFromJobDescription(apiKey, jobDescription string) (string, error) {
	client := &http.Client{Timeout: 10 * time.Second}

	// Create the prompt for the OpenAI API request
	prompt := fmt.Sprintf("I'd like to extract company values from the following Job Description if present. With 'company values' I mean: ethos, culture, philosophy about the workplace, not perks and details about the job position. If you cannot find company values, just respond with a simple 'JOB VALUES NOT FOUND' in capital letters. If, on the other hand, you can find values in the job description, I'd like your output to be a simple HTML format. Start the HTML with a <ul>. I'd like the values to be bulletpoints <li> with a one or two word description of the value in bold (use <b> tag), followed by a colon, then followed by the value description. Here's the Job Description: %s.", jobDescription)

	payload := map[string]interface{}{
		"model":       "gpt-4o-mini",
		"messages":    []map[string]string{{"role": "user", "content": prompt}},
		"temperature": 0.4,
		"max_tokens":  1500,
	}

	// Convert the payload to a JSON request Body
	reqBody, err := json.Marshal(payload)
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error marshalling JSON: %v", err))
	}

	// Create a new POST request to the OpenAI API
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewReader(reqBody))
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error creating request: %v", err))
	}

	// Set the necessary headers for the request
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the request to the OpenAI API
	resp, err := client.Do(req)
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error sending request: %v", err))
	}

	// The HTTP specification expects that clients will close response bodies when they are done reading them.
	// Network connections and response bodies consume system resources. If not closed, these resources remain allocated,
	// causing the application to fail to make new requests.
	defer resp.Body.Close()

	// Define the structure for the response
	type Response struct {
		Choices []struct {
			Message struct {
				RefinedJobDescriptionValues string `json:"content"`
			} `json:"message"`
			FinishReason string `json:"finish_reason"`
		} `json:"choices"`
	}

	var response Response

	// The NewDecoder.Decode method will parse the incoming JSON and convert it into a Go struct (response)
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}

	RefinedJobDescriptionValues := response.Choices[0].Message.RefinedJobDescriptionValues

	// // Substitution string to use
	// // refinedCompanyValues = strings.ReplaceAll(refinedCompanyValues, "]", "")

	return RefinedJobDescriptionValues, nil
}

func FindValuesFromWebsite(companyName, websiteUrl string) (string, []string, error) {

	// This one calls the Python Scraper Container with its name (localhost doesn't work)
	scraperURL := "http://python_scraper:8085/get-company-values"

	// Create a map to hold the request data
	reqData := map[string]string{
		"company_name":        companyName,
		"company_website_url": websiteUrl,
	}

	// Convert the map to JSON
	reqBody, err := json.Marshal(reqData)

	if err != nil {
		return "", nil, err
	}

	// Create a new POST request
	resp, err := http.Post(scraperURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}

	// Unmarshal the response body into a ScraperResponse struct
	var scraperResp models.PythonScraperResponse
	if err := json.Unmarshal(body, &scraperResp); err != nil {
		return "", nil, err
	}

	// Return the extracted values and searched links
	return scraperResp.RawCompanyValues, scraperResp.SearchedLinks, nil
}

func RefineValuesFromScraper(apiKey, rawCompanyValues string) (string, error) {
	client := &http.Client{Timeout: 10 * time.Second}

	// Create the prompt for the OpenAI API request
	prompt := fmt.Sprintf("Assume the text provided has been obtained by web scraping a company website for information about the company values, ethos and philosophy. I'd like to extract company values from the text, which might include also irrelevant information. I'd like your output to be a simple HTML format. Start the HTML with a <ul>. I'd like the values to be bulletpoints <li> with a one or two word description of the value in bold (use <b> tag), followed by a colon, then followed by the value description. Here's the text: %s. If you cannot find company values, just respond with a simple 'NOT FOUND' in capital letters.", rawCompanyValues)

	payload := map[string]interface{}{
		"model":       "gpt-4o-mini",
		"messages":    []map[string]string{{"role": "user", "content": prompt}},
		"temperature": 0.4,
		"max_tokens":  1500,
	}

	// Convert the payload to a JSON request Body
	reqBody, err := json.Marshal(payload)
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error marshalling JSON: %v", err))
	}

	// Create a new POST request to the OpenAI API
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewReader(reqBody))
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error creating request: %v", err))
	}

	// Set the necessary headers for the request
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the request to the OpenAI API
	resp, err := client.Do(req)
	if err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error sending request: %v", err))
	}

	// The HTTP specification expects that clients will close response bodies when they are done reading them.
	// Network connections and response bodies consume system resources. If not closed, these resources remain allocated,
	// causing the application to fail to make new requests.
	defer resp.Body.Close()

	// Define the structure for the response
	type Response struct {
		Choices []struct {
			Message struct {
				RefinedCompanyValues string `json:"content"`
			} `json:"message"`
			FinishReason string `json:"finish_reason"`
		} `json:"choices"`
	}

	var response Response

	// The NewDecoder.Decode method will parse the incoming JSON and convert it into a Go struct (response)
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}

	refinedCompanyValues := response.Choices[0].Message.RefinedCompanyValues

	// // Substitution string to use
	// // refinedCompanyValues = strings.ReplaceAll(refinedCompanyValues, "]", "")

	return refinedCompanyValues, nil
}
