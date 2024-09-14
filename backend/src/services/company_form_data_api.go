package services

import "fmt"

// import (
// 	"cl-generator/src/errors"
// )

// GetValuesFromJobDescription will extract Company Values from the Job Description using a OpenAI API
func GetValuesFromJobDescription(apiKey string, jobDescription string) (string, error) {

	fmt.Println(apiKey)

	jobDescriptionValues := jobDescription + "modified, showing only values"

	return jobDescriptionValues, nil
}
