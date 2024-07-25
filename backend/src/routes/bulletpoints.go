package routes

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/controllers"
)

func setupBulletpointRoutes(baseRouter *gin.RouterGroup) {
	bulletpoints := baseRouter.Group("/bulletpoints")

	bulletpoints.POST("", controllers.CreateUser)
	// bulletpoints.GET("", controllers.GetUser)
}
