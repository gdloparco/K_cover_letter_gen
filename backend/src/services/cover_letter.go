package services

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strings"
)

type Bulletpoint struct {
	Theme    string   `json:"theme"`
	Category string   `json:"category"`
	Tags     []string `json:"tags"`
	Text     string   `json:"text"`
}

type BulletpointsFile struct {
	Bulletpoints []Bulletpoint `json:"bulletpoints"`
}

// CoverLetterResult is returned by AssembleCoverLetter.
type CoverLetterResult struct {
	ApplicantName        string
	ApplicantRole        string
	CompanyName          string
	CoverLetterText      string
	// Insight data surfaced from the pipeline — may be empty
	JobDescriptionValues string
	WebsiteValues        string
	SearchedLinks        []string
}

// CoverLetterRequest holds all inputs for cover letter assembly.
type CoverLetterRequest struct {
	ResumeText     string
	JobDescription string
	WebsiteValues  string
	CompanyWebsite string
	CompanyName    string // provided by user; used as authoritative company name
}

// resumeProfile is extracted from the CV in a dedicated LLM call.
type resumeProfile struct {
	ApplicantName string
	Skills        string
	Experience    string
}

// jobProfile is extracted from the JD + website in a dedicated LLM call.
type jobProfile struct {
	CompanyName string
	RoleTitle   string
	LookingFor  string
}

// CompanyNameFromURL extracts a best-guess company name from a URL.
// e.g. "https://www.acme.com/careers" → "acme"
// Used as a fallback label for the scraper; the LLM extracts the real name.
func CompanyNameFromURL(websiteURL string) string {
	parsed, err := url.Parse(websiteURL)
	if err != nil {
		return ""
	}
	host := parsed.Hostname()
	// Strip www. prefix
	host = strings.TrimPrefix(host, "www.")
	// Take just the domain name without TLD
	parts := strings.Split(host, ".")
	if len(parts) > 0 {
		return parts[0]
	}
	return host
}

func loadBulletpoints() ([]Bulletpoint, error) {
	path := os.Getenv("BULLETPOINTS_PATH")
	if path == "" {
		path = "/data/bulletpoints.json"
	}

	data, err := os.ReadFile(path)
	if err != nil {
		data, err = os.ReadFile("../data/bulletpoints.json")
		if err != nil {
			return nil, fmt.Errorf("could not read bulletpoints.json: %w", err)
		}
	}

	var file BulletpointsFile
	if err := json.Unmarshal(data, &file); err != nil {
		return nil, fmt.Errorf("could not parse bulletpoints.json: %w", err)
	}
	return file.Bulletpoints, nil
}

func formatBulletpointsForPrompt(bps []Bulletpoint) string {
	var sb strings.Builder
	for _, bp := range bps {
		sb.WriteString(fmt.Sprintf("[%s | %s] %s\n\n", bp.Theme, bp.Category, bp.Text))
	}
	return sb.String()
}

func truncate(s string, maxChars int) string {
	if len(s) <= maxChars {
		return s
	}
	return s[:maxChars] + "..."
}

