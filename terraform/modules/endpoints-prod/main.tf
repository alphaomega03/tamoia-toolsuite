##############################################################################
#  Cloud Endpoints
##############################################################################

locals {
  endpoints_host = "api-${var.suffix}.endpoints.${var.project_id}.cloud.goog"
}

# Create/update endpoints configuration based on OpenAPI
resource "google_endpoints_service" "api" {
  project = var.project_id
  service_name = local.endpoints_host
  openapi_config = templatefile("openapi-v2.json", {
    project_id = var.project_id
    endpoints_host = local.endpoints_host
  })
}

# resource "google_project_service" "artifact_registry" {
#   project = var.project_id
#   service                    = "artifactregistry.googleapis.com"
#   disable_on_destroy         = false
#   disable_dependent_services = false
# }

# resource "google_artifact_registry_repository" "nodejs-containers" {
#   project = var.project_id
#   provider      = google-beta
#   location      = var.region
#   repository_id = "nodejs-containers"
#   format        = "DOCKER"
#   depends_on    = [google_project_service.artifact_registry]
# }

# Enable service
resource "google_project_service" "api-project-service" {
  service = google_endpoints_service.api.service_name
  project = var.project_id
  depends_on = [google_endpoints_service.api]
}


# Create/update Cloud Run service
resource "google_cloud_run_service" "endpoints-cloud-run" {
  name     = "endpoints-${var.suffix}"
  location = var.region
  project = var.project_id
  traffic {
    percent         = 100
    latest_revision = true
  }
    # https://github.com/Lioric/go-cloud/blob/0a3580612654e801b29df8d786d64f53da227867/samples/guestbook/gcp/main.tf
  autogenerate_revision_name = true
  # https://github.com/hashicorp/terraform-provider-google/issues/9438#issuecomment-871946786
  # https://us-central1-docker.pkg.dev/master-plateau-347914/node-js-containers
  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/${var.project_id}/nodejs-containers/basic-express-container:latest"
        env {
          name  = "ENDPOINTS_SERVICE_NAME"
          value = local.endpoints_host
        }
        ports {
          container_port = 8080
        }
      }
    }
  }
  depends_on = [google_endpoints_service.api]
}

# Create public access
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Enable public access on endpoints service
resource "google_cloud_run_service_iam_policy" "noauth-endpoints" {
  location    = google_cloud_run_service.endpoints-cloud-run.location
  project     = google_cloud_run_service.endpoints-cloud-run.project
  service     = google_cloud_run_service.endpoints-cloud-run.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
