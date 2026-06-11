# Test cases: EPMRPP-91805 — [Testing only][WS][QA] Implement users end-point for organization controller

**User story:** https://jiraeu.epam.com/browse/EPMRPP-91805

---

## API. Organization User Controller. Admin gets a list of users of the organization with assignment to this organization

*Preconditions:*

# 'Organization A' is created
# Admin is assigned to 'Organization A'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Information about all users of 'Organization A' is displayed
 * Code: 200
 * Response example:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": <number>,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": <id>,
      "uuid": <uuid>,
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z",
      "last_login_at": "2019-08-24T14:15:22Z",
      "email": "user@example.com",
      "full_name": "string",
      "instance_role": "USER",
      "account_type": "INTERNAL",
      "external_id": "string",
      "active": true,
      "_links": {
        "self": {
          "href": "/users/1"
        },
        "profile_picture": {
          "href": "/files/214213423",
          "type": "image/png",
          "title": "User's profile picture"
        },
        "profile_picture_thumbnail": {
          "href": "/files/214213423-mini",
          "type": "image/png",
          "title": "User's profile picture thumbnail"
        }
      },
      "org_role": "MEMBER",
      "assigned_at": "2019-08-24T14:15:22Z",
      "stats": {
        "project_stats": {
          "total_count": 0
        }
      }
    }
  ]
} 
{code}

---

## API. Organization User Controller. Admin gets a list of users of the organization without assignment to this organization

*Preconditions:*

# 'Organization A' is created
# Admin is *NOT* assigned to 'Organization A'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Information about all users of 'Organization A' is displayed
 * Code: 200
 * Response example:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": <number>,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": <id>,
      "uuid": <uuid>,
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z",
      "last_login_at": "2019-08-24T14:15:22Z",
      "email": "user@example.com",
      "full_name": "string",
      "instance_role": "USER",
      "account_type": "INTERNAL",
      "external_id": "string",
      "active": true,
      "_links": {
        "self": {
          "href": "/users/1"
        },
        "profile_picture": {
          "href": "/files/214213423",
          "type": "image/png",
          "title": "User's profile picture"
        },
        "profile_picture_thumbnail": {
          "href": "/files/214213423-mini",
          "type": "image/png",
          "title": "User's profile picture thumbnail"
        }
      },
      "org_role": "MEMBER",
      "assigned_at": "2019-08-24T14:15:22Z",
      "stats": {
        "project_stats": {
          "total_count": 0
        }
      }
    }
  ]
} 
{code}

---

## API. Organization User Controller. Member cannot get a list of users of the organization with assignment to this organization

*Preconditions:*

# 'Organization A' is created
# Member is assigned to 'Organization A'
# Member is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 403
* "You do not have enough permissions. Access is denied" message

---

## API. Organization User Controller. Manager gets a list of users of the organization with assignment to this organization

*Preconditions:*

# 'Organization A' is created
# Manager is assigned to 'Organization A'
# Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Information about all users of 'Organization A' is displayed
 * Code: 200
 * Response example:
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": <number>,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": <id>,
      "uuid": <uuid>,
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z",
      "last_login_at": "2019-08-24T14:15:22Z",
      "email": "user@example.com",
      "full_name": "string",
      "instance_role": "USER",
      "account_type": "INTERNAL",
      "external_id": "string",
      "active": true,
      "_links": {
        "self": {
          "href": "/users/1"
        },
        "profile_picture": {
          "href": "/files/214213423",
          "type": "image/png",
          "title": "User's profile picture"
        },
        "profile_picture_thumbnail": {
          "href": "/files/214213423-mini",
          "type": "image/png",
          "title": "User's profile picture thumbnail"
        }
      },
      "org_role": "MEMBER",
      "assigned_at": "2019-08-24T14:15:22Z",
      "stats": {
        "project_stats": {
          "total_count": 0
        }
      }
    }
  ]
} 
{code}

---

## API. Organization User Controller. User (not Admin) cannot get a list of users of the organization without assignment to this organization

*Preconditions:*

