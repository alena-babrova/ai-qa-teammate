# Test cases: EPMRPP-104599 — [WS][QA] Add new operations to change project user role

**User story:** https://jiraeu.epam.com/browse/EPMRPP-104599

---

## API. Project Controller. Impossible to update project user role with non-existent project ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Send the request as Admin via Postman PATCH/organizations/{org_id}/projects/<non-existent_project_id>
with body 
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Verify the response

*Expected results:*

2. The response contains: 
* Code: 400
* "Project '<project_id>' not found. Did you use correct project ID?" message

---

## API. Project Controller. Impossible to update project user role with empty project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": ""
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
{
  "errorCode": 4001,
  "message": "Incorrect Request. Invalid field 'value'"
}

---

## API. Project Controller. Default project role is assigned when updating project user role without specifying project role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The user has *VIEWER* project role

---

## API. Project Controller. Possible to update project user role from VIEWER to EDITOR

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'VIEWER' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "/users",     
"value": [{
  "id": <user_id>,
  "project_role": "EDITOR"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The user has *EDITOR* project role

---

## API. Project Controller. Impossible to update project user role without user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
{
  "errorCode": 4046,
  "message": "User 'null' not found."
}

---

## API. Project Controller. Impossible to update project user role with invalid user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": "hello",
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Bad Request" message

---

## API. Project Controller. Impossible to update project user role with non-existent user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": "<non-existent_user_id>",
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 404
* "User is not found" message

---

## API. Project Controller. Manager's project role is not changed when trying to update his project user role from EDITOR to VIEWER

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MANAGER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The user project role is *not* updated, the user has *EDITOR* project role

---

## API. Project Controller. Impossible to update project user role with invalid project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "hello"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
{
  "errorCode": 4001,
  "message": "Incorrect Request. Invalid field 'value'"
}

---

## API. Project Controller. Admin that is assigned to the project can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin is assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Admin that is assigned to the organization and not assigned to the project can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin is assigned to 'Organization A', but *not* assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Admin that is not assigned to the organization can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin is *not* assigned to 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Admin can not update his own project role

*Steps:*

{*}Preconditions{*}:
 # 'Organization A' is created
 # 'ProjectA' is created in the 'Organization A'
 # Admin has 'MEMBER' organization role at 'Organization A'
 # Admin has 'EDITOR' project role at 'ProjectA'
 # Admin is on the API Documentation page

{*}Steps{*}:
 # Navigate to Organization-Projects Controller -> PATCH/organizations/ \{org_id}/projects/
{project_id}
 # Fill Organization ID in the 'org_id' field
 # Fill Project ID in the 'project_id' field
 # Fill body of the request
[ 
{ 
"op": "replace", 
"path": "users", 
"value": [{
"id": <admin_id>,
"project_role": "VIEWER"
}]
}
]
 # Send the request
 # Verify the response
 # Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <admin_id>

*Expected results:*

5. The request is sent 
6. The response contains:
 {
  "errorCode": 4003,
  "message": "You do not have enough permissions. Self project role change is not allowed"
}
7. The project user role is *not* updated in the DB

---

## API. Project Controller. Manager that is assigned to the organization and not assigned to the project can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Manager is assigned to 'Organization A', but *not* assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Manager is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Manager that is assigned to the project can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Manager is assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Manager is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Manager can not update his own project role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Manager has 'MANAGER' organization role at 'Organization A'
# Manager has 'EDITOR' project role at 'ProjectA'
# Manager is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <manager_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = < manager_id >

*Expected results:*

5. The request is sent 
6. The response contains:
{
  "errorCode": 4003,
  "message": "You do not have enough permissions. Self project role change is not allowed"
}
7. The project user role is *not* updated in the DB

---

## API. Project Controller. Member-editor can update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Member-editor is assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Member-editor is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The project user role is updated in the DB

---

## API. Project Controller. Member-editor cannot update his own project role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Member-editor is assigned to 'ProjectA'
# Member-editor is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <member_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <member_id>

*Expected results:*

5. The request is sent 
6. The response contains:
{
  "errorCode": 4003,
  "message": "You do not have enough permissions. Self project role change is not allowed"
}
7. The project user role is *not* updated in the DB

---

## API. Project Controller. Member-viewer cannot update project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Member-*viewer* is assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Member-*viewer* is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The project user role is *not* updated in the DB

---

## API. Project Controller. Impossible to update project user role when Member user is not assigned to the project

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Member is assigned to 'Organization A', but *not* assigned to 'ProjectA'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Member is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The project user role is *not* updated in the DB

---

## API. Project Controller. Member-viewer cannot update his own project role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Member-viewer is assigned to 'ProjectA'
# Member-viewer is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <member_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <member_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The project user role is *not* updated in the DB

---

## API. Project Controller. Impossible to update project user role when Non-Admin user is not assigned to the organization

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Non-Admin user is *not* assigned to 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Non-Admin user is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The project user role is *not* updated in the DB

---

## API. Project Controller. Impossible to update project user role without operator

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. JSON parse error" message

---

## API. Project Controller. Impossible to update project user role with empty operator

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. JSON parse error" message

---

## API. Project Controller. Impossible to update project user role with empty path

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
{
  "errorCode": 4001,
  "message": "Incorrect Request. Unexpected path: ''"
}

---

## API. Project Controller. Impossible to update project user role without path

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
{
  "errorCode": 4001,
  "message": "Incorrect Request. 'Replace' operation is not supported"
}

---

## API. Project Controller. Possible to update several project user roles simultaneously

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has '*EDITOR*' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id1>,
  "project_role": "VIEWER"
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id1>
# SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The User1 has *VIEWER* project role
8. The User2 has *EDITOR* project role

---

## API. Project Controller. Impossible to update several project user roles without specifying user ID for some

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has 'EDITOR' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "project_role": "VIEWER"
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 404
* "Not Found" message

7. The User2 has *VIEWER* project role

---

## API. Project Controller. Impossible to update several project user roles when some has invalid user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has 'EDITOR' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": "hello",
  "project_role": "VIEWER"
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Bad Request" message

7. The User2 has *VIEWER* project role

---

## API. Project Controller. Impossible to update several project user roles when some has non-existent user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has 'EDITOR' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": "<non-existent_user_id>",
  "project_role": "VIEWER"
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 404
* "User is not found" message

7. The User2 has *VIEWER* project role

---

## API. Project Controller. Impossible to update several project user roles when some has empty project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has 'EDITOR' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id1>,
  "project_role": ""
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
{
  "errorCode": 4001,
  "message": "Incorrect Request. Invalid field 'value'"
}

7. The User2 has *VIEWER* project role

---

## API. Project Controller. Impossible to update several project user roles when some has invalid project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# User1 has 'EDITOR' project role at 'ProjectA'
# User2 has '*VIEWER*' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id1>,
  "project_role": "hello"
},{
  "id": <user_id2>,
  "project_role": "EDITOR"
}
]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent
6. The response contains:
{
  "errorCode": 4001,
  "message": "Incorrect Request. Invalid field 'value'"
}

