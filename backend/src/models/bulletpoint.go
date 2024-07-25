package models

import (
	"gorm.io/gorm"
)

type Bulletpoint struct {
	gorm.Model        // gorm.Model creates the following common fields automatically; ID (unit / gorm:"primaryKey"), CreatedAt (time.Time), UpdatedAt(time.Time), DeletedAt (gorm.DeletedAt / gorm:"index")
	Bulletpoint      string `json:"bulletpoint"`
	Tags   string `json:"tags"`
	Category   string `json:"category"`
}

// This function creates a new record in the database
func (bulletpoint *Bulletpoint) Save() (*Bulletpoint, error) {
	// existingUser, err := FindUserByEmail(user.Email)
	// if existingUser != nil {
	// 	return &User{}, err
	// }

	err := Database.Create(bulletpoint).Error
	if err != nil {
		return &Bulletpoint{}, err
	}

	return bulletpoint, nil
}

// // FindUser(id) finds and returns the first record in the database where the id matches the id given
// func FindUser(id string) (*User, error) {
// 	var user User
// 	err := Database.Where("id = ?", id).First(&user).Error

// 	if err != nil {
// 		return &User{}, err
// 	}

// 	return &user, nil
// }

// // FindUserByEmail(email) finds and returns the first record in the database where the email matches the email given
// func FindUserByEmail(email string) (*User, error) {
// 	var user User
// 	err := Database.Where("email = ?", email).First(&user).Error

// 	if err != nil && err == gorm.ErrRecordNotFound {
// 		return nil, nil
// 	}

// 	if err != nil {
// 		return nil, err
// 	}

// 	return &user, nil
// }


