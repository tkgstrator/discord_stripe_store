FROM hashicorp/terraform:latest AS build
FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

COPY --from=build /bin/terraform /usr/local/bin/terraform