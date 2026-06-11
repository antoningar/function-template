# Genesys Cloud prerequesites
To be executed, this terraform project need an oath with the following persmissions :
- integrations:actionFunction:edit
- integrations:actionFunction:view
- integrations:action:edit
- integrations:action:view
- integrations:action:add
- integrations:action:delete
- integrations:integration:view
- bridge:actions:view

Terraform credentials need to be set as env variable with GENESYSCLOUD_REGION, GENESYSCLOUD_OAUTHCLIENT_ID and GENESYSCLOUD_OAUTHCLIENT_SECRET.

# Terraform state management
State is managed in HCP Terraform through Terraform CLI.  
