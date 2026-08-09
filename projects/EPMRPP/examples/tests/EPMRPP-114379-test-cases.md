# Test cases: EPMRPP-114379 — [WS][UI][QA] Org. settings. Plugins integrations page (Email Server)

**User story:** https://jiraeu.epam.com/browse/EPMRPP-114379

---

## Organization Settings. Email Server. General page details

*Preconditions:*
1. Email Server plugin is installed and enabled on the instance.
2. At least one Email Server global integration exists
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER or MEMBER


*Steps:*
1. Navigate to Organization settings > Integrations
2. Click 'Email Server'
3. Click "Integrations" in the breadcrumb

*Expected results:*

1. The Integrations page opens with the list of available plugins, 'Email Server' is present on the list with 'Reinforce your ReportPortal instance with Email Server integration. Be informed about test result finish in real time and easily configure list of recipients.' description
2. 'Email Server' page opens with:
 * breadcrumbs 'Integrations > Email Server'
 * Email Server icon in the header
 * plugin description text: 'Reinforce your ReportPortal instance with Email Server integration. Be informed about test result finish in real time and easily configure list of recipients. Link to Documentation', duplicating description from above

3. 'Integrations' tab is opened again in 'Organization Settings'

---

## Organization Settings. Email Server. Integration page layout with no integrations as Administrator/Manager

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. No Email Server global integrations exist.
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.

*Expected results:*

1. 'Email Server' page opens with:
 * 'No integrations configured yet' empty state
 ** 'All integrations that are configured for the Organization will be automatically applied to every project within it' text label
 ** "Create Organizational integration" button

---

## Organization Settings. Email Server. Integration page layout with only global integration as Administrator/Manager

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. 2. At least one Email Server global integration exists.
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.

*Expected results:*

1. 'Email Server' page opens with:
 * 'Organization integrations' empty block
 ** 'Default integrations are applicable across all projects within the organization unless project-specific configurations have been defined.' text label underneath the block name
 ** 'Integration is not configured yet' text label in the block
 ** "+ Create Integration" button in the block
 * 'Global integrations' block
 ** 'Created at the instance level and applied to all projects unless organizational or project-specific configurations are set.' text label underneath the block name
 ** Global integration tile with its name, creator and date
 ** "ACTIVE"/"CONNECTION ERROR"/"INACTIVE" label for the integration, based on the connection to the integration

---

## Organization Settings. Email Server. Deleted creator is shown as 'deleted_user' for global integration

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. At least one Email Server global integration exists, originally created by a user who has since been removed from the system.
3. User is logged in as ADMINISTRATOR.

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.
2. Locate the global integration tile whose creator was deleted.
3. Observe the tile

*Expected results:*

1. 'Email Server' page is opened
2. -
3. 'deleted_user' is shown on the integration tile instead of the original username.

---

## Organization Settings. Email Server. Only Email Server integrations are displayed — other types are filtered out

*Preconditions:*
1. The instance has global integrations of multiple types (e.g., Email Server and at least one other plugin such as Jira or Slack).
2. User is logged in as ADMINISTRATOR.

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.
2. Observe 'Global integrations' section.

*Expected results:*

1. 'Email Server' page is opened
2. Only Email Server integrations are listed; integrations of other types (e.g., Jira, Slack) are *not* shown.

---

## Organization Settings. Email Server. Integration page layout with no integrations as Member

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. No Email Server global integrations exist.
3. Organization_1 exists
4. User is logged in as USER, who is assigned to organization as MEMBER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.

*Expected results:*

1. 'Email Server' page opens with:
 * 'No integrations configured yet' empty state
 ** 'All integrations that are configured for the Organization will be automatically applied to every project within it' text label

---

## Organization Settings. Email Server. Integration page layout with only global integration as Member

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. 2. At least one Email Server global integration exists.
3. Organization_1 exists
4. User is logged in as USER, who is assigned to organization as MEMBER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.

*Expected results:*

