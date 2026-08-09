# Test cases: EPMRPP-98512 — [WS][QA][Perf] Implement end-point for filtering users on 'All users' page

**User story:** https://jiraeu.epam.com/browse/EPMRPP-98512

---

## API. User Controller. Admin user can get filtered list of users

*Preconditions:*

Admin user exists on the instance
There are two users with name "test" and "test1" on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name "test"

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "EQ",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Only user with name "test" is displayed
* Code: 200
* Response example: 
{code:java}
{
  "offset": 0,
  "limit": 300,
  "total_count": 0,
  "sort": "string",
  "order": "ASC",
  "items": [
    {
      "id": <id>,
      "uuid": "<uuid>",
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
          "href": "https://api.example.com/users/123"
        },
        "avatar": {
          "href": "https://api.example.com/users/123/avatar",
          "type": "image/png",
          "title": "User's profile picture"
        }
      },
      "stats": {
        "org_stats": {
          "total_count": 0
        }
      },
      "organizations": [
        {
          "id": 0,
          "org_role": "MEMBER",
          "name": "string",
          "slug": "string"
        }
      ]
    }
  ]
}
{code}

---

## API. User Controller. Non-Admin user cannot get filtered list of users

*Preconditions:*

Non-Admin user exists on the instance
There are two users with name "test" and "test1" on the instance

*Steps:*

# Login as Non-Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name "test"

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "EQ",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 403
* "You do not have enough permissions. Access Denied" message

---

## API. User Controller. Impossible to get filtered list of users when authentication token doesn't exist

*Preconditions:*

There is a user with name "test" on the instance

*Steps:*

# For the request in Postman fill the 'Token' field, in Authorization tab, with non-existent token
# Send the request via Postman POST/users/searches with body:
{code:java}
'{
  "offset": 0,
  "limit": 1000,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "name",
      "operation": "EQ",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

2. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Impossible to get filtered list of users when authentication token is revoked

*Preconditions:*

# There is a user with name "test" on the instance
# Authentication token exists

*Steps:*

# Login to RP -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the 'Token' field, in Authorization tab, with revoked token
# Send the request via Postman POST/users/searches with body:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "name",
      "operation": "EQ",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

4. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Filtering users by uuid

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. 01c36fab-60ad-4b22-9904-cb9cae9fb483 uuid
"test1" user has e.g. 8cbceaac-85be-49ea-b6ba-7844b53d6068 uuid

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the uuid

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "uuid",
      "operation": "EQ",
      "value": "01c36fab-60ad-4b22-9904-cb9cae9fb483"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "uuid",
      "operation": "NE",
      "value": "01c36fab-60ad-4b22-9904-cb9cae9fb483"
    }
5. Send the same request with "IN" operation
 {
      "filter_key": "uuid",
      "operation": "IN",
      "value": "01c36fab-60ad-4b22-9904-cb9cae9fb483, 8cbceaac-85be-49ea-b6ba-7844b53d6068"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* User with specified uuid is displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with uuid *not equal* to '01c36fab-60ad-4b22-9904-cb9cae9fb483' are displayed ("test1" user is displayed)

5. The response contains: 
* Code: 200
* Users that have '01c36fab-60ad-4b22-9904-cb9cae9fb483, 8cbceaac-85be-49ea-b6ba-7844b53d6068' values in uuid are displayed ("test" and "test1" users are displayed)

---

## API. User Controller. Filtering users by external id

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. 1 external id
"test1" user has e.g. 2 external id

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the external id

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 1000,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "external_id",
      "operation": "EQ",
      "value": "1"
    }
  ]
}'
{code}

4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "external_id",
      "operation": "NE",
      "value": "1"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* User with specified external id is displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with external id *not equal* to '1' are displayed ("test1" user is displayed)

---

## API. User Controller. Filtering users by email

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. test@mail.com email
"test1" user has e.g. test1@mail.com email

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the email

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "email",
      "operation": "EQ",
      "value": "test@mail.com"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "email",
      "operation": "NE",
      "value": "test@mail.com"
    }
5. Send the same request with "CNT" (contain) operation
 {
      "filter_key": "email",
      "operation": "CNT",
      "value": "test"
    }
