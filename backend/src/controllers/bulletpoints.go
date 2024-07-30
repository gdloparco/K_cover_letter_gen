package controllers

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/models"
	"net/http"
)

type bulletpointRequestBody struct {
	Bulletpoint string
	Tag 		string
	Category 	string
}

func CreateBulletpoint(ctx *gin.Context) {
	var requestBody bulletpointRequestBody

	err := ctx.BindJSON(&requestBody)
	// ctx.BindJSON reads the JSON payload from the request body it parses the JSON payload
	// and attempts to match the JSON fields with the fields in the requestBody struct
	// if the JSON payload has a field named "bulletpoint" it assigns the corresponding
	// value to the Bulletpoint field of the requestBody

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}

	if len(requestBody.Bulletpoint) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Bulletpoint field empty"})
		return
	}

	if len(requestBody.Tag) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Tags field empty"})
		return
	}

	if len(requestBody.Category) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Category field empty"})
		return
	}

	newBulletpoint := models.Bulletpoint{
		Bulletpoint: 	requestBody.Bulletpoint,
		Tag:   			requestBody.Tag,
		Category: 		requestBody.Category,
	}

	_, err = newBulletpoint.Save()
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Bulletpoint created", "Bulletpoint": newBulletpoint.Bulletpoint})
}

func GetBulletpointByTag(ctx *gin.Context) {
	tag := ctx.Param("tag")

	bulletpoint, err := models.FindBulletpointByTag(tag)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}


func GetBulletpointByCategory(ctx *gin.Context) {
	category := ctx.Param("category")

	bulletpoint, err := models.FindBulletpointByCategory(category)
	if err != nil {
		SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}