1. 'Email Server' page opens with:
* 'Organization' empty block
** 'Default integrations are applicable across all projects within the organization unless project-specific configurations have been defined.' text label underneath the block name
** 'Integration is not configured yet' text label in the block
* 'Global integrations' empty block
** 'Created at the instance level and applied to all projects unless organizational or project-specific configurations are set.' text label underneath the block name
** Global integration tile with its name, creator and date
** "ACTIVE"/"CONNECTION ERROR"/"INACTIVE" label for the integration, based on the connection to the integration

---

## GA. Instance level. Organization Settings. GA is sent on opening 'Email Server' Integrations

*Preconditions:*
1. Email Server plugin is installed and enabled on the instance.
2. At least one Email Server global integration exists
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER or MEMBER
5. Analytics is ON in Server Settings
6. Browser Dev tools are opened


*Steps:*
1. Navigate to Organization settings > Integrations
2. Click 'Email Server'
3. Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

1. The Integrations page opens with the list of available plugins.
2. 'Email Server' page opens
3. The collect request contains the following data:
* instanceID
* version
* uid
* timestamp
* organization_id
* place: organization_settings_integrations_email_server

---

## GA. Instance level. Organization Settings.  GA is not sent on opening 'Email Server' Integrations if Analytics = OFF

*Preconditions:*
1. Email Server plugin is installed and enabled on the instance.
2. At least one Email Server global integration exists
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER or MEMBER
5. Analytics is OFF in Server Settings
6. Browser Dev tools are opened


*Steps:*
1. Navigate to Organization settings > Integrations
2. Click 'Email Server'
3. Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

1. The Integrations page opens with the list of available plugins.
2. 'Email Server' page opens
3. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools

---

## Organization Settings. Email Server. "Active" label on a global Email Server integration

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. At least one Email Server global integration exists and is correctly configured
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.
2. Observe Global Integration tile.

*Expected results:*

1. 'Email Server' page is opened
2. For the Global integration 'ACTIVE' green badge is shown next to the integration name

---

## Organization Settings. Email Server. "Connection Error" label on a global Email Server integration

*Preconditions:*
1. Email Server plugin is enabled on the instance.
2. At least one Email Server global integration exists and is configured incorrectly (e.g., created with valid values, but then is edited via DB to have an additional character in one of the fields)
3. Organization_1 exists
4. User is logged in as ADMINISTRATOR or USER, but assigned to organization as MANAGER

*Steps:*
1. Navigate to Organization settings > Integrations > Email Server.
2. Observe Global Integration tile.

*Expected results:*

1. 'Email Server' page is opened
2. 'CONNECTION ERROR' red badge with warning icon is shown next to the integration name

---

## API. organization-integrations controller. Retrieve organization integrations list as Administrator (leaving additional parameters empty)

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>

3. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains integrations list, e.g.:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": 0,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

---

## API. organization-integrations controller. Pagination during retrieving organization integrations list

*Preconditions:*
# Organization is created on the instance.
# At least 20 Organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>
* limit = 5
* offset = 1

3. Click "Execute".
4. Change offset = 3 and execute the request again

*Expected results:*

