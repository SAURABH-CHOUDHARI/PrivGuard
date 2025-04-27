# Final minimal Dockerfile

FROM alpine:3.18

# Install CA certs and timezone info
RUN apk --no-cache add ca-certificates tzdata

# Set working directory inside container
WORKDIR /app

# Copy the prebuilt binary into the container
COPY app .

# Expose your app port
EXPOSE 8080

# Run the app when the container starts
CMD ["./app"]