6. Send the same request with "NOT_CNT" (NOT contain) operation
 {
      "filter_key": "email",
      "operation": "NOT_CNT",
      "value": "1"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* User with specified email is displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with emails *not equal* to 'test@mail.com' are displayed ("test1" user is displayed)

5. The response contains: 
* Code: 200
* Users that have 'test' value in their emails are displayed ("test" and "test1" users are displayed)

6. The response contains: 
* Code: 200
* Users that *don't contain* '1' value in their emails are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by full name

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. test ivanov full name
"test1" user has e.g. test1 petrov full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "EQ",
      "value": "test ivanov"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "full_name",
      "operation": "NE",
      "value": "test ivanov"
    }
5. Send the same request with "CNT" (contain) operation
 {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "test"
    }
6. Send the same request with "NOT_CNT" (NOT contain) operation
 {
      "filter_key": "full_name",
      "operation": "NOT_CNT",
      "value": "1"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* User with specified full name is displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with full name *not equal* to 'test ivanov' are displayed ("test1" user is displayed)

5. The response contains: 
* Code: 200
* Users that have 'test' value in their emails are displayed ("test" and "test1" users are displayed)

6. The response contains: 
* Code: 200
* Users that *don't contain* '1' value in their emails are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by account type

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. INTERNAL account_type
"test1" user has e.g. GITHUB account_type
"test2" user has e.g. UPSA account_type
"test3" user has e.g. LDAP account_type
"test4" user has e.g. SAML account_type
"test5" user has e.g. SCIM account_type

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2, Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for users with the INTERNAL account type
  Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "INTERNAL"
    }
  ]
}'
{code}
4. Send the request to search for users with the GITHUB account type
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "GITHUB"
    }
5. Send the request to search for users with the UPSA account type
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "UPSA"
    }
6. Send the request to search for users with the LDAP account type
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "LDAP"
    }
7. Send the request to search for users with the SAML account type
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "SAML"
    }
8. Send the request to search for users with the SCIM account type
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "SCIM"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* User with INTERNAL account type is displayed ("*test*" is displayed)

4. The response contains: 
* Code: 200
* User with GITHUB account type is displayed ("*test1*" is displayed)

5. The response contains: 
* Code: 200
* User with UPSA account type is displayed ("*test2*" is displayed)

6. The response contains: 
* Code: 200
* User with LDAP account type is displayed ("*test3*" is displayed)

7. The response contains: 
* Code: 200
* User with SAML account type is displayed  ("*test4*" is displayed)

8. The response contains: 
* Code: 200
* User with SCIM account type is displayed ("*test5*" is displayed)

---

## API. User Controller. Filtering users by creation date

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user was created e.g. 2019-08-24T14:15:22Z
"test1" user was created e.g. 2020-01-12T11:16:20Z
"test2" user was created e.g. 2020-06-19T13:10:48Z

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the specified created date

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "created_at",
      "operation": "EQ",
      "value": "2019-08-24T14:15:22Z"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "created_at",
      "operation": "NE",
      "value": "2019-08-24T14:15:22Z"
    }
5. Send the same request with "BTW" (between) operation
 {
      "filter_key": "created_at",
      "operation": "BTW",
      "value": "2019-01-01T10:00:00Z,2019-12-31T10:00:00Z"
    }
6. Send the same request with "IN" operation
 {
      "filter_key": "created_at",
      "operation": "IN",
      "value": "2020-01-12T11:16:20Z,2020-06-19T13:10:48Z"
    }
7. Send the same request with "GTE" (greater than or equal) operation
 {
      "filter_key": "created_at",
      "operation": "GTE",
      "value": "2020-01-12T11:16:20Z"
    }
8. Send the same request with "GT" (greater than) operation
 {
      "filter_key": "created_at",
      "operation": "GT",
      "value": "2020-01-12T11:16:20Z"
    }
9. Send the same request with "LTE" (less than or equal) operation
 {
      "filter_key": "created_at",
      "operation": "LTE",
      "value": "2020-01-12T11:16:20Z"
    }