3. The response code is *200*; response body contains 1st 5/20 integrations, e.g.:
{code:java}
{
  "offset": 1,
  "limit": 5,
  "total_count": 20,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

4. The response code is *200*; response body contains 3rd 5/20 integrations in the same format

---

## API. organization-integrations controller. Ordering during retrieving organization integrations list

*Preconditions:*
# Organization is created on the instance.
# At least 20 Organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>
* limit = 100
* offset = 1
* order = ASC

3. Click "Execute".
4. Change order = DESC and execute the request again

*Expected results:*

3. The response code is *200*; response body contains integrations ordered in ascending order, e.g.:
{code:java}
{
  "offset": 1,
  "limit": 100,
  "total_count": 20,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

4. The response code is *200*; response body contains the same integrations in the same format, but ordered in descending order

---

## API. organization-integrations controller. 400 error on using org_id = non-integer when retrieving organization integrations

*Preconditions:*
# Organization 'abc' exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = abc
3. Send the request.

*Expected results:*

3. The response code is *400*; response body contains an error message indicating 'org_id' must be a valid integer.

---

## API. organization-integrations controller. 400 error on using org_id = float when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = 1.5
3. Send the request.

*Expected results:*

3. The response code is *400*; response body contains an error message indicating 'org_id' must be a valid integer.

---

## API. organization-integrations controller. 400 error on using org_id = negative integer when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = -1
3. Send the request.

*Expected results:*

3. The response code is *400*; response body contains an error message indicating 'org_id' must be a valid positive integer or 0.

---

## API. organization-integrations controller. 404 error on using org_id = special characters when retrieving organization integrations

*Preconditions:*
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = !%*
3. Send the request.

*Expected results:*

3. The response code is *404*; response body contains an error message about such end-point not existing

---

## API. organization-integrations controller. 400 error on using limit = non-integer when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": 0,
  "limit": "abc",
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'limit' parameter must be a valid integer.

---

## API. organization-integrations controller. 401 error on using empty auth token when retrieving organization integrations

*Preconditions:*
# Organization 'abc' exists on the instance
# Postman environment is configured with the correct base URL

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. Set empty value for bearer token in authorization
4. Send the request.

*Expected results:*

4. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. organization-integrations controller. 403 error on retrieving organization integrations as non-assigned non-admin user

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# USER User is not assigned to the organization
# User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>

3. Click "Execute".

*Expected results:*

3. The response code is *403*; response body contains an error message indicating the user is not allowed to access this organization's data.

---

## API. organization-integrations controller. 404 error on using non-existent org_id when retrieving organization integrations

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <non-existent_org_id>

3. Click "Execute".

*Expected results:*

3. The response code is *404*; response body contains an error message indicating the organization was not found

---

## API. organization-integrations controller. Retrieve organization integrations list as Administrator (specifying additional parameters)

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>
* limit = 100
* offset = 1
* order = DESC

3. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains integrations list, e.g.:
{code:java}
{
  "offset": 1,
  "limit": 100,
  "total_count": 0,
  "sort": "string",
  "order": "DESC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

---

## API. organization-integrations controller. Retrieve organization integrations list as Manager

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# USER User is assigned to the organization as MANAGER
# User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>

3. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains integrations list, e.g.:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": 0,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

---

## API. organization-integrations controller. Retrieve organization integrations list as Member

*Preconditions:*
# Organization is created on the instance.
# Organization integrations of any plugins exist for the organization from above
# USER User is assigned to the organization as MEMBER
# User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>

3. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains integrations list, e.g.:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": 0,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": 0,
      "name": "string",
      "enabled": true,
      "creator": "string",
      "integration_type": {
        "name": "string",
        "type": "string",
        "enabled": true,
        "auth_flow": "OAUTH",
        "plugin_type": "string",
        "group_type": "string",
        "details": {},
        "created_at": "2019-08-24T14:15:22Z"
      },
      "parameters": {},
      "connection_status": {
        "status": "CONNECTED",
        "message": "string",
        "checked_at": "2019-08-24T14:15:22Z"
      },
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
{code}

---

## API. organization-integrations controller. 400 error on using offset = non-integer when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": "abc",
  "limit": 100,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'offset' parameter must be a valid integer.

---

## API. organization-integrations controller. 400 error on using limit = negative integer when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": 0,
  "limit": -100,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'limit' parameter must be a valid positive integer.

---

## API. organization-integrations controller. 400 error on using limit = float when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": 0,
  "limit": 10.5,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'limit' parameter must be a valid integer.

---

## API. organization-integrations controller. 400 error on using limit = special characters when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": 0,
  "limit": "@#$",
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'limit' parameter must be a valid integer.

---

## API. organization-integrations controller. 400 error on using offset = float when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": 1.5,
  "limit": 100,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'offset' parameter must be a valid integer.

---

## API. organization-integrations controller. 400 error on using offset = negative integer when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": -1,
  "limit": 100,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'offset' parameter must be a valid positive integer or 0.

---

## API. organization-integrations controller. 400 error on using offset = special characters when retrieving organization integrations

*Preconditions:*
# Organization_1 exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. In body set following:
{code:java}
{"offset": "%^&*",
  "limit": 100,
  "order": "ASC"}
{code}
4. Send the request.

*Expected results:*

4. The response code is *400*; response body contains an error indicating the 'offset' parameter must be a valid integer.

---

## API. organization-integrations controller. 401 error on using non-existent auth token when retrieving organization integrations

*Preconditions:*
# Organization 'abc' exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. Set non-existing value for bearer token in authorization
4. Send the request.

*Expected results:*

4. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. organization-integrations controller. 401 error on using revoked auth token when retrieving organization integrations

*Preconditions:*
# Organization 'abc' exists on the instance
# ADMINISTRATOR User has a valid API token generated and noted
# Token from above is revoked
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /organizations/\{org_id}/integrations request
2. Set org_id = <org_id>
3. Set revoked from above value for bearer token in authorization
4. Send the request.

*Expected results:*

4. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. Integrations controller. 401 error on using empty auth token when retrieving global integrations

*Preconditions:*
# Postman environment is configured with the correct base URL

*Steps:*
1. In Postman, create GET /v1/integration/global/all request
2. Set empty value for bearer token in authorization
3. Send the request.

*Expected results:*

3. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. Integrations controller. 401 error on using non-existent auth token when retrieving global integrations

*Preconditions:*
# ADMINISTRATOR User has a valid API token generated and noted
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /v1/integration/global/all request
2. Set non-existing value for bearer token in authorization
3. Send the request.

*Expected results:*

3. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. organization-integrations controller. 401 error on using revoked auth token when retrieving global integrations

*Preconditions:*
# ADMINISTRATOR User has a valid API token generated and noted
# Token from above is revoked
# Postman environment is configured with the correct base URL and token from above

*Steps:*
1. In Postman, create GET /v1/integration/global/all request
2. Set revoked from above value for bearer token in authorization
3. Send the request.

*Expected results:*

4. The response code is *401*; response body contains an error indicating the user is not authenticated.

---

## API. Integrations controller. 403 error on retrieving global integrations as non-assigned non-admin user

*Preconditions:*
# USER User is logged in and is on 'API Documentation' page

*Steps:*
1. Open Integrations controller > GET /v1/integration/global/all
2. Click "Execute".

*Expected results:*

3. The response code is *403*; response body contains an error message indicating the user is not allowed to access this data.

---

## API. Integrations controller. Retrieve global integrations list as Administrator

*Preconditions:*
# Global integrations for any plugins exist
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open Integrations controller > GET /v1/integration/global/all
2. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains integrations list, e.g.:
{code:java}
[
  {
    "id": 0,
    "projectId": 0,
    "organizationId": 0,
    "name": "string",
    "integrationType": {
      "type": 0,
      "name": "string",
      "enabled": true,
      "authFlow": "OAUTH",
      "creationDate": "2026-05-21T07:29:52.650Z",
      "pluginType": "string",
      "groupType": "string",
      "details": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      }
    },
    "integrationParameters": {
      "additionalProp1": {},
      "additionalProp2": {},
      "additionalProp3": {}
    },
    "enabled": true,
    "creator": "string",
    "creationDate": "2026-05-21T07:29:52.650Z"
  }
]
{code}

---

## API. Integrations controller. Retrieve empty global integrations list as Administrator

*Preconditions:*
# No global integrations exist
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open Integrations controller > GET /v1/integration/global/all
2. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains empty integrations list, e.g.:
{code:java}
[ ]
{code}

---

## API. organization-integrations controller. Retrieve empty organization integrations list

*Preconditions:*
# Organization is created on the instance.
# No organization integrations of any plugins exist for the organization from above
# ADMINISTRATOR User is logged in and is on 'API Documentation' page

*Steps:*
1. Open organization-integrations controller > GET /organizations/\{org_id}/integrations
2. Enter following details:
* org_id = <org_id>

3. Click "Execute".

*Expected results:*

1. The response code is *200*; response body contains empty integrations list, e.g.:
{code:java}
{
}
{code}

---

