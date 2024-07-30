package routes

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/controllers"
)

func setupBulletpointRoutes(baseRouter *gin.RouterGroup) {
	bulletpoints := baseRouter.Group("/bulletpoints")

	bulletpoints.POST("", controllers.CreateBulletpoint)
	bulletpoints.GET("/:tag", controllers.GetBulletpointByTag)
	bulletpoints.GET("/:category", controllers.GetBulletpointByCategory)

}
