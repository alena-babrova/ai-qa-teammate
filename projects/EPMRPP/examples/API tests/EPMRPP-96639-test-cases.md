# Test cases: EPMRPP-96639 — [WS][QA][Perf] Implement end-point for creating a user on the instance

**User story:** https://jiraeu.epam.com/browse/EPMRPP-96639

---

## API. User Controller. Admin user can create a user

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with all valid values*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": "string",
  "active": true,
  "password": "string"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response example: 
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": string,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Non-Admin user cannot create a user

*Preconditions:*

Non-Admin user exists on the instance

*Steps:*

# Login as Non-Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with all valid values*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": "string",
  "active": true,
  "password": "string"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 403
* "You do not have enough permissions. Access is denied" message

---

## API. User Controller. Impossible to create a user when authentication token doesn't exist

*Steps:*

# For the request in Postman fill the 'Token' field, in Authorization tab, with non-existent token
# Send the request via Postman POST/users with body:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": "string",
  "active": true,
  "password": "string"
}'
{code}

*Expected results:*

2. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Impossible to create a user when authentication token is revoked

*Preconditions:*

# Authentication token exists

*Steps:*

# Login to RP -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the 'Token' field, in Authorization tab, with revoked token
# Send the request via Postman POST/users with body:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": "string",
  "active": true,
  "password": "string"
}'
{code}

*Expected results:*

4. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Impossible to create a user without mandatory fields

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *without email*

Request body example:
{code:java}
'{
  "full_name": "string"
}'
{code}

4. Send the request *without full name*

Request body example:
{code:java}
'{
  "email": "user@example.com"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Incorrect Request. [Field 'email' should not contain only white spaces and shouldn't be empty.]" message

4. The response contains: 
* Code: 400
* "Incorrect Request. [Field 'fullName' should not contain only white spaces and shouldn't be empty.]" message

---

## API. User Controller. Impossible to create a user with invalid email

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with invalid email*

Request body example:
{code:java}
'{ 
  "email": "<invalid_email>" (e.g. "ab"c@epam.com)
  "full_name": "string"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to create a user with already existed email on the instance

*Preconditions:*

Admin user exists on the instance
There is a user with email "test@epam.com" on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with already existed email*

Request body example:
{code:java}
'{ 
  "email": "test@epam.com"
  "full_name": "string"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 409
* "Conflict" message

---

## API. User Controller. Impossible to create a user with UPSA/GITHUB/LDAP/SAML account type

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with UPSA account type*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "account_type": "UPSA"
}'
{code}

*Repeat test case for GITHUB/LDAP/SAML account type*

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Possible to create users with different instance roles

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with USER instance role*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER"
}'
{code}

4. Send the request *with ADMINISTRATOR instance role*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "ADMINISTRATOR"
}'
{code}

5. Go to DB -> "public" schema -> "users" table:
SELECT * FROM public.users

6. Check created user records

*Expected results:*

3. The response contains: 
* Code: 201
* Response example:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}


4. The response contains: 
* Code: 201
* Response example:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "ADMINISTRATOR",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}


6. User records with the following values USER, ADMINISTRATOR in "role" column are created

---

## API. User Controller. Possible to create users with different account types

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with INTERNAL account type*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "account_type": "INTERNAL"
}'
{code}

4. Send the request *with SCIM account type*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "account_type": "SCIM",
}'
{code}

5. Go to DB -> "public" schema -> "users" table:
SELECT * FROM public.users

6. Check created user records

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

4. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "SCIM",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

6. User records with the following values INTERNAL, SCIM in "type" column are created

---

## API. User Controller. Possible to create users with different activities

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with "active":"TRUE"*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "active": true
}'
{code}

4. Send the request *with "active":"FALSE"*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "active": false
}'
{code}

5. Go to DB -> "public" schema -> "users" table:
SELECT * FROM public.users

6. Check created user records

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

4. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

6. User records both with the value true "active" column are created

---

## API. User Controller. Impossible to create a user with empty mandatory fields

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with empty email*

Request body example:
{code:java}
'{ 
  "email": "" 
  "full_name": "string"
}'
{code}

4. Send the request *with empty full name*

Request body example:
{code:java}
'{ 
  "email": "user@example.com" 
  "full_name": ""
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

4. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Possible to create a user with filling only mandatory fields

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Default values are applied to non-required fields when they are not specified

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
}'
{code}

