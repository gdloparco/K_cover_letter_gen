package routes

import (
	"cl-generator/src/controllers"

	"github.com/gin-gonic/gin"
)

func setupFrontendFormDataRoutes(baseRouter *gin.RouterGroup) {
	frontendFormData := baseRouter.Group("/formdata")

	frontendFormData.POST("/company", controllers.ProcessCompanyData)
}