// AssembleCoverLetter runs three sequential LLM calls:
//  1. Extract applicant profile from resume only
//  2. Extract company/role profile from JD + website only
//  3. Write the cover letter using both profiles + paragraph library
func AssembleCoverLetter(req CoverLetterRequest) (CoverLetterResult, error) {
	bulletpoints, err := loadBulletpoints()
	if err != nil {
		return CoverLetterResult{}, err
	}

	// ── Call 1: Resume analysis ──
	rp, err := analyseResume(req.ResumeText)
	if err != nil {
		return CoverLetterResult{}, fmt.Errorf("resume analysis: %w", err)
	}

	// ── Call 2: Company / JD analysis ──
	jp, err := analyseJob(req.JobDescription, req.WebsiteValues, req.CompanyWebsite, req.CompanyName)
	if err != nil {
		return CoverLetterResult{}, fmt.Errorf("job analysis: %w", err)
	}

	// ── Call 3: Assemble the letter ──
	bpBlock := formatBulletpointsForPrompt(bulletpoints)

	assemblePrompt := fmt.Sprintf(`You are a professional cover letter writer. Your job is to write a cover letter on behalf of the applicant described below.
You are writing AS the applicant — every word is in their voice, from their perspective. Never write from the company's perspective.

APPLICANT PROFILE (extracted from their CV):
Name: %s
Skills: %s
Experience summary: %s

ROLE THEY ARE APPLYING FOR:
Company: %s
Job Title: %s
What the company is looking for: %s

PARAGRAPH LIBRARY:
Each entry is [Theme | Category] followed by a paragraph.
- Superhook: references a specific company value — replace <Company Value> with a real value from the job profile, and <Company Name> with the company name above.
- General: standalone value statement written by the applicant.
- Background: references the applicant's past experience.

%s

INSTRUCTIONS:
1. Write a professional cover letter in the applicant's voice (first person, "I").
2. Structure:
   - Para 1: introduce the applicant by name, state the role, express genuine excitement about the company
   - Para 2-3: choose the best-matching Superhook block + one General or Background block; replace all placeholders; make them flow naturally into each other
   - Para 4: highlight 2-3 specific technical skills or achievements from the applicant's CV — do NOT use library blocks here, write fresh sentences
   - Para 5: closing — thank the reader, express availability for interview, sign off professionally
3. Plain text only. No markdown, no bullet points, no headers inside the letter.
4. Aim for approximately 400 words.
5. Do not invent any facts not present in the applicant profile above.

OUTPUT FORMAT — your entire response must be exactly this structure, no preamble, no explanation, no markdown fences:
APPLICANT_NAME: %s
APPLICANT_ROLE: %s
COMPANY_NAME: %s
COVER_LETTER:
<the full cover letter text, plain paragraphs separated by blank lines>`,
		rp.ApplicantName, rp.Skills, rp.Experience,
		jp.CompanyName, jp.RoleTitle, jp.LookingFor,
		bpBlock,
		rp.ApplicantName, jp.RoleTitle, jp.CompanyName,
	)

	raw, err := callLLM(assemblePrompt)
	if err != nil {
		return CoverLetterResult{}, fmt.Errorf("letter assembly: %w", err)
	}

	return parseLLMOutput(raw), nil
}

// analyseResume extracts the applicant profile from the CV text only.
func analyseResume(resumeText string) (resumeProfile, error) {
	text := truncate(resumeText, 2000)

	prompt := fmt.Sprintf(`You are reading a CV/resume. Extract the following information about the applicant.
Focus only on what is written in the CV — do not infer or invent anything.

CV TEXT:
%s

OUTPUT FORMAT — respond with exactly this structure, no preamble, no markdown:
NAME: <applicant's full name>
SKILLS: <comma-separated list of technical and professional skills mentioned>
EXPERIENCE: <2-4 sentence summary of their career background, roles held, and key achievements>`,
		text,
	)

	raw, err := callLLM(prompt)
	if err != nil {
		return resumeProfile{}, err
	}

	var rp resumeProfile
	for _, line := range strings.Split(raw, "\n") {
		line = strings.TrimSpace(line)
		if val, ok := extractField(line, "NAME:"); ok {
			rp.ApplicantName = val
		} else if val, ok := extractField(line, "SKILLS:"); ok {
			rp.Skills = val
		} else if val, ok := extractField(line, "EXPERIENCE:"); ok {
			rp.Experience = val
		}
	}
	// If EXPERIENCE was multi-line, grab everything after the EXPERIENCE: line
	if rp.Experience == "" {
		lines := strings.Split(raw, "\n")
		inExp := false
		var expLines []string
		for _, l := range lines {
			if inExp {
				expLines = append(expLines, strings.TrimSpace(l))
				continue
			}
			if _, ok := extractField(strings.TrimSpace(l), "EXPERIENCE:"); ok {
				inExp = true
				if val, _ := extractField(strings.TrimSpace(l), "EXPERIENCE:"); val != "" {
					expLines = append(expLines, val)
				}
			}
		}
		rp.Experience = strings.TrimSpace(strings.Join(expLines, " "))
	}
	return rp, nil
}

