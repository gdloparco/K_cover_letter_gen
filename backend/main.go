// package main

// import (
// 	"github.com/gin-gonic/gin"
// 	"cl-generator/initialisers"
// )

// func init() {
// 	initialisers.LoadEnvVariables()
// 	initialisers.ConnectToDB()
// }

// func main() {
// 	r := gin.Default()
// 	r.GET("/", func(c *gin.Context) {
// 		c.JSON(200, gin.H{
// 			"message": "pong",
// 		})
// 	})
// 	r.Run() // listen and serve on 0.0.0.0:8080
// }

package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"cl-generator/src/env"
	"cl-generator/src/models"
	"cl-generator/src/routes"
)

func main() {
	env.LoadEnv()

	app := setupApp()

	models.OpenDatabaseConnection()
	models.AutoMigrateModels()

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
