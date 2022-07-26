FROM public.ecr.aws/docker/library/golang:1.17-alpine

WORKDIR /job
COPY go.* ./
COPY *.go ./

RUN go build -o bin
CMD ["/job/bin"]
