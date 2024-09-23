package controllers

import (
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"cl-generator/src/services"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type companyFormDataRequestBody struct {
	CompanyName    string `json:"company_name"`
	CompanyWebsite string `json:"company_website_url"`
	JobDescription string `json:"job_description"`
}

func ProcessCompanyData(ctx *gin.Context) {
	var requestBody companyFormDataRequestBody

	err := ctx.BindJSON(&requestBody)
	// ctx.BindJSON reads the JSON payload from the request body it parses the JSON payload
	// and attempts to match the JSON fields with the fields in the requestBody struct
	// if the JSON payload has a field named "CompanyName" it assigns the corresponding
	// value to the CompanyName field of the requestBody

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}

	fmt.Println("requestBody STARTS")
	fmt.Println("")
	fmt.Println(requestBody)
	fmt.Println("")
	fmt.Println("requestBody ENDS")

	// Here I should use the details in the request body to process (through services) scraping and LLM operations.
	// The model below should then include the information gathered back (Values) to send to the Frontend.
	apiKey := os.Getenv("API_KEY")

	jobDescriptionValues, err := services.GetValuesFromJobDescription(apiKey, requestBody.JobDescription)

	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	scrapedWebsiteValues, searchedLinks, err := services.FindValuesFromWebsite(requestBody.CompanyName, requestBody.CompanyWebsite)

	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	// refinedWebsiteValues, err := services.RefineValuesFromScraper(apiKey, scrapedWebsiteValues)

	// if err != nil {
	// 	errors.SendInternalError(ctx, err)
	// 	return
	// }

	ProcessedCompanyData := models.ProcessedCompanyData{
		// Below username is now hard-coded. With a log-in system it will be coming from Auth.
		Username:             "Dom Loparco",
		CompanyName:          requestBody.CompanyName,
		CompanyWebsite:       requestBody.CompanyWebsite,
		JobDescription:       requestBody.JobDescription,
		JobDescriptionValues: jobDescriptionValues,
		// WebsiteValues:        refinedWebsiteValues,
		WebsiteValues: scrapedWebsiteValues,
		SearchedLinks: searchedLinks,
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Company Data Processed", "company_data": ProcessedCompanyData})
}
