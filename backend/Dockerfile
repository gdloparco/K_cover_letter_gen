FROM golang:1.22.5-alpine3.20 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o kate-backend .

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/kate-backend .
EXPOSE 8082
CMD ["./kate-backend"]