10. Send the same request with "LT" (less than) operation
 {
      "filter_key": "created_at",
      "operation": "LT",
      "value": "2020-01-12T11:16:20Z"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users that were created in the specified time are displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with creation date *not equal* to '2019-08-24T14:15:22Z' are displayed ("test1" and "test2" users are displayed)

5. The response contains: 
* Code: 200
* Users that were created *between* "2019-01-01T10:00:00Z" and "2019-12-31T10:00:00Z" are displayed ('test' user is displayed)

6. The response contains: 
* Code: 200
* Users that have provided values in creation date are displayed ("tes1" and "test2" users are displayed)

7. The response contains: 
* Code: 200
* Users that were created at 2020-01-12T11:16:20Z *or later* are displayed ("test1" and "test2" users are displayed)

8. The response contains: 
* Code: 200
* Users that were created *later than* "2020-01-12T11:16:20Z" are displayed ('test2' user is displayed)

9. The response contains: 
* Code: 200
* Users that were created at "2020-01-12T11:16:20Z" *or before* are displayed ('test' and 'test1' users are displayed)

10. The response contains: 
* Code: 200
* Users that were created *before* "2020-01-12T11:16:20Z" are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by update date

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user was updated e.g. 2019-08-24T14:15:22Z
"test1" user was updated e.g. 2020-01-12T11:16:20Z
"test2" user was updated e.g. 2020-06-19T13:10:48Z

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the specified updated date

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "updated_at",
      "operation": "EQ",
      "value": "2019-08-24T14:15:22Z"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "updated_at",
      "operation": "NE",
      "value": "2019-08-24T14:15:22Z"
    }
5. Send the same request with "BTW" (between) operation
 {
      "filter_key": "updated_at",
      "operation": "BTW",
      "value": "2019-01-01T10:00:00Z,2019-12-31T10:00:00Z"
    }
6. Send the same request with "IN" operation
 {
      "filter_key": "updated_at",
      "operation": "IN",
      "value": "2020-01-12T11:16:20Z,2020-06-19T13:10:48Z"
    }
7. Send the same request with "GTE" (greater than or equal) operation
 {
      "filter_key": "updated_at",
      "operation": "GTE",
      "value": "2020-01-12T11:16:20Z"
    }
8. Send the same request with "GT" (greater than) operation
 {
      "filter_key": "updated_at",
      "operation": "GT",
      "value": "2020-01-12T11:16:20Z"
    }
9. Send the same request with "LTE" (less than or equal) operation
 {
      "filter_key": "updated_at",
      "operation": "LTE",
      "value": "2020-01-12T11:16:20Z"
    }
10. Send the same request with "LT" (less than) operation
 {
      "filter_key": "updated_at",
      "operation": "LT",
      "value": "2020-01-12T11:16:20Z"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users that were updated in the specified time are displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with update date *not equal* to '2019-08-24T14:15:22Z' are displayed ("test1" and "test2" users are displayed)

5. The response contains: 
* Code: 200
* Users that were updated *between* "2019-01-01T10:00:00Z" and "2019-12-31T10:00:00Z" are displayed ('test' user is displayed)

6. The response contains: 
* Code: 200
* Users that have provided values in update date are displayed ("tes1" and "test2" users are displayed)

7. The response contains: 
* Code: 200
* Users that were updated at 2020-01-12T11:16:20Z *or more* are displayed ("test1" and "test2" users are displayed)

8. The response contains: 
* Code: 200
* Users that were updated *more than* "2020-01-12T11:16:20Z" are displayed ('test2' user is displayed)

9. The response contains: 
* Code: 200
* Users that were updated at "2020-01-12T11:16:20Z" *or less* are displayed ('test' and 'test1' users are displayed)

10. The response contains: 
* Code: 200
* Users that were updated *less than* "2020-01-12T11:16:20Z" are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by organization id

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user is assigned to OrganizationA (e.g. id 1)
"test1" user is assigned to OrganizationB (e.g. id 2)
"test2" user is assigned to OrganizationB (e.g. id 3)

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the organization id

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "org_id",
      "operation": "EQ",
      "value": "1"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "org_id",
      "operation": "NE",
      "value": "1"
    }
5. Send the same request with "BTW" (between) operation
 {
      "filter_key": "org_id",
      "operation": "BTW",
      "value": "1,3"
    }
6. Send the same request with "IN" operation
 {
      "filter_key": "org_id",
      "operation": "IN",
      "value": "1,2"
    }