# 'Organization A' is created
# User (not Admin) is *NOT* assigned to 'Organization A'
# User (not Admin) is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 403
* "You do not have enough permissions." message

---

## API. Organization User Controller. Admin gets an empty array of organization users when there are no assigned users in the organization

*Preconditions:*

# 'Organization A' is created
# Admin is *NOT* assigned to 'Organization A'
# There are no assigned users in 'Organization A'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Information about all users of 'Organization A' is displayed
 * Code: 200
 * Empty array

---

## API. Organization User Controller. Impossible to get a list of users of the organization without organization ID

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'

*Steps:*

# Send the request via Postman GET/organizations//users
# Verify the response

*Expected results:*

1. Request is sent 
2. The response contains: 
* Code: 500
* "Internal Server Error" message

---

## API. Organization User Controller. Impossible to get a list of users of the organization with invalid organization ID

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'

*Steps:*

# Send the request via Postman GET/organizations/hello/users
# Verify the response

*Expected results:*

1. Request is sent 
2. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. Organization User Controller. Impossible to get a list of users of the organization with non-existent organization

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill *non-existent* Organization ID in the 'org_id' field
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 404
* "Organization '<id>' not found. Did you use correct Organization ID?" message

---

## API. Organization User Controller. Impossible to get a list of users of the organization when authentication token doesn't exist

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Admin/Manager doesn't have a token

*Steps:*

# For the request in Postman fill the field 'Token', in Authorization tab, with non-existent token
# Send the request via Postman GET/organizations/{org_id}/users
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. Organization User Controller. Impossible to get a list of users of the organization when authentication token is invalid

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Admin/Manager has a token

*Steps:*

# Login to RP -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the field 'Token', in Authorization tab, with revoked token
# Send the request via Postman GET/organizations/{org_id}/users
# Verify the response

*Expected results:*

4. Request is sent 
5. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. Organization User Controller. Default parameter values

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Click the 'Try it out' button and verify the default parameter values

*Expected results:*

2. The parameters with default values are displayed:
full_name: empty
limit: 300
offset: 0
order: ASC
sort: full_name

---

## API. Organization User Controller. Sorting users of the organization by default parameters

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# 300+ users are assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains a list with data about 300 users of the organization sorted by name in ASC order:
** 'User A'
** 'User B'
** 'User C'
** etc.

---

## API. Organization User Controller. Sorting users of the organization by name in DESC order

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Several users are assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request with *order: DESC*
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains a list with data about users of the organization sorted by name in DESC order:
** 'User C'
** 'User B'
** 'User A'
** etc.

---

## API. Organization User Controller. Get list of users of the organization with limit parameter >300

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# 300+ users are assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request with *limit: 301*
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains a list with data about *301* users

---

## API. Organization User Controller. Get list of users of the organization with limit parameter <300

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Several users are assigned to 'Organization A'
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request with *limit: 1*
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains data about only 1 user

---

## API. Organization User Controller. Get a list of organizations with non-default offset parameter

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Several users are assigned to 'Organization A' (e.g. 'User A', 'User B', 'User C')
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request with *limit: 1* and *offset: 1*
# Verify the response

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains data about the second user - the second page of users limited to 1 user per page sorted by name is displayed (e.g. 'User B')

---

## API. Organization User Controller. Impossible to sort users of the organization by different parameter except name

*Preconditions:*

# 'Organization A' is created
# Admin/Manager is assigned to 'Organization A'
# Several users are assigned to 'Organization A' with different roles
# Admin/Manager is on the API Documentation page

*Steps:*

# Navigate to Organizations User Controller -->  GET/organizations/{org_id}/users
# Fill 'org_id' with an ID of 'Organization A'
# Send request with *sort: org_role*
# Verify the response

*Repeat test case with different sort parameters (e.g. email, instance_role, etc.)*

*Expected results:*

3. Request is sent 
4. Response contains:
 * Code: 200
 * The response contains a list with data about users of the organization sorted *by name* in ASC order regardless of Organization role

---

