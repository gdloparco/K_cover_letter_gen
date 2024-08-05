package main

import (
	"cl-generator/src/env"
	"cl-generator/src/models"
	"cl-generator/src/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	env.LoadEnv()

	app := setupApp()

	models.OpenDatabaseConnection()
	models.AutoMigrateModels()

	// TESTER BELOW
	app.GET("/tester", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "all fine here",
		})
	})
	// TESTER ABOVE

	app.Run(":8082")

}

func setupApp() *gin.Engine {
	app := gin.Default()
	setupCORS(app)
	routes.SetupRoutes(app)
	return app
}

func setupCORS(app *gin.Engine) {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"}

	app.Use(cors.New(config))
}