7. Send the same request with "GTE" (greater than or equal) operation
 {
      "filter_key": "org_id",
      "operation": "GTE",
      "value": "2"
    }
8. Send the same request with "GT" (greater than) operation
 {
      "filter_key": "org_id",
      "operation": "GT",
      "value": "2"
    }
9. Send the same request with "LTE" (less than or equal) operation
 {
      "filter_key": "org_id",
      "operation": "LTE",
      "value": "2"
    }
10. Send the same request with "LT" (less than) operation
 {
      "filter_key": "org_id",
      "operation": "LT",
      "value": "2"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users that are assigned to organization with id "1" are displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users that are assigned to organizations with id *not equal* to "1" are displayed ("test1" and "test2" users are displayed)

5. The response contains: 
* Code: 200
* Users that are assigned to organization with id *between* "1" and "3" are displayed ('test', 'test1' and 'test2' users are displayed)

6. The response contains: 
* Code: 200
* Users that are assigned to organizations with id either "1" or "2" are displayed ("test" and "test1" users are displayed)

7. The response contains: 
* Code: 200
* Users that are assigned to organization with id "2" *or greater* are displayed ("test1" and "test2" users are displayed)

8. The response contains: 
* Code: 200
* Users that are assigned to organization with id *greater than* "2" are displayed ('test2' user is displayed)

9. The response contains: 
* Code: 200
* Users that are assigned to organization with id "2" *or less* are displayed ('test' and 'test1' users are displayed)

10. The response contains: 
* Code: 200
* Users that are assigned to organization with id *less than* "2" are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by instance role

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. ADMINISTRATOR instance role
"test1" user has e.g. USER instance role

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2. Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for users with the USER instance role
  Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "instance_role",
      "operation": "EQ",
      "value": "USER"
    }
  ]
}'
{code}
4. Send the request to search for users with the ADMINISTRATOR instance role
    {
      "filter_key": "instance_role",
      "operation": "EQ",
      "value": "ADMINISTRATOR"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users with "USER" type are displayed ("test1" user is displayed)

4. The response contains: 
* Code: 200
* Users with "ADMINISTRATOR" type are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by activity

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user is active (active is TRUE)
"test1" user is not active (active is FALSE)

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2. Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for active users (active is TRUE)
    Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "active",
      "operation": "EQ",
      "value": "TRUE"
    }
  ]
}'
{code}
4. Send the request to search for inactive users (active is FALSE)
    {
      "filter_key": "active",
      "operation": "EQ",
      "value": "FALSE"
    }

*Expected results:*

3.  The response contains: 
* Code: 200
* Users with "active":"TRUE" field are displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with "active":"FALSE" field are displayed ("test1" user is displayed)

---

## API. User Controller. Maximum 300 users are returned by default

*Preconditions:*

Admin user exists on the instance
There are 301 users on the instance
All users contain "user" word in their full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains 300 users objects

---

## API. User Controller. Possible to set custom limit of users returned in the response

*Preconditions:*

Admin user exists on the instance
There are 301 users on the instance
All users contain "user" word in their full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with a non-default value for the 'limit' parameter (e.g. 50) to search for users:

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 50,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains 50 users objects

---

## API. User Controller. By default users are sorted by full name

*Preconditions:*

Admin user exists on the instance
There are several users on the instance
All users contain "user" word in their full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains users sorted by full name and in ASC order (e.g. "userA", "userB", "userC", etc.)

---

## API. User Controller. Possible to specify sorting direction

*Preconditions:*

Admin user exists on the instance
There are several users on the instance
All users contain "user" word in their full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "full_name",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}
4. Send the same request with "DESC" order

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains users sorted in ASC order (e.g. "userA", "userB", "userC", etc.)

4. The response contains: 
* Code: 200
* The response contains users sorted in DESC order (e.g. "userC", "userB", "userA", etc.)

---

## API. User Controller. Impossible to get filtered list of users using invalid filter key

*Preconditions:*

Admin user exists on the instance
There are two users with name "test" and "test1" on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "hello",
      "operation": "EQ",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Incorrect filtering parameters. Filter parameter hello is not defined" message

---

## API. User Controller. Impossible to get filtered list of users using invalid filter operator

*Preconditions:*

