package controllers

import (
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"cl-generator/src/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type companyFormDataRequestBody struct {
	CompanyName    string `json:"company_name"`
	CompanyWebsite string `json:"company_website_url"`
	JobDescription string `json:"job_description"`
}

func ProcessCompanyData(ctx *gin.Context) {
	var requestBody companyFormDataRequestBody

	if err := ctx.BindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	jobDescriptionValues, err := services.GetValuesFromJobDescription(requestBody.JobDescription)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	scrapedWebsiteValues, searchedLinks, err := services.FindValuesFromWebsite(requestBody.CompanyName, requestBody.CompanyWebsite)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	refinedWebsiteValues, err := services.RefineValuesFromScraper(scrapedWebsiteValues)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	processedData := models.ProcessedCompanyData{
		CompanyName:          requestBody.CompanyName,
		CompanyWebsite:       requestBody.CompanyWebsite,
		JobDescription:       requestBody.JobDescription,
		JobDescriptionValues: jobDescriptionValues,
		WebsiteValues:        refinedWebsiteValues,
		SearchedLinks:        searchedLinks,
	}

	ctx.JSON(http.StatusOK, gin.H{"company_data": processedData})
}
