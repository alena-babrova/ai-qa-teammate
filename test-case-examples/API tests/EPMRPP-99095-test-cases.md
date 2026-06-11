# Test cases: EPMRPP-99095 — [WS][QA][PERF] Implement end-point for partial project update. Part 1

**User story:** https://jiraeu.epam.com/browse/EPMRPP-99095

---

## API. Project Controller. Admin that is assigned to the project can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Admin that is assigned to the organization and not assigned to the project can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Admin that is not assigned to the organization can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is *not* assigned to 'Organization A'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Impossible to update project name when Non-Admin user is not assigned to the organization

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Non-Admin user is *not* assigned to 'Organization A'


*Steps:*

# Login as Non-Admin -> Navigate to Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
 * Code 403
 * "You do not have enough permissions. Access is denied" message

7. The name is *not* updated in the DB

---

## API. Project Controller. Impossible to update project name when Member user is not assigned to the project

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Member -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The name is *not* updated in the DB

---

## API. Project Controller. Impossible to update project name when Member is assigned with 'viewer' project role

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member-*viewer* is assigned to 'ProjectA'


*Steps:*

# Login as Member-viewer -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The name is *not* updated in the DB

---

## API. Project Controller. Impossible to update project slug with only special symbols for project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "!@#$%^&*()"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectSlug.slug: size must be between 3 and 60, updateProjectSlug.slug: must match \"^[a-z0-9]+(?:-[a-z0-9]+)*$\""

---

## API. Project Controller. Upper case letters for project slug are replaced with lower case letters after updating

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "Project-AA"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB, all letters are displayed in lower case (e.g. project-aa)

---

## API. Project Controller. Impossible to update project name with empty project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


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

## API. Project Controller. Impossible to update project name when another project has the same project name within one organization

*Preconditions:*

'Organization A' and 'Organization B' are created
'ProjectA' and 'ProjectB' are created in the 'Organization A'
'ProjectC' is created in the 'Organization B'
Admin user is assigned to 'ProjectA', 'ProjectB' and 'ProjectC'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill 'org_id' with id of 'Organization A'
# Fill 'project_id' with id of 'ProjectA'
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "ProjectB"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 409
* "Resource 'project name' already exists. You couldn't create the duplicate." message

7. The name is *not* updated in the DB

---

