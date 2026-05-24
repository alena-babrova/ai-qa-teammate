# Test cases: EPMRPP-91802 — [UI][QA][PERF][GA] Create user on Instance level. Part 2

**User story:** https://jiraeu.epam.com/browse/EPMRPP-91802

---

## Organizations. All Users page. "Create user" modal window layout (w/o 'Organizations and projects to invite')

*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option

*Expected results:*

3. "Create user" modal window is displayed and consists of:
 - "Create user" title
 - "Cross" icon button
 - "For security reasons, we recommend updating the password after the first login to the created account.
Keep your data safe and secure with a new personalized password." message
 - "Full name" text field marked with asterisk (required field) with "e.g. John Smith" placeholder 
 - "Email" text field marked with asterisk (required field) with "example@mail.com" placeholder + "Copy" icon
 - "Password" text field marked with asterisk (required field) with "Enter password" placeholder + "Copy" icon
"Minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter" text under "Password" field
 - "Provide Admin rights" checkbox (default state is unchecked)
 - "Cancel" button, enabled
 - "Create" button, disabled

---

## Organizations. All Users page. "Create" button behaviour in "Create user" modal window

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Click on "Create" button
# Enter valid values in "Full name", "Email" and "Password" fields
# Search for Organization A in 'Organization' field and confirm
# Remove the value from "Password" field

*Expected results:*

3. "Create user" modal window is displayed, "Create" button is disabled
4. Nothing happens, the form remains empty
5. -
6. Fields are not highlighted, there are no validation messages under the fields, "Create" button is enabled
7. "Password" field is highlighted in red, validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. Cancelling creating project using "Cancel" button

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field 
# Enter valid value in "Email" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm
# Click on "Cancel" button

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and user is not created, there is no new created user in the list of users, the number of users is not changed

---

## Organizations. All Users page. Cancelling creating user using "Cross" icon button

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field 
# Enter valid value in "Email" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm
# Click on "Cross" icon button of the modal

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and user is not created, there is no new created user in the list of users, the number of users is not changed

---

## Organizations. All Users page. Impossible to create user with invalid symbols for full name

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter invalid value in "Full name" field (e.g. User!)
# Enter valid value in "Email" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm

*Repeat test case when last symbol of full name is one of @#$%^&*()+=?<>:;*

*Expected results:*

3. "Create user" modal window is displayed 
4. "Full name" field is highlighted with red, "Full name may contain only Latin, numeric characters, symbols: hyphen, underscore, apostrophe, dot. Space is permitted (from 3 to 60 symbols)" validation message is displayed under the field, "Create" button is disabled
7. "Create user" modal window is still displayed, "Full name" field is still highlighted with red and has validation message, "Create" button is still disabled

---

## Organizations. All Users page. Impossible to create user without filling mandatory fields

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Observe "Create" button

*Expected results:*

3. "Create user" modal window is displayed 
4. "Create" button is disabled

---

## Organizations. All Users page. Possible to copy values from "Email" and "Password" fields

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Search for Organization A in 'Organization' field and confirm
# Enter valid value in "Email" field
# Click on "Copy" icon near "Email" field
# Go to any text editor -> Paste the value
# Go back to RP -> Enter valid value in "Password" field
# Click on "Copy" icon near "Password" field
# Go to any text editor -> Paste the value

*Expected results:*

3. "Create user" modal window is displayed 
6. The value is copied to the clipboard, "Tick" icon is displayed instead of "Copy" icon
7. Copied email is pasted successfully
8. - 
9. The value is copied to the clipboard, "Tick" icon is displayed instead of "Copy" icon
10. Copied password is pasted successfully

---

## Organizations. All Users page. "Copy" icon behaviour

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Search for Organization A in 'Organization' field and confirm
# Enter valid value in "Email" field
# Click on "Copy" icon near "Email" field
# Hover over "Tick" icon
# Wait 5 secs
# Hover over "Copy" icon

 *Repeat test case with "Copy" icon near "Password" field*

*Expected results:*

3. "Create user" modal window is displayed 
6. The value is copied to the clipboard, "Tick" icon is displayed instead of "Copy" icon
7. "Copied to clipboard" tooltip is displayed
8. "Tick" icon is changed to "Copy" icon
9. There is no tooltip

---

## Organizations. All Users page. "Eye" icon behaviour in "Password" field

