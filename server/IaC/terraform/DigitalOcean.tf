// reference: https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet_snapshot
resource "digitalocean_database_db" "database-example" {
  cluster_id = digitalocean_database_cluster.postgres-example.id
  name       = "foobar"
}

resource "digitalocean_database_cluster" "postgres-example" {
  name       = "example-postgres-cluster"
  engine     = "pg"
  version    = "11"
  size       = "db-s-1vcpu-1gb"
  region     = "nyc1"
  node_count = 1
}