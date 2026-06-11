# Test cases: EPMRPP-97280 — [WS][UI][QA] Add new operations to unassign user from a project. Part 2

**User story:** https://jiraeu.epam.com/browse/EPMRPP-97280

---

## API. Project Controller. Possible to remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "organization_user" table:
SELECT * FROM public.organization_user
WHERE id = <user_id>
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The user has *MEMBER* organization role
8. There is *no* a record in the table

---

## API. Project Controller. Possible to remove several users from project simultaneously

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id1>}, 
     {"id": <user_id2>
}]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "organization_user" table:
SELECT * FROM public.organization_user
WHERE id IN (<user_id1>,<user_id2>)
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id IN (<user_id1>,<user_id2>)

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The users have *MEMBER* organization role
8. There are *no* records in the table

---

## API. Project Controller. Impossible to remove user from project with invalid user ID

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": "hello"
  }]
  }
]
{code}
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Bad Request" message

---

## API. Project Controller. Impossible to remove user from project with non-existent user ID

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <non-existent_user_id>
  }]
  }
]
{code}
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 404
* "User is not found" message

---

## API. Project Controller. Impossible to remove several users from project when some has invalid user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users,
    "value": [{
     "id": "hello"}, 
     {"id": user_id2},
}]
  }
]
{code}
# Send the request
# Verify the response
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id IN (<user_id1>,<user_id2>)

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Bad Request" message

7. There are two records in the table

---

## API. Project Controller. Impossible to remove several users from project when some has non-existent user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users,
    "value": [{
     "id": <non-existent_user_id>}, 
     {"id": {user_id2},
}]
  }
]
{code}
# Send the request
# Verify the response
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id IN (<user_id1>,<user_id2>)

*Expected results:*

5. The request is sent
6. The response contains:
* Code 404
* "User is not found" message

7. There are two records in the table

---

## API. Project Controller. Admin that is assigned to the project can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Admin that is assigned to the organization and not assigned to the project can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Admin that is not assigned to the organization can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Admin can remove himself from project

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin has 'MEMBER' organization role at 'Organization A'
# Admin has 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <admin_id>
  }]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <admin_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. There is *no* a record in the table

---

## API. Project Controller. Manager that is assigned to the project can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Manager that is assigned to the organization and not assigned to the project can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Manager can remove himself from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <manager_id>
  }]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = < manager_id >

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. There is *no* a record in the table

---

## API. Project Controller. Member-editor can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is *no* a record in the table

---

## API. Project Controller. Member-editor can remove himself from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <member_id>
  }]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project_user" table:
SELECT * FROM public.project_user
WHERE id = <member_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. There is *no* a record in the table

---

## API. Project Controller. Impossible to remove user from project when Member user is not assigned to the project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is a record in the table

---

## API. Project Controller. Member-viewer cannot can remove user from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is a record in the table

---

## API. Project Controller. Member-viewer cannot remove himself from project

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <member_id>
  }]
  }
]
{code}
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

7. There is a record in the table

---

## API. Project Controller. Impossible to remove user from project when Non-Admin user is not assigned to the organization

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
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [{
     "id": <user_id>
  }]
  }
]
{code}
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

7. There is a record in the table

---

## API. Project Controller. Possible to remove all users from project simultaneously by sending 'value': null

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Several Users are assigned to 'Organization A' and 'ProjectA' ('User1', 'User2',  'User3')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": null
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "organization_user" table:
SELECT * FROM public.organization_user
WHERE id IN (<user_id1>,<user_id2>,<user_id3>)
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE project_id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The users have *MEMBER* organization role
8. There are *no* records in the table

---

## API. Project Controller. Possible to update project name, project slug, project user role and remove user from project simultaneously

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
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
},
{
"op": "remove",
"path": "users,
"value": [{"id": <user_id2>}]
}
] 
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE id = <user_id>
# SELECT * FROM public.project_user
WHERE id = <user_id2>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name and slug are updated in the DB
8. The user has *VIEWER* project role
8. There is *no* a record in the table

---

## API. Project Controller. Impossible to update project name, project slug, project user role and remove user from project when some has invalid user ID

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Two Users are assigned to 'Organization A' and 'ProjectA' ('User1' and 'User2')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'

*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
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
},
{
"op": "remove",
"path": "users",
"value": [{"id": "hello"}]
}
] 
{code}
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400 
* "Bad Request" message

---

## API. Project Controller. Possible to remove all users from project simultaneously by sending empty 'value'

*Preconditions:*

# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Several Users are assigned to 'Organization A' and 'ProjectA' ('User1', 'User2',  'User3')
# Users have 'MEMBER' organization role at 'Organization A'
# Users have 'EDITOR' project role at 'ProjectA'
# Admin is on the API Documentation page

*Steps:*

# Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
{code:java}
[
  {
    "op": "remove",
    "path": "users",
    "value": [ ]
  }
]
{code}
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "organization_user" table:
SELECT * FROM public.organization_user
WHERE id IN (<user_id1>,<user_id2>,<user_id3>)
# Go to "project_user" table:
SELECT * FROM public.project_user
WHERE project_id = <project_id>

*Expected results:*

6. The response contains:
Code 200 
{
  "message": "The update was completed successfully."
}
7. The users have *MEMBER* organization role
8. There are *no* records in the table

---