## API. Project Controller. Impossible to update project name with invalid length for project name (short value)

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request *with project name less than 3 symbols*
[   
{     
"op": "replace",     
"path": "name",     
"value": "Pr"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request *with 3 symbols in project name*
[   
{     
"op": "replace",     
"path": "name",     
"value": "Pro"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400 
* "Incorrect Request. updateProjectName.name: size must be between 3 and 60" message

7. The name is *not* updated in the DB
8. -
9. The request is sent
10. The response contains:
* Code 200 
* "The update was completed successfully." message

11. The name is updated in the DB

---

## API. Project Controller. Impossible to update project name with invalid length for project name (long value)

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request *with project name more than 60 symbols* (in the example 61 symbols)
[   
{     
"op": "replace",     
"path": "name",     
"value": "Project AProject AProject AProject AProject AProject AProject"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request *with 60 symbols in project name*
[   
{     
"op": "replace",     
"path": "name",     
"value": "Project AProject AProject AProject AProject AProject AProjec"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400 
* "Incorrect Request. updateProjectName.name: size must be between 3 and 60" message

7. The name is *not* updated in the DB
8. -
9. The request is sent
10. The response contains:
* Code 200 
* "The update was completed successfully." message

11. The name is updated in the DB

---

## API. Project Controller. Possible to update project name with spaces in project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "Pro ject A"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Possible to update project name with valid characters (UTF-8) for project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "New project.'_-"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB and is shown correctly

---

## API. Project Controller. Project key is not updated when project name is updated

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

4. The request is sent 
5. The response contains:
* Code 200 
* "The update was completed successfully." message

6. The name is updated in the DB, but project key hasn't been updated and remains the same as it was before the name update

---

## API. Project Controller. Manager that is assigned to the project can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Manager is assigned to 'ProjectA'


*Steps:*

# Login as Manager -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Manager that is assigned to the organization and not assigned to the project can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Manager is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Manager -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Member-editor can update project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member-editor is assigned to 'ProjectA'


*Steps:*

# Login as Member-editor -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB

---

## API. Project Controller. Impossible to update project slug with empty project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": ""   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectSlug.slug: size must be between 3 and 60, updateProjectSlug.slug: must match \"^[a-z0-9]+(?:-[a-z0-9]+)*$\""

---

## API. Project Controller. Impossible to update project name without organization ID

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Send the request via Postman PATCH/organizations//projects/{project_id}
with body 
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Verify the response

*Expected results:*

2. The response contains: 
* Code: 404
* "Not Found" message

---

## API. Project Controller. Impossible to update project name without project ID

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Send the request via Postman PATCH/organizations/{org_id}/projects/
with body 
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]
# Verify the response

*Expected results:*

2. The response contains: 
* Code: 404
* "Not Found" message

---

## API. Project Controller. Impossible to update project slug with invalid organization ID

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Send the request via Postman PATCH/organizations/hello/projects/{project_id}
with body 
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]
# Verify the response

*Expected results:*

2. The response contains: 
* Code: 400
* "Incorrect Request. Method parameter 'org_id': Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'; For input string: \"hello\"" message

---

## API. Project Controller. Impossible to update project slug with invalid project ID

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Send the request via Postman PATCH/organizations/{org_id}/projects/hello
with body 
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]
# Verify the response

*Expected results:*

2. The response contains: 
* Code: 400
* "Incorrect Request. Method parameter 'project_id': Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'; For input string: \"hello\"" message

---

## API. Project Controller. Impossible to update project name in non-existent organization

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill *non-existent* Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "<updated_project_name>"   
} 
]  
# Send the request
# Verify the response

*Expected results:*

6. The response contains: 
* Code: 404
* "Project <project_id> not found. Did you use correct project ID?" message

---

## API. Project Controller. Impossible to update project slug in non-existent project

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill *non-existent* Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains: 
* Code: 404
* "Project '<project_id>' not found. Did you use correct project ID?" message

---

## API. Project Controller. Admin that is assigned to the project can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_ slug >"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Admin that is assigned to the organization and not assigned to the project can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Admin that is not assigned to the organization can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin is *not* assigned to 'Organization A'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Manager that is assigned to the project can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Manager is assigned to 'ProjectA'


*Steps:*

# Login as Manager -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Manager that is assigned to the organization and not assigned to the project can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Manager is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Manager -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Member-editor can update project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member-editor is assigned to 'ProjectA'


*Steps:*

# Login as Member-editor -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_ slug >"   
} 
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Impossible to update project slug when Member is assigned with 'viewer' project role

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member-*viewer* is assigned to 'ProjectA'


*Steps:*

# Login as Member-viewer -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The slug is *not* updated in the DB

---

## API. Project Controller. Impossible to update project slug when Non-Admin user is not assigned to the organization

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Non-Admin user is *NOT* assigned to 'Organization A'


*Steps:*

# Login as Non-Admin -> Navigate to Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
 * Code 403
 * "You do not have enough permissions. Access is denied" message

7. The slug is *not* updated in the DB

---

## API. Project Controller. Impossible to update project slug when Member user is not assigned to the project

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Member is assigned to 'Organization A', but *not* assigned to 'ProjectA'


*Steps:*

# Login as Member -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. Request is sent
6. The response contains:
* Code 403
* "You do not have enough permissions. Access is denied" message

7. The slug is *not* updated in the DB

---

## API. Project Controller. Impossible to update project name without project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",  
"value": "<updated_project_name>"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. 'Replace' operation is not supported" message

---

## API. Project Controller. Impossible to update project name with invalid characters for project name

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "!@#$%^&*()"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectName.name: must match \"^[A-Za-z0-9.'_\\- ]+$\"" message

---

## API. Project Controller. Impossible to update project slug without 'slug' filed

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"value": "<updated_project_slug>"
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

## API. Project Controller. Impossible to update project slug with invalid length for project slug (short value)

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request *with project slug less than 3 symbols*
[   
{     
"op": "replace",     
"path": "slug",     
"value": "pr"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request *with 3 symbols in project name*
[   
{     
"op": "replace",     
"path": "slug",     
"value": "pro"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400 
* "Incorrect Request. updateProjectSlug.slug: size must be between 3 and 60" message

7. The slug is *not* updated in the DB
8. -
9. The request is sent
10. The response contains:
* Code 200 
* "The update was completed successfully." message

11. The slug is updated in the DB

---

## API. Project Controller. Impossible to update project slug with invalid length for project slug (long value)

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request *with project slug more than 60 symbols* (in the example 61 symbols)
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-a-project-a-project-aproject-a-project-a-project-apro"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request *with 60 symbols in project slug*
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-a-project-a-project-aproject-a-project-a-project-apr"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400 
* "Incorrect Request. updateProjectSlug.slug: size must be between 3 and 60" message

7. The slug is *not* updated in the DB
8. -
9. The request is sent
10. The response contains:
* Code 200 
* "The update was completed successfully." message

11. The slug is updated in the DB

---

## API. Project Controller. Possible to update project name and slug simultaneously

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


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
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name and slug are updated in the DB

---

## API. Project Controller. Impossible to update project name and slug with invalid operator

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


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
} 
]
# Send the request
# Verify the response
# Fill body of the request
[   
{     
"op": "hello",     
"path": "slug",     
"value": "slug-new"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. JSON parse error" message

7. -
8. The request is sent
9. The response contains:
* Code 400
* "Incorrect Request. JSON parse error" message

---

## API. Project Controller. Impossible to update project name and slug with invalid path

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "project_name",     
"value": "name-new"   
} 
]
# Send the request
# Verify the response
# Fill body of the request
[   
{     
"op": "replace",     
"path": "project_slug",     
"value": "slug-new"   
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. Unexpected value: project_name" message

7. -
8. The request is sent
9. The response contains:
* Code 400
* "Incorrect Request. Unexpected value: project_slug" message

---

## API. Project Controller. Impossible to update project name and slug simultaneously when one of them has incorrect value

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


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
"path": "slug"
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name"
},
{     
"op": "replace",     
"path": "slug",     
"value": "slug-new"
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectSlug.slug: must match \"^[a-z0-9]+(?:-[a-z0-9]+)*$\", updateProjectSlug.slug: size must be between 3 and 60" message

7. The name and slug are *not* updated in the DB
8. - 
9. The request is sent 
10. The response contains:
* Code 400
* "Incorrect Request. updateProjectName.name: must not be null" message

11. The name and slug are *not* updated in the DB

---

## API. Project Controller. The last value is taken when updating project name several times in one request

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "Project B"   
},
{     
"op": "replace",     
"path": "name",     
"value": "Project C"
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The name is updated in the DB, the project has "Project C" name

---

## API. Project Controller. The last value is taken when updating project slug several times in one request

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-b"   
},
{     
"op": "replace",     
"path": "slug",     
"value": "project-c"
}
] 
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB, the project has "project-c" slug

---

## API. Project Controller. Impossible to update project slug when another project has the same project slug within one organization

*Preconditions:*

'Organization A' and 'Organization B' are created
'ProjectA' and 'ProjectB' are created in the 'Organization A'
'ProjectC' is created in the 'Organization B'
Admin user is assigned to 'ProjectA', 'ProjectB' and 'ProjectC'
'ProjectA' has 'project-a' slug
'ProjectB' has 'project-b' slug
'ProjectC' has 'project-c' slug


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill 'org_id' with id of 'Organization A'
# Fill 'project_id' with id of 'ProjectA'
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-b"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 409
* "Resource 'project slug' already exists. You couldn't create the duplicate." message

7. The name is *not* updated in the DB

---

## API. Project Controller. Project key is not updated when project slug is updated

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "<updated_project_slug>"   
} 
]  
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

4. The request is sent 
5. The response contains:
* Code 200 
* "The update was completed successfully." message

6. The slug is updated in the DB, but project key hasn't been updated and remains the same as it was before the slug update

---

## API. Project Controller. Possible to update project slug with '-' symbol in project slug

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-new"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB

---

## API. Project Controller. Impossible to update project name/slug when authentication token doesn't exist

*Preconditions*:
'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'

*Steps*: 
# For the request in Postman fill the 'Token' field, in Authorization tab, with non-existent token
# Send the request via Postman PATCH/organizations/{org_id}/projects/{project_id} with body:
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
] 
{code}

*Steps:*

*Preconditions*:
'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'

*Steps*: 
# For the request in Postman fill the 'Token' field, in Authorization tab, with non-existent token
# Send the request via Postman PATCH/organizations/{org_id}/projects/{project_id} with body:
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
] 
{code}

