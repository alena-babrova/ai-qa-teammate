# Test cases: EPMRPP-93348 — [WS][QA][Perf] Implement end-point for unassigning user from organization

**User story:** https://jiraeu.epam.com/browse/EPMRPP-93348

---

## API. Organization User. Admin unassigns another user from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. 'Organization_1' has 'Project A' and 'Project B'
3. User_1 is assigned to the 'Organization_1' and all its projects
4. User_1 has user type=non-UPSA
5. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager unassigns another user from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. 'Organization_1' has 'Project A' and 'Project B'
3. User_1 is assigned to the 'Organization_1' and all its projects
4. User_1 has user type=non-UPSA
5. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member unassigns himself from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Member user is assigned to the 'Organization_1' and all its projects
4. Member has user type=non-UPSA
5. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Member user from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Admin unassigns himself from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Admin user is assigned to the 'Organization_1' and all its projects
4. Admin has user type=non-UPSA
5. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Admin user from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. Admin user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager unassigns himself from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Manager user is assigned to the 'Organization_1' and all its projects
4. Manager has user type=non-UPSA
5. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Manager user from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the profile page and in the sidebar menu

---

## API. Organization User. Admin cannot unassign UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. User_1 has type 'UPSA' and is assigned to the 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager cannot unassign UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. User_1 has type 'UPSA' and is assigned to the 'Organization_1'
3. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Admin with UPSA type cannot unassign himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. Admin has type 'UPSA' and is assigned to the 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Admin from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager with UPSA type cannot unassign himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. Manager has type 'UPSA' and is assigned to the 'Organization_1'
3. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Manager from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member with UPSA type cannot unassign himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. Member has type 'UPSA' and is assigned to the 'Organization_1'
3. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Member from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member cannot unassign another user from INTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'internal'
2. User_1 and any Member user are assigned to the 'Organization_1'
3. User_1 has user type=non-UPSA
4. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member cannot unassign UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. User_1 and any Member user are assigned to the 'Organization_1'
3. User_1 has user type=UPSA
4. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Admin unassigns non-UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. 'Organization_1' has 'Project A' and 'Project B'
3. User_1 is assigned to the 'Organization_1' and all its projects
4. User_1 has user type=non-UPSA
5. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager unassigns non-UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. 'Organization_1' has 'Project A' and 'Project B'
3. User_1 is assigned to the 'Organization_1' and all its projects
4. User_1 has user type=non-UPSA
5. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member cannot unassign non-UPSA user from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. User_1 and any Member user are assigned to the 'Organization_1'
3. User_1 has user type=non-UPSA
4. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Admin with non-UPSA type unassigns himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Admin is assigned to the 'Organization_1' and all its projects
4. Admin has type 'non-UPSA'
5. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Admin from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager with non-UPSA type unassigns himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Manager is assigned to the 'Organization_1' and all its projects
4. Manager has type 'non-UPSA'
5. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Manager from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member with non-UPSA type unassigns himself from EXTERNAL organization

*Preconditions:*

1. 'Organization_1' has type 'external'
2. 'Organization_1' has 'Project A' and 'Project B'
3. Member is assigned to the 'Organization_1' and all its projects
4. Member has type 'non-UPSA'
5. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Member from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response code: 204 No Content
2. The user is unassigned from 'Organization_1' and all associated projects,
   the organization is not displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Admin cannot unassign owner user from PERSONAL organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is the owner of the 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions. User <user_id> cannot be unassigned from personal organization" message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager cannot unassign owner user from PERSONAL organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is the owner of the 'Organization_1'
3. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions. User <user_id> cannot be unassigned from personal organization" message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member cannot unassign owner user from PERSONAL organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is the owner of the 'Organization_1'
3. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Login as User_1 and verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions." message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Not possible to unassign user from organization when authentication token doesn't exist

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is assigned to 'Organization_1'

*Steps:*

1. For the request in Postman fill the field 'Token', in Authorization tab, with non-existent token
2. Send the request via Postman DELETE /organizations/{org_id}/users/{user_id} and verify the response

*Expected results:*

2. The response contains:
   - Code: 401
   - "Invalid access token" message

---

## API. Organization User. Not possible to unassign user from organization when authentication token is invalid

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is assigned to 'Organization_1'
3. Admin user has a token

*Steps:*

1. Login to RP -> Go to "Profile" page
2. Revoke generated token
3. For the request in Postman fill the field 'Token', in Authorization tab, with revoked token
4. Send the request via Postman DELETE /organizations/{org_id}/users/{user_id} and verify the response

*Expected results:*

4. The response contains:
   - Code: 401
   - "Invalid access token" message

---

## API. Organization User. Not possible to unassign user from organization with invalid 'org_id' value

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is assigned to 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 with *invalid 'org_id' value*:
   DELETE /organizations/{xyz}/users/{user_id}
   and verify the response

*Expected results:*

1. Response code: 400 Bad Request

---

## API. Organization User. Not possible to unassign user from organization with invalid 'user_id' value

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. User_1 is assigned to 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 with *invalid 'user_id' value*:
   DELETE /organizations/{org_id}/users/{xyz}
   and verify the response

*Expected results:*

1. Response code: 400 Bad Request

---

## API. Organization User. Not possible to unassign user from non-existent organization

*Preconditions:*

1. User_1 exists on the instance
2. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete User_1 from *non-existent 'org_id' value*:
   DELETE /organizations/{non-existent_organization_id}/users/{user_id}
   and verify the response

*Expected results:*

1. The response contains:
   - Code: 404
   - "'User <user_id> assignment' not found. Did you use correct ID?" message

---

## API. Organization User. Not possible to unassign non-existent user from organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete *non-existent user* from the Organization:
   DELETE /organizations/{org_id}/users/<non-existent_user_id>
   and verify the response

*Expected results:*

1. The response contains:
   - Code: 404
   - "'User <non-existent_user_id> assignment' not found. Did you use correct ID?" message

---

## API. Organization User. Admin cannot unassign himself from PERSONAL organization if he is owner of the organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. Admin is the owner of the 'Organization_1'
3. Admin user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Admin from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions. User <user_id> cannot be unassigned from personal organization" message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Member cannot unassign himself from PERSONAL organization if he is owner of the organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. Member is the owner of the 'Organization_1'
3. Member user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Member from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions. User <user_id> cannot be unassigned from personal organization" message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu

---

## API. Organization User. Manager cannot unassign himself from PERSONAL organization if he is owner of the organization

*Preconditions:*

1. 'Organization_1' has type 'personal'
2. Manager is the owner of the 'Organization_1'
3. Manager user is logged in

*Steps:*

1. Navigate to Organizations User Controller ->
   Send the request to delete Manager from the 'Organization_1':
   DELETE /organizations/{org_id}/users/{user_id}
   and verify the response
2. Verify the list of available organizations

*Expected results:*

1. Response:
   - Code: 403 Forbidden
   - "You do not have enough permissions. User <user_id> cannot be unassigned from personal organization" message
2. The user is not unassigned from 'Organization_1',
   the organization is displayed in the 'Assignments' list on the Profile page and in the sidebar menu