*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter symbol in "Password" field
# Press and hold "Eye" icon clicked
# Release "Eye" icon click
# Remove symbol from "Password" field

*Expected results:*

3. "Create user" modal window is displayed 
4. 'Eye' icon appears in "Password" field, entered symbol is hidden in dot
5. Entered symbol is visible
6. Entered symbol is hidden in dot again
7. "Password" field is empty, there is no 'Eye' icon in the field

---

## Organizations. All Users page. Impossible to create user with invalid email

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter invalid value in "Email" field (e.g. "ab"c@epam.com)
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm

*Expected results:*

3. "Create user" modal window is displayed 
7. "Email" field is highlighted with red, "Email is incorrect. Please enter correct email" validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. Impossible to create user with invalid password

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter valid value in "Email" field
# Search for Organization A in 'Organization' field and confirm
# Enter invalid value in "Password" field (e.g. my_password)

*Expected results:*

7. "Password" field is highlighted with red, "Minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter" validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. Impossible to create user with already existing email on the instance

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created
# There is a user with email "test@epam.com" on the instance


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Search for Organization A in 'Organization' field and confirm
# Enter valid value in "Full name" field
# Enter email value from Preconditions in "Email" field (test@epam.com)
# Enter valid value in "Password" field
# Click on "Create" button

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is still displayed, "Entered email already exists in ReportPortal" system validation message is displayed in red bar

---

## Organizations. All Users page. Full name can have maximum 60 symbols length

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Email" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm
# Fill 61 symbols in "Full name" field (e.g. Tester_with_very_long_full_name_very_very_long_full_name_very)
# Remove cursor from the field
# Delete value from "Full name" field
# Paste any text with length more 60 symbols in "Full name" field

*Expected results:*

3. "Create user" modal window is displayed 
7. All 61 symbols are displayed in the field
8. "Full name" field is highlighted with red, "Full name may contain only Latin, numeric characters, symbols: hyphen, underscore, apostrophe, dot. Space is permitted (from 3 to 60 symbols)" validation message is displayed under the field, "Create" button is disabled
9. The field is not highlighted anymore, there is no validation message under the field, but "Create" button is disabled
10. The field is highlighted with red, "Full name may contain only Latin, numeric characters, symbols: hyphen, underscore, apostrophe, dot. Space is permitted (from 3 to 60 symbols)" validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. "Email" field doesn't have length limitation

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm
# Fill 129 symbols in "Email" field (e.g. 3v0Qw0yot7U8KL8iwt2uS4Sr9oy2S0cpGOlruVTdl4tZIhoLHqavOwdlVKQJKLKhdr2IxM0rP8IbIr0VLr8IWDvYfIJ0bICLmmddilswgF3PnSIK8OjWM48u@epam.com)
# Remove cursor from the field
# Delete value from "Email" field
# Paste any email with length more 128 symbols in "Email" field

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is still displayed, the field is not highlighted, there is no validation message under the field, but "Create" button is disabled
10. The modal window is still displayed, the field is not highlighted, there is no validation message under the field, "Create" button is enabled

---

## Organizations. All Users page. Password should be at least 8 symbols length

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter valid value in "Email" field
# Search for Organization A in 'Organization' field and confirm
# Enter 1 symbol in "Password" field
# Switch focus to another element (e.g., click out of the field)
# Enter 6 more symbols (7 in total) in "Password" field
# Switch focus to another element (e.g., click out of the field)
# Enter the 8th symbol in "Password" field
# Click on "Create" button

*Expected results:*

3. "Create user" modal window is displayed 
8. "Password" field is highlighted with red, "Minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter" validation message is displayed under the field, "Create" button is disabled
10. "Password" field is highlighted with red, validation message is displayed under the field, "Create" button is disabled 
11. "Password" field is not highlighted anymore, there is no validation message under the field, "Create" button is enabled
12. "Create user" modal window is closed, the user is created successfully

---

