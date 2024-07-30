package routes

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/controllers"
)

func setupBulletpointRoutes(baseRouter *gin.RouterGroup) {
	bulletpoints := baseRouter.Group("/bulletpoints")

	bulletpoints.POST("", controllers.CreateBulletpoint)
	bulletpoints.GET("", controllers.GetAllBulletpoints)
	bulletpoints.GET("/tag/:tag", controllers.GetBulletpointsByTag)
	bulletpoints.GET("/category/:category", controllers.GetBulletpointsByCategory)
	bulletpoints.GET("/superhook/:tag", controllers.GetSuperhookByTag)
	bulletpoints.GET("/superhooks", controllers.GetAllSuperhooks)

}
