package services

import (
	"bytes"
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// GetValuesFromJobDescription will extract Company Values from the Job Description using a OpenAI API
func GetValuesFromJobDescription(apiKey string, jobDescription string) (string, error) {

	fmt.Println(apiKey)

	jobDescriptionValues := jobDescription + "modified, showing only values"

	return jobDescriptionValues, nil
}

func FindValuesFromWebsite(companyName, websiteUrl string) (string, []string, error) {

	// This one calls the Python Scraper Container with its name (localhost doesn't work)
	scraperURL := "http://python_scraper:8085/get-company-values"

	// Create a map to hold the request data
	reqData := map[string]string{
		"company_name":        companyName,
		"company_website_url": websiteUrl,
	}

	fmt.Println(reqData)

	// Convert the map to JSON
	reqBody, err := json.Marshal(reqData)
	fmt.Println(reqBody)
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
	client := &http.Client{}

	// Create the prompt for the OpenAI API request
	prompt := fmt.Sprintf("I'd like to extract company values from the following text. I'd like your output to be a simple HTML format so that I can then directly include it in a <div>, you don't need to put it into a div, just start with a <ul>. I'd like the values to be bulletpoints with a one or two word description of the value in bold (use <b> tag), followed by a colon, then followed by the value description. Don't include sources. %s", rawCompanyValues)
	payload := fmt.Sprintf(`{"model": "gpt-3.5-turbo-instruct", "prompt": "%s", "max_tokens": 1000}`, prompt)

	// Create a new POST request to the OpenAI API
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/completions", strings.NewReader(payload))
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

	// Read the response body
	var responseBody strings.Builder
	if _, err := io.Copy(&responseBody, resp.Body); err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error reading response body: %v", err))
	}

	// Define the structure for the response
	type Response struct {
		RefinedCompanyValues string `json:"refined_company_values"`
	}

	var response Response
	// After an instance of Response is created, unmarshal the responseBody into the instance.
	// Unmarshalling takes JSON-encoded data (a []byte slice) and decodes it into a Go data structure, such as a struct, map, slice, or array.
	if err := json.Unmarshal([]byte(responseBody.String()), &response); err != nil {
		errors.SendInternalError(nil, fmt.Errorf("error unmarshaling response: %v", err))

	}
	//Removing square brackets as the prompt doesnt always eliminate them
	refinedCompanyValues := strings.ReplaceAll(response.RefinedCompanyValues, "[", "")
	refinedCompanyValues = strings.ReplaceAll(refinedCompanyValues, "]", "")

	return refinedCompanyValues, nil
}
