# Reference: https://www.terraform.io/docs/providers/google/r/sql_database_instance.html

resource "google_sql_database_instance" "master" {
  name             = "main-sql-instance"
  database_version = "POSTGRES_12"
  region           = "asia-southeast1" # Singapore
  
  # @todo To support replica/HA configs
  # @todo Specify starting disk size
  
  settings {
    # Second-generation instance tiers are based on the machine type. See argument reference below.
    # @todo Change machine type, make sure it is supported by postgres
    tier = "db-f1-micro"

    # @todo Change to allow 0.0.0.0/0
    # @todo Enforce secure connections only
    ip_configuration {

      # @todo To change this
      dynamic "authorized_networks" {
        for_each = google_compute_instance.apps
        iterator = apps

        content {
          name  = apps.value.name
          value = apps.value.network_interface.0.access_config.0.nat_ip
        }
      }
  }
}