## Organizations. All Users page. Password can have maximum 256 symbols length

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter valid value in "Email" field
# Search for Organization A in 'Organization' field and confirm
# Fill 257 symbols in "Password" field (e.g. l_ojDoJBCib4495Q9cwammTKSQFt4tbhoLhZMd3OREYwZcB25Fly1nt3t1W5XN9LwALXrqjqX8ysopePlTI5XWsoXOuznCOyWKWOQbKQMMfyhnTbSq8gIMKKZeGkc44TL5vnuqGKMtZJuMmcKHampV2NR0KGjw9550RNYLpRo7yvRXzTtnoFcDXiAYP8pqMVXadKxO014NeipQxJb58MYbJBH8fccf1Eu9Vzic5VrTHswLuOnqCJuWC7XfW74ivd5)
# Remove cursor from the field
# Delete value from "Password" field
# Paste any text with length more 256 symbols in "Password" field

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is still displayed, "Password" field is highlighted with red, "Minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter" validation message is displayed under the field, "Create" button is disabled
9. The field is not highlighted anymore, there is no validation message under the field, but "Create" button is disabled
10. The modal window is still displayed, the field is highlighted with red, "Minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter" validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. Password should meet security requirements when creating user

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Full name" field
# Enter valid value in "Email" field
# Search for Organization A in 'Organization' field and confirm
# Enter value that meets security requirements (one uppercase letter, one lowercase letter, one number, one special character) in "Password" field (e.g. My_password1)
# Click on "Create" button

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed, the user is created successfully

---

## Organizations. All Users page. Only Latin symbols for full name are allowed

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in "Email" field
# Enter valid value in "Password" field
# Search for Organization A in 'Organization' field and confirm
# Enter value using Cyrillic symbols in "Full name" field (e.g. Вася)
# Remove cursor from the field

*Repeat test case with Chinese symbols, Vietnamese symbols, etc.*

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is still displayed, "Full name" field is highlighted with red, "Full name may contain only Latin, numeric characters, symbols: hyphen, underscore, apostrophe, dot. Space is permitted (from 3 to 60 symbols)" validation message is displayed under the field, "Create" button is disabled

---

## Organizations. All Users page. 'Organizations and projects to invite' section layout in 'Create user' modal window

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Observe 'Organizations and projects to invite' section
# Search for Organization A in 'Organization' field

*Expected results:*

3. 'Create user' modal window is displayed
4. 'Organizations and projects to invite' is present and consists of:
 - 'Organizations and projects to invite' title
 - "Add organizations and projects to specify where the invited user will have access" text under the title
 - 'Organization' field marked with asterisk (required field) with "Enter to select organization" placeholder text
 - 'Project (optional)' field without placeholder text, disabled by default unless 'Organization' is filled
 - Tick button
 - 'Set as Organization Manager' checkbox
 - 'Can edit the Project' checkbox, disabled by default unless 'Organization' is filled
 - 'i' icon on the right of 'Can edit the Project' checkbox with "By default, invited users receive 'View only' permissions. Users with 'Can edit' permissions can modify the project and all its data (report launches, change defect types, etc.)." tooltip text

5. Following changes occur:
* Cross icon appears in 'Organization' field
* In 'Project (optional)' appears "Enter to select project" placeholder text
* 'Project (optional)' field becomes enabled

---

## Organizations. All Users page. Cancelling creating user clicking outside of the modal window

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Click outside of the modal window
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose and confirm Organization A in 'Organization' dropdown
# Click outside of the modal window

*Expected results:*

3. "Create user" modal window is displayed 
4. "Create user" modal window is closed and user is not created, there is no new created user in the list of users, the number of users is not changed
5. "Create user" modal window is displayed 
10. "Create user" modal window is not closed and still displayed 

---

## Organizations. All Users page. Impossible to create user if organization is not chosen

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Observe "Create" button

*Expected results:*

3. "Create user" modal window is displayed 
7. "Create" button is disabled

---

## Organizations. All Users page. Create user with assignment to 1 organization

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose and confirm Organization A in 'Organization' dropdown
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A
# Verify newly created user is not listed on 'Project Team' for Project 1

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
9. Newly created user is shown in the list of all users, the number of users is increased by 1
10. Newly created user has type = INTERNAL
11. Newly created user is shown among Organization A users
12. Newly created user is not shown in the list of Project 1 users

---

## Organizations. All Users page. Create user with assignment to 1 organization and 1 project

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' and 'Project 2' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown
# Choose Project 1 in 'Project (optional)' dropdown and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A
# Verify newly created user is listed on 'Project Team' for Project 1
# Verify newly created user is not listed on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is shown in the list of all users, the number of users is increased by 1
11. Newly created user has type = INTERNAL
12. Newly created user is shown among Organization A users
13. Newly created user is shown among Project 1 users
14. Newly created user is not shown in the list of Project 2 users

