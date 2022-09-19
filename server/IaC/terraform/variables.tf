// configurations

// project id
variable "project" { 
    default=""
}

// service account key file
variable "credentials_file" { 
    default="./CloudSQLkey.json"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}