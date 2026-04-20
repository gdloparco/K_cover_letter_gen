package models

type CoverLetterResponse struct {
	CompanyName     string   `json:"company_name"`
	ApplicantName   string   `json:"applicant_name"`
	ApplicantRole   string   `json:"applicant_role"`
	CoverLetterText string   `json:"cover_letter_text"`
	// Debug / insight fields — empty string / nil if nothing was found
	JobDescriptionValues string   `json:"job_description_values,omitempty"`
	WebsiteValues        string   `json:"website_values,omitempty"`
	SearchedLinks        []string `json:"searched_links,omitempty"`
}
