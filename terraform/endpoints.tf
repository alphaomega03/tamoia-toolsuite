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
  openapi_config = templatefile("openapi.json", {
    project_id = var.project_id
    endpoints_host = local.endpoints_host
  })
}

# Enable service
resource "google_project_service" "api-project-service" {
  service = google_endpoints_service.api.service_name
  project = var.project_id
  depends_on = [google_endpoints_service.api]
}


# Create/update Cloud Run service
resource "google_cloud_run_service" "endpoints-cloud-run" {
  name     = "endpoints-${var.suffix}"
  location = "us-east1"
  project = var.project_id
  traffic {
    percent         = 100
    latest_revision = true
  }
    # https://github.com/Lioric/go-cloud/blob/0a3580612654e801b29df8d786d64f53da227867/samples/guestbook/gcp/main.tf
  autogenerate_revision_name = true
  # https://github.com/hashicorp/terraform-provider-google/issues/9438#issuecomment-871946786
  
  template {
    spec {
      containers {
        image = "us-east1-docker.pkg.dev/tamoia-toolsuite-prototype/nodejs-containers/basic-express-container:latest"
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