Admin user exists on the instance
There are two users with name "test" and "test1" on the instance

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "ABC",
      "value": "test"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 400
* "Incorrect Request. Invalid JSON input" message

---

## API. User Controller. Possible to specify sorting field

*Preconditions:*

Admin user exists on the instance
There are several users on the instance
All users contain "user" word in their full name

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> POST/users/searches
# Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "instance_role",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains users sorted by instance role (first users with "ADMINISTRATOR" instance role, then users with "USER" instance role)

---

## API. User Controller. Possible to paginate results

*Preconditions:*

Admin user exists on the instance
There are 301 users on the instance
All users contain "user" word in their full name

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2. Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}
4. Send the request to search for users with the full name

Request body example:
{code:java}
'{
  "offset": 1,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "full_name",
      "operation": "CNT",
      "value": "user"
    }
  ]
}'
{code}

*Expected results:*

3. The response contains: 
* Code: 200
* The response contains 300 users objects

4. The response contains: 
* Code: 200
* The response contains 300 users objects, *starting with the second one* (the first user is skipped)

---

## API. User Controller. Filtering users by account type using different operators

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. INTERNAL account_type
"test1" user has e.g. UPSA account_type
"test2" user has e.g. SAML account_type

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2, Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for users with the INTERNAL account type
  Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "account_type",
      "operation": "EQ",
      "value": "INTERNAL"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "account_type",
      "operation": "NE",
      "value": "INTERNAL"
    }
5. Send the same request with "CNT" (contain) operation
 {
      "filter_key": "account_type",
      "operation": "CNT",
      "value": "SA"
    }
6. Send the same request with "IN" operation
 {
      "filter_key": "account_type",
      "operation": "IN",
      "value": "UPSA,SAML"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users with specified account type is displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with account type *not equal* to "INTERNAL" are displayed ("test1" and "test2" users are displayed)

5. The response contains: 
* Code: 200
* Users that have 'SA' value in account type are displayed ("test1" and "test2" users are displayed)

6. The response contains: 
* Code: 200
* Users that have 'UPSA,SAML' values in account type are displayed ("test1" and "test2" users are displayed)

---

## API. User Controller. Filtering users by instance role using different operators

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user has e.g. ADMINISTRATOR instance role
"test1" user has e.g. USER instance role

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2. Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for users with the USER instance role
  Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "instance_role",
      "operation": "EQ",
      "value": "USER"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "instance_role",
      "operation": "NE",
      "value": "USER"
    }
5. Send the same request with "CNT" (contain) operation
 {
      "filter_key": "instance_role",
      "operation": "CNT",
      "value": "MINI"
    }
6. Send the same request with "IN" operation
 {
      "filter_key": "instance_role",
      "operation": "IN",
      "value": "ADMINISTRATOR"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users with "USER" instance role are displayed ("test1" user is displayed)

4. The response contains: 
* Code: 200
* Users with instance role *not equal* to "USER" are displayed ("test" user is displayed)

5. The response contains: 
* Code: 200
* Users that have 'MINI' value in instance role are displayed ("test" user is displayed)

6. The response contains: 
* Code: 200
* Users that have 'ADMINISTRATOR' value in instance role are displayed ("test" user is displayed)

---

## API. User Controller. Filtering users by activity using different operators

*Preconditions:*

Admin user exists on the instance
There are several users on the instance:
"test" user is active (active is TRUE)
"test1" user is not active (active is FALSE)

*Steps:*

1. Login as Admin -> Go to "API Documentation" page
2. Navigate to "User Controller" -> POST/users/searches
3. Send the request to search for active users (active is TRUE)
    Request body example:
{code:java}
'{
  "offset": 0,
  "limit": 300,
  "sort": "string",
  "order": "ASC",
  "search_criteria": [
    {
      "filter_key": "active",
      "operation": "EQ",
      "value": "TRUE"
    }
  ]
}'
{code}
4. Send the same request with "NE" (NOT equal) operation
 {
      "filter_key": "active",
      "operation": "NE",
      "value": "TRUE"
    }

*Expected results:*

3. The response contains: 
* Code: 200
* Users with "active":"TRUE" field are displayed ("test" user is displayed)

4. The response contains: 
* Code: 200
* Users with activity *not equal* to 'TRUE' are displayed ("test1" user is displayed)

---