4. Go to DB -> "public" schema -> "users" table:
SELECT * FROM public.users

5. Check created user record

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

5. User record with the following fields is created:
"login" - "<email>"
"role" - "USER", 
"type" - "INTERNAL"
"active" - "TRUE"

---

## API. User Controller. Possible to login by user that was created with login and password

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "password": "string"
}'
{code}

4. Go to RP -> "Login" page 
5. Enter email in "Login" field
6. Enter password in "Password" field
7. Click on "Login" button

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

7. User is logged in successfully

---

## API. User Controller. Impossible to create a user with invalid length of full name

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with full name length less than the permitted one* (less than 3 symbols)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "<invalid_length_of_full_name>" (e.g. "us")
}'
{code}

4. Send the request *with full name length more than the permitted one* (more than 60 symbols)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "<invalid_length_of_full_name>" (e.g. "user-with-very-very-long-full-name-very-very-very-long-full-n")
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

4. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to create a user with invalid length of password

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with password length less than the permitted one* (less than 8 symbols)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
  "password": "<invalid_full_name>" (e.g. My_user)
}'
{code}

4. Send the request *with password length more than the permitted one* (more than 256 symbols)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
  "password": "<invalid_full_name>" (e.g. S3VeGmxxoRg4dLhPWLNvNT1npjO8aRdPetRKjg2PnLrDr8NBQxyUwc4qc6JoucS76jgl8AtimiUSafjyopL5tSh7s14F2U3NLgQWuNytq9iaIgGEzy5Qpva9M04Bq8cwshUmtwVIb20AXBIOISMSYxGRvHPYT2nWdrmzrxcMXDDzW3jMi5RvHyOAGkZClCNZM7FPNItT9CQfM28ry59gmVIPhA0XewPFqGmQYDk07iBBgXxQcmbScJUeTHCqrW50-)
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

4. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Login is generated automatically based on email

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
}'
{code}

4. Go to DB -> "public" schema -> "users" table:
SELECT * FROM public.users

5. Check created user record

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

5. User record with "user" value in "login" field is created (whole email value, including part after @)

---

## API. User Controller. Possible to create a user with allowed special symbols in full name

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with special symbols in full name (.'_-)*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string" (e.g. User1_'.-)
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "User1_'.-",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Impossible to create a user with unallowed special symbols in full name

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with unallowed special symbols in full name*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string" (e.g. User!)
}'
{code}

*Repeat test case when last symbol of full name is one of @#$%^&*()+=?<>:;*

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Possible to create a user with special symbols in password

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with any special symbols in password*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string"
  "password": "string" (e.g. My_password1@*)
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Possible to create a user with already existed full name on the instance

*Preconditions:*

Admin user exists on the instance
There is a user with full name "tester" on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with already existed full name but different email*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "tester"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "tester",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Password should meet security requirements when creating user

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with password that meets security requirements* (one uppercase letter, one lowercase letter, one number, one special character)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "password": "string" (e.g. My_password1)
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 201
* Response contains:
{code:java}
{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "USER",
  "account_type": "INTERNAL",
  "external_id": null,
  "active": true,
  "_links": {
    "self": {
      "href": "/users/7725",
      "type": null,
      "title": null
    },
    "avatar": null
  },
  "id": 7725,
  "uuid": "b141ba88-a806-4b17-978b-10d5f49d6c03",
  "created_at": "2025-06-09T07:00:06.743222Z",
  "updated_at": "2025-06-09T07:00:06.743234Z",
  "last_login_at": "2025-06-09T07:00:06.742Z",
  "stats": {
    "org_stats": {
      "total_count": 0
    }
  },
  "organizations": []
}
{code}

---

## API. User Controller. Impossible to create a user when password doesn't meet security requirements

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with password that doesn't meet security requirements* (one uppercase letter, one lowercase letter, one number, one special character)

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "password": "string" (e.g. My_password)
}'
{code}

*Repeat test case without uppercase letter, lowercase letter, special character*

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to create a user when password has space

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with password that has space*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "password": "string" (e.g. My _password1)
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to create a user with non-existent account type

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with non-existent account type*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "account_type": "BLABLABLA"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to create a user with non-existent instance role

*Preconditions:*

Admin user exists on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users
# Send the request *with non-existent instance role*

Request body example:
{code:java}
'{
  "email": "user@example.com",
  "full_name": "string",
  "instance_role": "BLABLABLA"
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Bad Request" message

---

