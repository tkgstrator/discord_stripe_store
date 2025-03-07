.PHONY: pull_request
pull_request:
	act --secret-file .secrets pull_request --container-architecture=linux/amd64

.PHONY: deploy
deploy:
	act --env .env --eventpath .github/pull_request.closed.develop.json -j deploy