*Expected results:*

2. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. Project Controller. Impossible to update project name/slug when authentication token is revoked

*Preconditions*: 
# Authentication token exists
# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin user is assigned to 'ProjectA'

*Steps*: 
# Login as Admin -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the 'Token' field, in Authorization tab, with revoked token
# Send the request via Postman PATCH/organizations/{org_id}/projects/{project_id} with body:
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
] 
{code}

*Steps:*

*Preconditions*: 
# Authentication token exists
# 'Organization A' is created
# 'ProjectA' is created in the 'Organization A'
# Admin user is assigned to 'ProjectA'

*Steps*: 
# Login as Admin -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the 'Token' field, in Authorization tab, with revoked token
# Send the request via Postman PATCH/organizations/{org_id}/projects/{project_id} with body:
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
] 
{code}

*Expected results:*

4. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. Project Controller. Possible to update project name and slug when another project has the same project name and slug within different organizations

*Preconditions:*

'Organization A' and 'Organization B' are created
'ProjectA' is created in the 'Organization A'
'ProjectB' is created in the 'Organization B'
Admin user is assigned to 'ProjectA' and 'ProjectB'
'ProjectA' has 'project-1' slug
'ProjectB' has 'project-2' slug


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill 'org_id' with id of 'Organization A'
# Fill 'project_id' with id of 'ProjectA'
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name",     
"value": "ProjectB"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "project-2"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200
* "The update was completed successfully." message