---

## Organizations. All Users page. Create user with assignment to 1 organization and multiple projects

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose and confirm Organization A in 'Organization' dropdown
# Choose Project 1 in 'Project (optional)' dropdown and confirm
# Click "+ Add Project" button, choose Project 3 and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A
# Verify newly created user is listed on 'Project Team' for Project 1 and Project 3
# Verify newly created user is not listed on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown in the list of all users, the number of users is increased by 1
12. Newly created user has type = INTERNAL
13. Newly created user is shown among Organization A users
14. Newly created user is shown among Project 1 and Project 3 users
15. Newly created user is not shown among Project 2 users

---

## Organizations. All Users page. Admin can assign new user to any organization regardless of being assigned to it themselves

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' and 'Organization B' are created
# Admin is assigned to Organization A only


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose both Organization A and Organization B in 'Organization' dropdown and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A and Organization B

*Expected results:*

3. "Create user" modal window is displayed 
7. Admin is able to choose both Organization A and Organization B 
8. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
9. Newly created user is shown in the list of all users, the number of users is increased by 1
10. Newly created user has type = INTERNAL
11. Newly created user is shown in the both lists of organization users, Organization A and Organization B

---

## Organizations. All Users page. Admin can assign new user only to the project from chosen organization

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' and 'Organization B' are created
# 'Organization A' has 'Project 1' in it and 'Organization B' — 'Project 2'


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown
# Observe list of available projects in 'Project (optional)'
# Choose Project 1 and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A
# Verify newly created user is listed on 'Project Team' for Project 1

*Expected results:*

3. "Create user" modal window is displayed 
8. Only Project 1 is listed in the search
9. -
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown in the list of all users, the number of users is increased by 1
12. Newly created user has type = INTERNAL
13. Newly created user is shown among Organization A users
14. Newly created user is shown among Project 1 users

---

## Organizations. All Users page. Create user with assignment to multiple organizations without assigning to projects

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A 'Organization' dropdown and confirm
# Click "+ Add Organization" button, choose Organization B 'Organization' dropdown and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A and Organization B
# Verify newly created user is not listed on 'Project Team' for Project 1, Project 2, Project 3, Project 4, Project 5, Project 6

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is shown in the list of all users, the number of users is increased by 1
11. Newly created user has type = INTERNAL
12. Newly created user is shown among Organization A and Organization B users
13. Newly created user is not shown in the lists of projects users

---

## Organizations. All Users page. Create user with assignment to multiple organizations and only 1 project for each

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A  in 'Organization' dropdown, choose Project 1 in 'Project (optional)' dropdown and confirm
# Click "+Add Organization" button, choose Organization B in 'Organization' dropdown, choose Project 4 in 'Project (optional)' dropdown and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A and Organization B
# Verify newly created user is listed on 'Project Team' for Project 1 and Project 4

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is shown in the list of all users, the number of users is increased by 1
11. Newly created user has type = INTERNAL
12. Newly created user is shown among Organization A and Organization B users
13. Newly created user is shown among Project 1 and Project 4 users

---

## Organizations. All Users page. Create user with assignment to multiple organizations and multiple projects for each

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown and choose Project 1 in 'Project (optional)' dropdown
# Click "+ Add Project" button and choose Project 3 for Organization A 
# Click "+ Add Organization", choose Organization B, choose Project 4 and Project 6 and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A and Organization B
# Verify newly created user is listed on 'Project Team' for Project 1, Project 3, Project 4, Project 6

*Expected results:*

3. "Create user" modal window is displayed 
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown in the list of all users, the number of users is increased by 1
12. Newly created user has type = INTERNAL
13. Newly created user is shown among Organization A and Organization B users
14. Newly created user is shown in specified lists of project users

---

## Organizations. All Users page. Create user with assignment to multiple organizations and different amount of projects for each

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created
# 'Organization C' with 'Project 7', 'Project 8' and 'Project 9' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown, choose Project 1 in 'Project (optional)' dropdown, then add Project 2 and Project 3, confirming them all in the process
# Click "+ Add Organization", choose Organization B in 'Organization' dropdown, choose Project 4 in 'Project (optional)' dropdown and confirm
#  Click "+ Add Organization", choose Organization C and confirm
# Click on "Create" button
# Search for the newly created user
# Search for the newly created user in DB > reportportal > Schemas > public > Tables > users
# Verify newly created user is listed on 'Organizations Users' for Organization A and Organization B
# Verify newly created user is listed on 'Project Team' for Project 1, Project 2, Project 3 and Project 4

