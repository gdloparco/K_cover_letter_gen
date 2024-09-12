package models

import (
	"gorm.io/gorm"
)

type CompanyFormData struct {
	gorm.Model
	Username             string `json:"username"`
	CompanyName          string `json:"company_name"`
	CompanyWebsite       string `json:"company_website"`
	JobDescription       string `json:"job_description"`
	JobDescriptionValues string `json:"job_description_values"`
	WebsiteValues        string `json:"website_values"`
}
