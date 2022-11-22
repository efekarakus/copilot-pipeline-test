FROM golang:1.18.2 as builder

RUN mkdir /svc
ADD . /svc

# We specify that we now wish to execute any further commands inside the /svc directory.
WORKDIR /svc

# Build the binary
ENV GOPROXY=direct
RUN go build -o serve ./cmd/server

# Target used by our compose file, we have to port wait-for-postgres.sh so that the containers come up in the proper order.
FROM builder as local
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=10s --start-period=30s \
    CMD curl -f http://localhost:8080/_healthcheck || exit 1
CMD ["./serve"]

# For the real image, we'll only copy the binaryso that the image size is small.
FROM builder
COPY --from=builder /svc/serve /
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=10s --start-period=30s \
    CMD curl -f http://localhost:8080/_healthcheck || exit 1
ENTRYPOINT ["/serve"]