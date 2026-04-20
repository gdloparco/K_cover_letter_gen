package controllers

import (
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"cl-generator/src/services"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GenerateCoverLetter(ctx *gin.Context) {
	companyWebsite := ctx.PostForm("company_website_url")
	companyName := ctx.PostForm("company_name")
	jobDescription := ctx.PostForm("job_description")

	if companyWebsite == "" || jobDescription == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "company_website_url and job_description are required"})
		return
	}

	fileHeader, err := ctx.FormFile("resume")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "resume file is required: " + err.Error()})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	// Resume extraction and website scraping run in parallel.
	// LLM calls run sequentially inside AssembleCoverLetter.
	type scraperResult struct {
		values        string
		searchedLinks []string
		err           error
	}
	type resumeResult struct {
		text string
		err  error
	}

	scraperCh := make(chan scraperResult, 1)
	resumeCh := make(chan resumeResult, 1)

	go func() {
		name := services.CompanyNameFromURL(companyWebsite)
		val, links, err := services.FindValuesFromWebsite(name, companyWebsite)
		scraperCh <- scraperResult{values: val, searchedLinks: links, err: err}
	}()

	go func() {
		text, err := services.ExtractResumeText(fileBytes, fileHeader.Filename)
		resumeCh <- resumeResult{text: text, err: err}
	}()

	scraperRes := <-scraperCh
	resumeRes := <-resumeCh

	if resumeRes.err != nil {
		errors.SendInternalError(ctx, resumeRes.err)
		return
	}

	websiteValues := ""
	var searchedLinks []string
	if scraperRes.err == nil {
		websiteValues = scraperRes.values
		searchedLinks = scraperRes.searchedLinks
	}

	coverLetter, err := services.AssembleCoverLetter(services.CoverLetterRequest{
		ResumeText:     resumeRes.text,
		JobDescription: jobDescription,
		WebsiteValues:  websiteValues,
		CompanyWebsite: companyWebsite,
		CompanyName:    companyName,
	})
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	// Use the user-provided company name as authoritative fallback
	resolvedCompany := coverLetter.CompanyName
	if resolvedCompany == "" {
		resolvedCompany = companyName
	}

	ctx.JSON(http.StatusOK, gin.H{
		"cover_letter": models.CoverLetterResponse{
			CompanyName:          resolvedCompany,
			ApplicantName:        coverLetter.ApplicantName,
			ApplicantRole:        coverLetter.ApplicantRole,
			CoverLetterText:      coverLetter.CoverLetterText,
			JobDescriptionValues: jobDescription,
			WebsiteValues:        websiteValues,
			SearchedLinks:        searchedLinks,
		},
	})
}