7. The User2 has *VIEWER* project role

---

## API. Project Controller. Possible to update project name, project slug and project user role simultaneously

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "name-new"   
},
{     
"op": "replace",     
"path": "slug",     
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name and slug are updated in the DB
8. The user has *VIEWER* project role

---

## API. Project Controller. Impossible to update project name, project slug and project user role with invalid operator

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "abc",     
"path": "name",     
"value": "name-new"   
},
{     
"op": "replace",     
"path": "slug",     
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. JSON parse error" message

---

## API. Project Controller. Impossible to update project name, project slug and project user role with invalid path

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "name-new"   
},
{     
"op": "replace",     
"path": "project_slug",     
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. Unexpected value: project_slug" message

---

## API. Project Controller. Impossible to update project name, project slug and project user role with empty project name

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": ""   
},
{     
"op": "replace",     
"path": "slug",     
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectName.name: size must be between 3 and 60, updateProjectName.name: must match \"^[A-Za-z0-9.'_\\- ]+$\"" message

---

## API. Project Controller. Impossible to update project name, project slug and project user role without 'slug' filed

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "name-new"   
},
{     
"op": "replace", 
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. 'Replace' operation is not supported"

---

## API. Project Controller. Impossible to update project name, project slug and project user role with empty project user role

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "name-new"   
},
{     
"op": "replace", 
"path": "slug",     
"value": "slug-new"
},
{     
"op": "replace",     
"path": "users",     
"value": [{
  "id": <user_id>,
  "project_role": ""
}]
}
] 
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. TBD" message

---

## API. Project Controller. Possible to update project user role from EDITOR to VIEWER

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# User is assigned to 'Organization A' and 'ProjectA'
# User has 'MEMBER' organization role at 'Organization A'
# User has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "/users",     
"value": [{
  "id": <user_id>,
  "project_role": "VIEWER"
}]
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The user has *VIEWER* project role

---

