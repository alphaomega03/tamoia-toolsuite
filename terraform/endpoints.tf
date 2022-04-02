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
  location = var.region
  project = var.project_id
  template {
    spec {
      containers {
        image = "gcr.io/endpoints-release/endpoints-runtime-serverless:2"
        env {
          name  = "ENDPOINTS_SERVICE_NAME"
          value = local.endpoints_host
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
