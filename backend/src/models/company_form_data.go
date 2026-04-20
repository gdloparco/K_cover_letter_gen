package models

type ProcessedCompanyData struct {
	CompanyName          string   `json:"company_name"`
	CompanyWebsite       string   `json:"company_website_url"`
	JobDescription       string   `json:"job_description"`
	JobDescriptionValues string   `json:"job_description_values"`
	WebsiteValues        string   `json:"website_values"`
	SearchedLinks        []string `json:"searched_links"`
}

type PythonScraperResponse struct {
	CompanyName      string   `json:"company_name"`
	CompanyWebsite   string   `json:"company_website_url"`
	RawCompanyValues string   `json:"raw_company_values"`
	SearchedLinks    []string `json:"searched_links"`
}
