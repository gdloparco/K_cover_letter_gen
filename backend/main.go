package main

import (
	"github.com/gin-gonic/gin"
	"cl-generator/initialisers"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
