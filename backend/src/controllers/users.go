package controllers

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/models"
	"net/http"
)


func CreateUser(ctx *gin.Context) {
	var newUser models.User // Creates a variable called newUser with the User struct type User{gorm.Model(id,...), email, password}

	newUser = models.User{
		// Update user fields with file information
		Bulletpoint:    ctx.PostForm("bulletpoint"),
		Tags: ctx.PostForm("tags"),
		Category: ctx.PostForm("category"),
	}

	_, err := newUser.Save() // Adds newUser to database

	if err != nil {
		SendInternalError(ctx, err)
		return
	}


	ctx.JSON(http.StatusCreated, gin.H{"message": "OK", "newUser": newUser}) //sends confirmation message back if successfully saved
}

// func GetUser(ctx *gin.Context) {
// 	// userID := ctx.Param("id") // This is to check response in postman

// 	// The below two lines of code are to extract userID from token when that functionality becomes possible
// 	// val, _ := ctx.Get("userID")
// 	// userID := val.(string)
// 	userIDToken, exists := ctx.Get("userID")
// 	if !exists {
// 		ctx.JSON(http.StatusUnauthorized, gin.H{"ERROR": "USER ID NOT FOUND IN CONTEXT"})
// 		return
// 	}

// 	userIDString := userIDToken.(string)

// 	loggedUserID := strconv.Itoa(int([]byte(userIDString)[0]))

// 	token, _ := auth.GenerateToken(loggedUserID)
// 	user, err := models.FindUser(loggedUserID)
// 	if err != nil {
// 		SendInternalError(ctx, err)
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, gin.H{"user": user, "token": token, "loggedUserID": loggedUserID})
// }
