package controllers

import (
	"cl-generator/src/errors"
	"cl-generator/src/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type bulletpointRequestBody struct {
	Bulletpoint string
	Tag         string
	Category    string
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

	newBulletpoint := models.Bulletpoint{
		Bulletpoint: requestBody.Bulletpoint,
		Tag:         requestBody.Tag,
		Category:    requestBody.Category,
	}

	_, err = newBulletpoint.Save()
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Bulletpoint created", "Bulletpoint": newBulletpoint.Bulletpoint})
}

func GetAllBulletpoints(ctx *gin.Context) {

	bulletpoint, err := models.FindAllBulletpoints()
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}

func GetBulletpointsByTag(ctx *gin.Context) {
	tag := ctx.Param("tag")

	bulletpoint, err := models.FindBulletpointByTag(tag)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}

func GetBulletpointsByCategory(ctx *gin.Context) {
	category := ctx.Param("category")

	bulletpoint, err := models.FindBulletpointByCategory(category)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}

func GetSuperhookByTag(ctx *gin.Context) {
	tag := ctx.Param("tag")

	bulletpoint, err := models.FindSuperhookByTag(tag)
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"bulletpoint": bulletpoint})
}

func GetAllSuperhooks(ctx *gin.Context) {

	superhooks, err := models.FindAllSuperhooks()
	if err != nil {
		errors.SendInternalError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"superhooks": superhooks})
}