*Expected results:*

3. "Create user" modal window is displayed 
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown in the list of all users, the number of users is increased by 1
12. Newly created user has type = INTERNAL
13. Newly created user is shown among Organization A, Organization B and Organization C users
14. Newly created user is shown among Project 1, Project 2, Project 3 and Project 4 users

---

## Organizations. All Users page. Notification to email after user is created

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose existing organization in 'Organization' dropdown and choose Project 1 in 'Project (optional)' dropdown and confirm
# Click on "Create" button
# Navigate to the specified email inbox
# Open then sent email and verify its contents

*Expected results:*

3. "Create user" modal window is displayed 
9. Email has been sent to the specified email
10. Email template contains following content:
- "ReportPortal.io" at the top left above the banner
- "Welcome to ReportPortal!" letter title welcoming
- "You have been successfully registered on ReportPortal.
Please, use the following information to login:
Email: <email_from_above>
Password: <password_from_above>" text
- "Login" button
- "New to ReportPortal? Check out the ReportPortal Tutorial." text, where "ReportPortal Tutorial" is a hyperlink
- "Thanks,
ReportPortal.io Team" text
- "Keep in touch with us:" section with GitHub, X (formerly Twitter), YoutTube and Slack icons-hyperlinks
- "ReportPortal Notification Center" section, where all instances of using RP name are written as "ReportPortal"

---

## GA. Instance level. All Users page. GA is sent by clicking on the "Create user" button

*Steps*:

tions:*
# 'SSO users only' = OFF
# Analytics is ON on the instance
# 'Organization A' with 'Project 1' and 'Project 2' is created
# Browser Dev tools are opened

*Steps*:
# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. "Create user" modal window is displayed 
4. The collect request contains the following data:
instanceID
version
uid
timestamp
category: all_users
place: all_users_page
element_name: create_user

---

## GA. Instance level. All Users page. GA is sent by clicking on the "Create" button in 'Create user' modal window ('Provide Admin rights' = false)

*Steps*:

tions:*
# 'SSO users only' = OFF
# Analytics is ON on the instance
# 'Organization A' with 'Project 1' and 'Project 2' is created
# Browser Dev tools are opened

*Steps*:
# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose existing organization in 'Organization' dropdown
# Click on "Create" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
9. The collect request contains the following data:
 * instanceID
 * version
 * uid
 * timestamp
 * category: all_users
 * place: all_users_page
 * element_name: create
 * modal: create_user
 * condition: no_provide_admin_rights

---

## GA. Instance level. All Users page. GA is sent by clicking on the "Create" button in 'Create user' modal window ('Provide Admin rights' = true)

*Steps*:

tions:*
# 'SSO users only' = OFF
# Analytics is ON on the instance
# 'Organization A' with 'Project 1' and 'Project 2' is created
# Browser Dev tools are opened

*Steps*:
# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Tick 'Provide Admin rights' checkbox
# Choose existing organization in 'Organization' dropdown
# Click on "Create" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. The collect request contains the following data:
 * instanceID
  * version
 * uid
 * timestamp
 * category: all_users
 * place: all_users_page
 * element_name: create
 * modal: create_user
 * condition: provide_admin_rights

---

## GA. Instance level. All Users page. GA is not sent by clicking on the "Create user" button when GA OFF

*Steps*:

tions:*
# 'SSO users only' = OFF
# Analytics is OFF on the instance
# 'Organization A' with 'Project 1' and 'Project 2' is created
# Browser Dev tools are opened

*Steps*:
# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. "Create user" modal window is displayed 
4. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools

---

## GA. Instance level. All Users page. GA is not sent by clicking on the "Create" button in 'Create user' modal window when GA OFF

*Steps*:

tions:*
# 'SSO users only' = OFF
# Analytics is OFF on the instance
# 'Organization A' with 'Project 1' and 'Project 2' is created
# Browser Dev tools are opened

*Steps*:
# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose existing organization in 'Organization' dropdown
# Click on "Create" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
9. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools

---

## Organizations. All Users page. Create regular user with assignment to an organization as Manager

