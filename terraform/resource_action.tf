 resource "genesyscloud_integration_action" "function_action" {
  name                   = "Function Action"
  category               = "Function Data Actions"
  integration_id         = data.genesyscloud_integration.integration.id
  config_timeout_seconds = 20

  contract_input = jsonencode({
    type                 = "object"
    additionalProperties = true
    properties = {
      dossier = { type = "string" },
      secret = { type = "string" }
    }
  })

  contract_output = jsonencode({
    type                 = "object"
    additionalProperties = true
    properties = {
      result = { type = "string" }
    }
  })

  config_request {
    request_type     = "POST"
    request_template = "$${input.rawRequest}"
  }

  config_response {
    translation_map = {
      result = "$.body"
    }
    translation_map_defaults = {
      result = "-1"
    }
    success_template = "{ \"result\": $${result}}"
  }

  function_config {
    description     = "Function action"
    handler         = "dist/src/handler.handler"
    runtime         = "nodejs22.x"
    timeout_seconds = 15
    file_path       = "function.zip"
  }
}