// analyseJob extracts the company and role profile from the job description and website text.
func analyseJob(jobDescription, websiteValues, websiteURL, userProvidedCompanyName string) (jobProfile, error) {
	websiteText := truncate(websiteValues, 800)

	prompt := fmt.Sprintf(`You are reading a job description and company website text. Extract the following.
Focus only on what the company is looking for — ignore any mention of people's names or bios.

JOB DESCRIPTION:
%s

COMPANY WEBSITE TEXT (may contain values, culture, mission):
%s

COMPANY WEBSITE URL: %s
USER-PROVIDED COMPANY NAME (use this if present, otherwise extract from JD): %s

OUTPUT FORMAT — respond with exactly this structure, no preamble, no markdown:
COMPANY_NAME: <company name>
ROLE_TITLE: <exact job title from the job description>
LOOKING_FOR: <2-3 sentences describing what skills, experience and qualities the company is seeking>`,
		jobDescription, websiteText, websiteURL, userProvidedCompanyName,
	)

	raw, err := callLLM(prompt)
	if err != nil {
		return jobProfile{}, err
	}

	var jp jobProfile
	for _, line := range strings.Split(raw, "\n") {
		line = strings.TrimSpace(line)
		if val, ok := extractField(line, "COMPANY_NAME:"); ok {
			jp.CompanyName = val
		} else if val, ok := extractField(line, "ROLE_TITLE:"); ok {
			jp.RoleTitle = val
		} else if val, ok := extractField(line, "LOOKING_FOR:"); ok {
			jp.LookingFor = val
		}
	}
	// Fallback: use user-provided company name if LLM missed it
	if jp.CompanyName == "" && userProvidedCompanyName != "" {
		jp.CompanyName = userProvidedCompanyName
	}
	return jp, nil
}

// parseLLMOutput extracts the structured fields from the LLM response.
// Handles common LLM quirks: markdown fences, preamble text, extra whitespace,
// and bold markers (**field**) that some models add.
func parseLLMOutput(raw string) CoverLetterResult {
	result := CoverLetterResult{}

	// Strip markdown code fences the model sometimes wraps output in
	cleaned := raw
	cleaned = strings.TrimPrefix(cleaned, "```markdown")
	cleaned = strings.TrimPrefix(cleaned, "```")
	cleaned = strings.TrimSuffix(cleaned, "```")
	cleaned = strings.TrimSpace(cleaned)

	lines := strings.Split(cleaned, "\n")
	var letterLines []string
	inLetter := false

	for _, line := range lines {
		if inLetter {
			letterLines = append(letterLines, line)
			continue
		}
		// Strip bold markers some models emit: **APPLICANT_NAME:** value
		trimmed := strings.TrimSpace(line)
		trimmed = strings.TrimPrefix(trimmed, "**")
		trimmed = strings.TrimSuffix(trimmed, "**")

		if val, ok := extractField(trimmed, "APPLICANT_NAME:"); ok {
			result.ApplicantName = val
		} else if val, ok := extractField(trimmed, "APPLICANT_ROLE:"); ok {
			result.ApplicantRole = val
		} else if val, ok := extractField(trimmed, "COMPANY_NAME:"); ok {
			result.CompanyName = val
		} else if strings.HasPrefix(trimmed, "COVER_LETTER:") {
			inLetter = true
			// Anything after "COVER_LETTER:" on the same line is part of the letter
			after := strings.TrimSpace(strings.TrimPrefix(trimmed, "COVER_LETTER:"))
			if after != "" {
				letterLines = append(letterLines, after)
			}
		}
	}

	result.CoverLetterText = strings.TrimSpace(strings.Join(letterLines, "\n"))

	// Fallback: if we got no letter body, use the whole cleaned output
	if result.CoverLetterText == "" {
		result.CoverLetterText = cleaned
	}

	return result
}

// extractField checks if line has the given prefix (case-insensitive) and returns the value.
func extractField(line, prefix string) (string, bool) {
	upper := strings.ToUpper(line)
	upperPrefix := strings.ToUpper(prefix)
	if strings.HasPrefix(upper, upperPrefix) {
		val := strings.TrimSpace(line[len(prefix):])
		// Strip surrounding quotes or angle brackets the model sometimes adds
		val = strings.Trim(val, `"'<>`)
		if val != "" {
			return val, true
		}
	}
	return "", false
}
