# Test cases: EPMRPP-97027 — [WS][QA*] Implement end-point for getting user avatar

**User story:** https://jiraeu.epam.com/browse/EPMRPP-97027

---

## API. File Storage Controller. End-points GET/v1/data/photo and GET/v1/data/{projectName}/userphoto are deprecated

*Preconditions:*

* 
1. ReportPortal instance is deployed with version 24.2 and lower
2. User is on the API page

*Steps:*

1. Go to "API Documentation" page -> Navigate to "File Storage Controller"
 2. Observe GET/v1/data/photo and GET/v1/data/{projectName}/userphoto end-points
 3. Upgrade version 25.2 of RP
 4. Log in -> Go to "API Documentation"
 5. Navigate to "File Storage Controlle"
 6. Try to find GET/v1/data/photo and GET/v1/data/{projectName}/userphoto end-points

*Expected results:*

2. GET/v1/data/photo and GET/v1/data/{projectName}/userphoto end-points are displayed
6. GET/v1/data/photo and GET/v1/data/{projectName}/userphoto end-points are deprecated and crossed out in the File Storage Controller

---

## API. User Controller. Impossible to get user avatar when authentication token doesn't exist

*Preconditions:*

# User has an avatar
# Authentication token doesn't exist

*Steps:*

# For the request in Postman fill the field 'Token', in Authorization tab, with non-existent token
# Send the request via Postman GET/users/{user_id}/avatar
# Verify the response

*Expected results:*

2. Request is sent 
3. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Impossible to get user avatar when authentication token is revoked

*Preconditions:*

# User has an avatar
# Authentication token exists

*Steps:*

# Login to RP -> Go to "Profile" page
# Revoke generated token
# For the request in Postman fill the field 'Token', in Authorization tab, with revoked token
# Send the request via Postman GET/users/{user_id}/avatar
# Verify the response

*Expected results:*

4. Request is sent 
5. The response contains: 
* Code: 401
* "Invalid access token" message

---

## API. User Controller. Impossible to get user avatar with invalid user ID

*Steps:*

# Go to "API Documentation" page -> Navigate to "User Controller" -> GET/users/{user_id}/avatar
# Fill 'user_id' with invalid user ID (e.g. letters)
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 400
* "Bad Request" message

---

## API. User Controller. Impossible to get user avatar with non-existent user ID

*Steps:*

# Go to "API Documentation" page -> Navigate to "User Controller" -> GET/users/{user_id}/avatar
# Fill 'user_id' with non-existent user ID
# Send request 
# Verify the response

*Expected results:*

3. Request is sent 
4. The response contains: 
* Code: 404
* "User '<user_id>' not found." message

---

## API. User Controller. Admin user can get any users avatar

*Preconditions:*

# There are two users on the instance (Admin and non-Admin)
# Users have avatars

*Steps:*

# Login as Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> GET/users/{user_id}/avatar
# Fill 'user_id' with Admin's ID
# Send request 
# Verify the response
# Fill 'user_id' with non-Admin's ID
# Send request 
# Verify the response

*Expected results:*

4. Request is sent 
5. The response contains: 
* Code: 200
* "Avatar retrieved successfully" message

7. Request is sent 
8. The response contains: 
* Code: 200
* "Avatar retrieved successfully" message

---

## API. User Controller. Non-Admin user can get any users avatar

*Preconditions:*

# There are two users on the instance (Admin and non-Admin)
# Users have avatars

*Steps:*

# Login as non-Admin -> Go to "API Documentation" page
# Navigate to "User Controller" -> GET/users/{user_id}/avatar
# Fill 'user_id' with non-Admin's ID
# Send request 
# Verify the response
# Fill 'user_id' with Admin's ID
# Send request 
# Verify the response

*Expected results:*

4. Request is sent 
5. The response contains: 
* Code: 200
* "Avatar retrieved successfully" message

7. Request is sent 
8. The response contains: 
* Code: 200
* "Avatar retrieved successfully" message

---

## API. User Controller. Possible to get user avatars of original and minimized sizes

*Preconditions:*

# User has an avatar

*Steps:*

# Login as User -> Go to "API Documentation" page
# Navigate to "User Controller" -> GET/users/{user_id}/avatar
# Fill 'user_id' with User's ID
# Send request 
# Check size of the avatar
# Change "false" value to "true" value in "thumbnail" parameter
# Send request 
# Check size of the avatar

*Expected results:*

4. Request is sent 
5. The size is equal to the original file (not minimized)
7. Request is sent 
8. The size is minimized

---

