package controllers

import (
	"cl-generator/src/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type companyFormDataRequestBody struct {
	CompanyName    string `json:"company_name"`
	CompanyWebsite string `json:"company_website"`
	JobDescription string `json:"job_description"`
}

func LogCompanyFormData(ctx *gin.Context) {
	var requestBody companyFormDataRequestBody

	err := ctx.BindJSON(&requestBody)
	// ctx.BindJSON reads the JSON payload from the request body it parses the JSON payload
	// and attempts to match the JSON fields with the fields in the requestBody struct
	// if the JSON payload has a field named "bulletpoint" it assigns the corresponding
	// value to the Bulletpoint field of the requestBody

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}

	// Here I should use the details in the request body to process (through services) LLM operations.
	// The model below should then include the information gathered back (Values) to send to the Frontend.

	newCompanyFormData := models.CompanyFormData{
		Username:             "Dom Loparco",
		CompanyName:          requestBody.CompanyName,
		CompanyWebsite:       requestBody.CompanyWebsite,
		JobDescription:       requestBody.JobDescription,
		JobDescriptionValues: "Values Text 1",
		WebsiteValues:        "Values Text 2",
	}

	fmt.Print("INFO BELOW")
	fmt.Print(newCompanyFormData)
}
