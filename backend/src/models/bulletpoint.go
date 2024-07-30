package models

import (
	"gorm.io/gorm"
)

type Bulletpoint struct {
	gorm.Model
	Bulletpoint     string `json:"bulletpoint"`
	Tag   			string `json:"tag"`
	Category   		string `json:"category"`
}

// The Save() function creates a new bulletpoint record in the database
func (bulletpoint *Bulletpoint) Save() (*Bulletpoint, error) {

	err := Database.Create(bulletpoint).Error

	if err != nil {
		return &Bulletpoint{}, err
	}

	return bulletpoint, nil
}

// FindAllBulletpoints() finds and returns all bulletpoints records in the database
func FindAllBulletpoints() (*[]Bulletpoint, error) {
	var bulletpoints []Bulletpoint

	err := Database.Find(&bulletpoints).Error

	if err != nil {
		return &[]Bulletpoint{}, err
	}

	return &bulletpoints, nil
}

// FindBulletpointByTag(tag) finds and returns all bulletpoints records in the database where the tag matches the parameter
func FindBulletpointByTag(tag string) (*[]Bulletpoint, error) {
	var bulletpoints []Bulletpoint

	err := Database.Where("tag = ?", tag).Find(&bulletpoints).Error

	if err != nil {
		return &[]Bulletpoint{}, err
	}

	return &bulletpoints, nil
}


// FindBulletpointByCategory(category) finds and returns all bulletpoints records in the database where the category matches the parameter
func FindBulletpointByCategory(category string) (*[]Bulletpoint, error) {
	var bulletpoints []Bulletpoint

	err := Database.Where("category = ?", category).Find(&bulletpoints).Error

	if err != nil {
		return &[]Bulletpoint{}, err
	}

	return &bulletpoints, nil
}

func FindSuperhookByTag(tag string) (*Bulletpoint, error) {
	var bulletpoint Bulletpoint

	err := Database.Where("category = ? AND tag = ?", "Superhook", tag).First(&bulletpoint).Error

	if err != nil {
		return &Bulletpoint{}, err
	}

	return &bulletpoint, nil
}