7. The name is updated in the DB
8. -
9. The request is sent
10. The response contains:
* Code 200
* "The update was completed successfully." message

11. The slug is updated in the DB

---

## API. Project Controller. Impossible to update project slug without project slug value

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'
'ProjectA' has 'project-1' slug


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug"
} 
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent 
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectSlug.slug: must match \"^[a-z0-9]+(?:-[a-z0-9]+)*$\", updateProjectSlug.slug: size must be between 3 and 60" message

---

## API. Project Controller. Impossible to update project name without project name value

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "name"  
}
]
# Send the request
# Verify the response

*Expected results:*

5. The request is sent
6. The response contains:
* Code 400
* "Incorrect Request. updateProjectName.name: must not be null" message

---

## API. Project Controller. Special symbols are replaced with '-' symbols for project slug after updating

*Preconditions:*

'Organization A' is created
'ProjectA' is created in the 'Organization A'
Admin user is assigned to 'ProjectA'


*Steps:*

# Login as Admin -> Navigate to Organization-Projects Controller -> PATCH/organizations/{org_id}/projects/{project_id}
# Fill Organization ID in the 'org_id' field
# Fill Project ID in the 'project_id' field
# Fill body of the request
[   
{     
"op": "replace",     
"path": "slug",     
"value": "new!slug@updated"   
} 
]
# Send the request
# Verify the response
# Go to DB -> "public" schema -> "project" table:
SELECT * FROM public.project
WHERE id = <project_id>

*Expected results:*

5. The request is sent
6. The response contains:
* Code 200 
* "The update was completed successfully." message

7. The slug is updated in the DB, special symbols are replaced with '-' symbols (e.g. new-slug-updated)