{*}Preconditions{*}:

 # 'SSO users only' = OFF
 # 'Organization A' with 'Project 1' is created
 # 'Organization B' with 'Project 2' is created


{*}Steps{*}:

 # Login to RP as Admin
 # Go to "All Users" page
 # Click on "Meatball" menu -> Select "Create user" option
 # Enter valid value in 'Full name' field
 # Enter valid value in 'Email' field
 # Enter valid value in 'Password' field
 # Choose Organization A in 'Organization' dropdown, Project 1 in 'Project (optional)', tick 'Set as Organization Manager' and confirm
 # Click "+ Add Organization"
 # Choose Organization B in 'Organization' dropdown, Project 2 in 'Project (optional)', confirm and change Organization role to 'Manager' in the dropdown
 # Click on "Create" button
 # Verify newly created user on 'Organizations Users' for Organization A
 # Verify newly created user on 'Project Team' for Project 1
 # Verify newly created user on 'Organizations Users' for Organization B
 # Verify newly created user on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown as Manager in Organization A
12. Newly created user is shown as Editor in Project 1
13. Newly created user is shown as Manager in Organization B
14. Newly created user is shown as Editor in Project 2

---

## Organizations. All Users page. Create regular user with assignment to an organization as Member

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created
# 'Organization B' with 'Project 2' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown, Project 1 in 'Project (optional)'
# Click "+ Add Organization", choose Organization B in 'Organization' dropdown, Project 2 in 'Project (optional)', tick 'Can edit the Project' and confirm
# Click on "Create" button
# Verify newly created user on 'Organizations Users' for Organization A
# Verify newly created user on 'Project Team' for Project 1
# Verify newly created user on 'Organizations Users' for Organization B
# Verify newly created user on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is shown as Member in Organization A
11. Newly created user is shown as Viewer in Project 1
12. Newly created user is shown as Member in Organization B
13. Newly created user is shown as Editor in Project 2

---

## Organizations. All Users page. Create admin user with assignment to an organization as Manager

{*}Preconditions{*}:

 # 'SSO users only' = OFF
 # 'Organization A' with 'Project 1' is created
 # 'Organization B' with 'Project 2' is created


{*}Steps{*}:

 # Login to RP as Admin
 # Go to "All Users" page
 # Click on "Meatball" menu -> Select "Create user" option
 # Enter valid value in 'Full name' field
 # Enter valid value in 'Email' field
 # Enter valid value in 'Password' field
 # Choose Organization A in 'Organization' dropdown, Project 1 in 'Project (optional)', tick 'Set as Organization Manager' and confirm
 # Click "+ Add Organization"
 # Choose Organization B in 'Organization' dropdown, Project 2 in 'Project (optional)', confirm and change Organization role to 'Manager' in the dropdown
 # Tick 'Provide Admin rights' and click on "Create"
 # Verify newly created user on 'Organizations Users' for Organization A
 # Verify newly created user on 'Project Team' for Project 1
 # Verify newly created user on 'Organizations Users' for Organization B
 # Verify newly created user on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
10. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
11. Newly created user is shown as Manager in Organization A
12. Newly created user is shown as Editor in Project 1
13. Newly created user is shown as Manager in Organization B
14. Newly created user is shown as Editor in Project 2

---

## Organizations. All Users page. Create admin user with assignment to an organization as Member

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created
# 'Organization B' with 'Project 2' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown, Project 1 in 'Project (optional)'
# Click "+ Add Organization", choose Organization B in 'Organization' dropdown, Project 2 in 'Project (optional)', tick 'Can edit the Project' and confirm
# Tick 'Provide Admin rights' and click on "Create"
# Verify newly created user on 'Organizations Users' for Organization A
# Verify newly created user on 'Project Team' for Project 1
# Verify newly created user on 'Organizations Users' for Organization B
# Verify newly created user on 'Project Team' for Project 2

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is shown as Member in Organization A
11. Newly created user is shown as Viewer in Project 1
12. Newly created user is shown as Member in Organization B
13. Newly created user is shown as Editor in Project 2

---

