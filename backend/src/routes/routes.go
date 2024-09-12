package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(engine *gin.Engine) {
	apiRouter := engine.Group("/")
	setupBulletpointRoutes(apiRouter)
	setupFrontendFormDataRoutes(apiRouter)
	// setupAuthenticationRoutes(apiRouter)
}
