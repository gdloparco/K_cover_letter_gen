package routes

import (
	"github.com/gin-gonic/gin"
	"cl-generator/src/controllers"
)

func setupUserRoutes(baseRouter *gin.RouterGroup) {
	users := baseRouter.Group("/users")

	users.POST("", controllers.CreateUser)
	users.GET("", controllers.GetUser)
}