## Organizations. All Users page. Roles for new user's assignments can be changed in the process of creation

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' and 'Project 2' is created
# 'Organization B' with 'Project 3' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown
# Choose Project 1 in 'Project (optional)' dropdown and confirm
# Click "+ Add Project", choose Project 2 and confirm
# Click "+ Add Organization", choose Organization A, Project 3 and confirm
# Observe dropdown values for Organizations and Projects
# Make following changes in the dropdowns for Organizations and Projects:
#* In Project 2 set 'Can edit'
#* In Organization B set 'Manager'
# Click on "Create" button
# Verify newly created user's roles in:
#* Organization A
#* Project 1
#* Project 2
#* Organization B
#* Project 3

*Expected results:*

3. "Create user" modal window is displayed 
11. Following values are set: Organization A = Member, Project 1 and Project 2 = View only, Organization B = Member, Project 3 = View only
12. Values that have been changed: Project 2 = Can edit, Organization B = Manager, Project 3 = Can edit (dropdown is disabled for Project 3 with "Managers can edit all projects within the organization" tooltip on hover)
13. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
14. Newly created user has following roles:
* Organization A = Member
* Project 1 = Viewer
* Project 2 = Editor
* Organization B = Manager
* Project 3 = Editor

---

## Organizations. All Users page. Controls of chosen for assignment organizations and projects during user creation

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown and choose Project 1 in 'Project (optional)' dropdown
# Click "+ Add Project" button and choose Project 3 for Organization A 
# Click "+ Add Organization", choose Organization B, choose Project 4 and Project 6 and confirm
# Click cross icon for Project 1 in Organization A and observe the screen
# Click cross icon for Project 3 in Organization A and observe the screen
# Click cross icon for Organization A and observe the screen
# Click cross icon for Organization B and observe the screen
# Choose Organization A in 'Organization' dropdown and choose Project 1 in 'Project (optional)' dropdown
# Click cross icon for 'Project (optional)'
# Click cross icon for 'Organization'

*Expected results:*

3. "Create user" modal window is displayed 
10. Project 1 is removed from Organization A block, only Organization A itself and Project 3 remain
11. Project 3 is removed from Organization A block, only Organization A itself remains
12. Organization A block is removed, Organization B block with its projects remains
13. Organization B block is removed, empty 'Organization' and 'Project (optional)' dropdowns are present
14. Value in 'Project (optional)' is cleared out
15. Value in 'Organization' is cleared out

---

## Organizations. All Users page. Cancelling creating user by pressing Escape key

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose and confirm Organization A in 'Organization' dropdown
# Press Escape button on the keyboard

*Expected results:*

3. "Create user" modal window is displayed 
8. "Create user" modal window is closed and user is not created, there is no new created user in the list of users, the number of users is not changed

---

## Organizations. All Users page. Verify that created user is not assigned to the projects in the organization that weren't chosen

*Preconditions*:

# 'SSO users only' = OFF
# 'Organization A' with 'Project 1', 'Project 2' and 'Project 3' is created
# 'Organization B' with 'Project 4', 'Project 5' and 'Project 6' is created


*Steps*:

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu -> Select "Create user" option
# Enter valid value in 'Full name' field 
# Enter valid value in 'Email' field
# Enter valid value in 'Password' field
# Choose Organization A in 'Organization' dropdown, choose Project 1 in 'Project (optional)' dropdown, then add Project 3 and confirm them all in the process
# Click "+Add Organization" button, choose Organization B in 'Organization' dropdown, choose Project 4 in 'Project (optional)' dropdown and confirm
# Click on "Create" button
# Verify newly created user is not listed on 'Project Team' for Project 2, Project 5, Project 6

*Expected results:*

3. "Create user" modal window is displayed 
9. "Create user" modal window is closed and confirmation message 'User <full_name> has been created and assigned successfully' is shown
10. Newly created user is not shown in specified lists of project users

---

## Organizations. All Users page. "Create user" modal window. Not possible to create user without organization assignment

{*}Preconditions{*}:

 # 'SSO users only' = OFF
 # 'Organization A' with 'Project 1' is created


{*}Steps{*}:

 # Login to RP as Admin
 # Go to "All Users" page
 # Click on "Meatball" menu -> Select "Create user" option
 # Click on "Create" button
 # Enter valid values in "Full name", "Email" and "Password" fields
 # Observe "Create" button
 # Enter the 'Organization A' into the field and add the value from the autocomplete dropdown -> verify the "Create" button 
 # Click the 'tick' button and verify the "Create" button

*Expected results:*

6. "Create" button is disabled
7. "Create" button is disabled
8. "Create" button is enabled

