# Test cases: EPMRPP-105682 — [UI][QA] User is assigned to org and project after following invitation link

**User story:** https://jiraeu.epam.com/browse/EPMRPP-105682

---

## Project Team. Invite User. Activate the invitation link for user with 'View only' permissions from the email

*Preconditions:*

# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Any Email integration is configured (Global or Project)
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field
# Click on "Invite" button
# Open email client -> open the invitation email -> click on the invitation link
# Fill in the required fields with valid data -> click 'Register' button

*Expected results:*

5. The user is redirected to the registration page
6. The user is logged in successfully. The user is assigned to Organization_A as Member and to Project_1 with 'View only' permissions (Viewer)

---

## Project Team. Invite User. Activate the invitation link for user with 'Can edit' permissions from the email

*Preconditions:*

# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Any Email integration is configured (Global or Project)
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field 
# Check the 'Can edit the Project' checkbox -> Click on "Invite" button
# Open email client -> open the invitation email -> click on the invitation link
# Fill in the required fields with valid data -> click 'Register' button

*Expected results:*

5. The user is redirected to the registration page
6. The user is logged in successfully. The user is assigned to Organization_A as Member and to Project_1 with 'Can edit' permissions (Editor)

---

## Project Team. Invite User. Activate the invitation link copied from the 'Invitation link' field for user with 'View only' permissions

*Preconditions:*

# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field
# Click on "Invite" button
# Copy the link from the 'Invitation link' field -> log out -> paste the link in a browser's address bar -> click 'Enter'
# Fill in the required fields with valid data -> click 'Register' button

*Expected results:*

5. The user is redirected to the registration page
6. The user is logged in successfully. The user is assigned to Organization_A as Member and to Project_1 with 'View only' permissions (Viewer)

---

## Project Team. Invite User. Activate the invitation link copied from the 'Invitation link' field for user with 'Can edit' permissions

*Preconditions:*

# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field
# Check the 'Can edit the Project' checkbox -> Click on "Invite" button
# Copy the link from the 'Invitation link' field -> log out -> paste the link in a browser's address bar -> click 'Enter'
# Fill in the required fields with valid data -> click 'Register' button

*Expected results:*

5. The user is redirected to the registration page
6. The user is logged in successfully. The user is assigned to Organization_A as Member and to Project_1 with 'Can edit' permissions (Editor)

---

## [TBD] Project Team. Invite User. The invitation link is expired after 24 hours by default

*Preconditions:*

# The instance is deployed with default parameters
# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field
# Click on "Invite" button
# Copy the link from the 'Invitation link' field -> Log out
# Wait for 24 hours
# Paste the link in a browser's address bar -> click 'Enter'

*Expected results:*

7. The user is not redirected to the registration page

---

## Project Team. Invite User. Not possible to activate the invitation link twice

*Preconditions:*

# The instance is deployed with default parameters
# Instance invitation settings toggle 'SSO users only' is OFF
# Organization_A exists with Project_1 assigned to it
# Admin/Manager/Member-editor User_1 is assigned to the organization and project from above
# User_2 with email 'user.2@mail.com' doesn't have RP account yet
# User_1 is logged in

*Steps:*

# Navigate to 'Project Team' page
# Click "Invite user" button
# Enter the 'user.2@mail.com' email in the 'Email' field
# Click on "Invite" button
# Copy the link from the 'Invitation link' field -> log out
# Paste the link in a browser's address bar -> click 'Enter'
# Fill in all the required fields and register
# Logout and paste the already used link in a browser's address bar -> click 'Enter'

*Expected results:*

7. The user is registered and logged in
8. The page is opened and the text is displayed
"Oops,
this invitation has expired or already used
Visit [ReportPortal.io|http://reportportal.io/]
or [Log In|https://demo.reportportal.io/] again" - with the links to ReportPortal.io and ReportPortal instance accordingly

---

## Organizations. E-mail content for user registration

*Preconditions:*

# User received "User registration confirmation" email

*Steps:*

# Open the email, verify the email subject
# Verify the email content
# Click "Get Started" link

*Expected results:*

# "User registration confirmation" subject is displayed
# Text - "Welcome to Report Portal!
You’ve been invited to join ReportPortal.
Click the link below to create your account and get started."
Link "Get Started"
Text - "New to Report Portal? Check out the [ReportPortal Tutorial|https://qa-tk.notifications.epam.com/track-e?e=1mF%2fK08HNwH8pP6XFHIjay8sH9Uhox%2fI8My9uvEztTgyPKOrodiLjL9bRxQTy6FsknDdzZULIqWq8IzqtZKxdi1AHCLpKams1BQteIgIelpAMDeTIEIheEsaLlpUsq1qECCa4TXVWM8YDSM1Z%2f%2b5s8JfpWcemqC1%2bpsNEZaGoC%2bifi9Rt4ZK9uciHvcnlpC584L%2f60rIh%2fX5UKWtQZn4qLnL4pOUsJeD64x5ZuOG8keFTQwUEd9F26uKHs2LyUM8a3%2bWe%2fjSDtmuxov3HMoaMq1bEoe7H8B1ieD8%2bY1VVVtan7mjI99ARDE01FiFkxglA3%2beUy0wgjYbJ2tOtp80o9mk5Dn8TrX0%2fgWjIdSzgFffUuJmHAdLynFTKUhryXbM]{color:#777777}.{color:#172b4d} 
Thanks,
ReportPortal.io Team" with the link to the user guide
# User is redirected to the ReportPortal registration form

---

## Organizations. Registration form layout

*Preconditions:*

# User received "User registration confirmation" email

*Steps:*

# Open the email
# Click "Get Started" link

*Expected results:*

2. Registration form is opened with the following:
* Left side of the page contains "It only takes a couple of minutes to get started" text
* Right side of the page contains:
** "Welcome,
create your account" title
** "Full name" field with "Enter Full Name" placeholder
"Names must be 3-60 characters, using only Latin or Cyrillic letters, numbers, spaces, dots, hyphens, underscores, and apostrophes." hint under the field
** "Email" field with prefilled email from the invitation link (disabled)
** Password field with "Create Password" placeholder
"Password must include a minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter." hint under the field
** "Confirm Password" field with "Confirm Password" placeholder
** "Register" button

---

## Organizations. "Full Name" field validation

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill all fields except for "Full Name" field with valid data
# Fill "Full Name" with the value which doesn't satisfy the following conditions:
 ** Latin, numeric characters, symbols: spaces, dots, hyphens, underscores, and apostrophes
 ** Min length - 3
 ** Max length - 60
# Remove focus from the "Full Name" field

*Expected results:*

3. Red border appears and hint under the "Full Name" field updates to error message:
"Full name may contain 3-60 characters, using only Latin letters, numbers, spaces, dots, hyphens, underscores, and apostrophes."

---

## Organizations. "Create Password" field validation

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill all fields except for "Create Password" field with valid data
# Fill "Create password" with the value which doesn't satisfy the following conditions
 ** minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter
# Remove focus from the "Create Password" field

*Expected results:*

3. Red border appears and "Password must include a minimum of 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter." error message is displayed under the field

---

## Organizations. "Confirm Password" field validation

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill all fields except for "Confirm Password" field with valid data
# Fill "Confirm Password" with the password which doesn't match the password in "Create Password" field
# Remove focus from the "Confirm Password" field

*Expected results:*

3. Red border appears and "The passwords you entered do not match. Please try again." error message is displayed under the "Confirm Password" field

---

## Organizations. Impossible to create profile if all fields are not filled

*Preconditions:*

# User is on Registration page

*Steps:*

# Click "Register" button
# Put cursor in "Full Name" field and remove it
# Put cursor in "Create Password" field and remove it
# Put cursor in "Confirm Password" field and remove it

*Expected results:*

1. Nothing happens,  "Register" button is disabled
2. "Full Name" is highlighted in red, "Field is required." error hint is displayed under the field
3. "Create Password" is highlighted in red, "Field is required." error hint is displayed under the field
4. "Confirm Password" is highlighted in red, "Field is required." error hint is displayed under the field

---

## Organizations. Impossible to create profile if at least one field is not filled

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill all fields with valid data except for "Full Name" field 
# Click "Register" button
# Repeat steps 1-2 for "Create Password" field
# Repeat steps 1-2 for "Confirm Password" field

*Expected results:*

2. Red border appears and hint under the "Full Name" field updates to error message: "Field is required."
3. Red border appears and error message is displayed under "Create Password" field: "Field is required."
4. Red border appears and error message is displayed under the "Confirm Password" field: "Field is required."

---

## Organizations. Length validation in the "Full Name" field

*Preconditions:*

# User is on Registration page

*Steps:*

# Enter any valid 2 symbols in the "Full Name" field
# Remove focus from the "Full Name" field
# Click on "Register" button
# Enter any valid 3 symbols in the "Full Name" field
# Enter any valid 60 symbols in the "Full Name" field
# Try to enter 61 symbols in the ""Full Name" field
# Paste any text with length more 61 symbols in the "Full Name" field

*Expected results:*

2. "Full Name" field is highlighted in red, error message "Full name may contain 3-60 characters, using only Latin letters, numbers, spaces, dots, hyphens, underscores, and apostrophes." is displayed under "Full Name" field
3. "Full Name" field is highlighted in red, the same error message is displayed under "Full Name" field
4. "Full Name" field is not highlighted in red, error message under "Full Name" field disappeared
5. All 60 symbols are displayed in the "Full Name" field
6. The first 60 symbols are displayed in the "Full Name" field
7. The first 60 symbols are displayed in the "Full Name" field

---

## Organizations. Length validation in the "Create Password" field

*Preconditions:*

# User is on Registration page

*Steps:*

# Enter any valid 7 symbols in the "Create Password" field
# Remove focus from the "Create Password" field
# Click on "Register" button
# Enter any valid 8 symbols in the "Create Password" field

*Expected results:*

2. "Create Password" field is highlighted in red, error message "Password must include minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter." is displayed under the field
3. "Create Password" field is highlighted in red, the same error message is displayed under "Create Password" field
4. "Create Password" field is not highlighted in red, error message under "Create Password" field disappeared

---

## Organizations. 'All organizations' page is opened user was invited to instance

*Preconditions:*

# User is on Registration page
# User was invited to *instance*

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Open "Profile" page
# Check "Assignments" tab

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar, "All organizations" page in "Welcome" state is displayed
4. There are no assignments

---

## Organizations. 'Dashboards' page is opened user was invited to project

*Preconditions:*

# User is on Registration page
# User was invited to *project*

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Open "Profile" page
# Check "Assignments" tab

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar, "Dashboard" page of the project is displayed
4. There is one organization with appropriate organization role and its project with appropriate project role

---

## Organizations. 'Projects' page is opened user was invited to one organization and its several projects

*Preconditions:*

# User is on Registration page
# User was invited to *one organization and its several projects*

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Open "Profile" page
# Check "Assignments" tab

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar, "Projects" page of the organization is displayed
4. There is one organization with appropriate organization role and its several projects with appropriate project roles

---

## Organizations. 'All organizations' page is opened user was invited to several organizations

*Preconditions:*

# User is on Registration page
# User was invited to *several organizations*

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Open "Profile" page
# Check "Assignments" tab

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar, "All organizations" page is displayed
4. There are several organizations with appropriate organization roles, no project assignments

---

## Organizations. 'Projects' page is opened user was invited to organization

*Preconditions:*

# User is on Registration page
# User was invited to *organization*

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Open "Profile" page
# Check "Assignments" tab

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar, "Projects" page of the organization is displayed
4. There is one organization with appropriate organization role, no project assignments

---

## Organizations. Impossible to change value in "Email" field

*Preconditions:*

# User is on Registration page

*Steps:*

# Try to change value in "Email" field

*Expected results:*

1. Impossible to change it, "Email" field is disabled and contains prefilled email from the invitation link

---

## Organizations. Registration link expired

*Preconditions:*

# User received "User registration confirmation" email
# 24 hours passed since the email was received

*Steps:*

# Open the registration confirmation email and click "Get Started" link

*Expected results:*

# The page is opened and the text is displayed
"Oops,
this invitation has expired or already used
Visit [ReportPortal.io|http://reportportal.io/]
or [Log In|https://demo.reportportal.io/] again" - with the links to ReportPortal.io and ReportPortal instance accordingly

---

## Organizations. New user is displayed in "All Users" page after registration

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Log out
# Log in as Admin
# Go to "All Users" page

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar
5. New User with specified username and email is displayed in the list of users

---

## Organizations. Personal organization is created for user when "Create Personal Organizations" toggle is ON

*Preconditions:*

# "Create Personal Organizations" toggle is ON
# User is on Registration page

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Go to "All Organizations" page

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar
3. At least two organizations are displayed - one to which user was invited and personal one

---

## Organizations. Personal organization is not created for user when "Create Personal Organizations" toggle is OFF

*Preconditions:*

# "Create Personal Organizations" toggle is OFF
# User is on Registration page

*Steps:*

# Fill all fields with valid data
# Click "Register" button
# Go to "All Organizations" page

*Expected results:*

2. Reportportal application opens, "Signed in successfully" message is displayed in green bar
3. There is no personal organization

---

## Organizations. Activate invitation link for user from email

*Preconditions:*

# User received "User registration confirmation" email

*Steps:*

# Open the email
# Click "Get Started" link
# Fill all fields with valid data
# Click "Register" button

*Expected results:*

4. Reportportal application opens, "Signed in successfully" message is displayed in green bar

---

## Organizations. Activate invitation link for user copied from 'Invitation link' field

*Preconditions:*

# User has invitation link

*Steps:*

# Open Registration form using invitation link
# Fill all fields with valid data
# Click "Register" button

*Expected results:*

3. Reportportal application opens, "Signed in successfully" message is displayed in green bar

---

## Organizations. Possible to register user with special symbols in full name

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill value with Latin, numeric characters, symbols: hyphen, underscore, apostrophe, dot and space symbols in "Full Name" field (e.g. Petrov -O'Neil_3.0)
# Fill other fields with valid data
# Click "Register" button

*Expected results:*

3. Reportportal application opens, "Signed in successfully" message is displayed in green bar

---

## Organizations. Possible to register user with special symbols in password

*Preconditions:*

# User is on Registration page

*Steps:*

# Fill value with minimum 8 characters: at least one digit, one special symbol, one uppercase, and one lowercase letter in "Create Password" field (e.g. A1b2C3d$)
# Fill other fields with valid data
# Click "Register" button

*Expected results:*

3. Reportportal application opens, "Signed in successfully" message is displayed in green bar

---

## Instance level. All Users page. Invite not existing user to organization and project

*Preconditions:*

User is Admin 
User is logged in to RP
"SSO users only" toggle turned to 'OFF'
OrganizationA exists on the instance
Project1 is created in OrganizationA
User_1 is existing user on the RP Instance (e.g. User_1@example.com)

*Steps:*

# Go to "All Users" page
# Click on 'Invite user' button
# Enter User_1's email in 'Email' field
# Select OrganizatonA in "Organization" field
# Select Project1 in "Project" field
# Click on "Tick" button
# Click on "Invite" button
# Click on "Got it" button
# Verify the list of users of the Organization A
# Verify the 'Project Team' page of the Project1
# Open the email client for the entered email

*Expected results:*

7. 'Invite user' confirmation modal window is displayed with Invitation link
8. 'Invite user' confirmation modal window is closed
9-10. The user is not displayed in the list
11. The invitation mail is received

---

## Instance level. All Users page. Invite not existing user to organization

*Preconditions:*

User is Admin 
User is logged in to RP
"SSO users only" toggle turned to 'OFF'
OrganizationA exists on the instance
User_1 is existing user on the RP Instance (e.g. User_1@example.com)

*Steps:*

# Go to "All Users" page
# Click on 'Invite user' button
# Enter User_1's email in 'Email' field
# Select OrganizatonA in "Organization" field
# Click on "Tick" button
# Click on "Invite" button
# Click on "Got it" button
# Verify the list of users of the Organization A
# Open the email client for the entered email

*Expected results:*

6. 'Invite user' confirmation modal window is displayed with Invitation link
7. 'Invite user' confirmation modal window is closed
8. The user is not displayed in the list
9. The invitation mail is received

---

## Instance level. All Users page. Invite not existing user to organization and several projects

*Preconditions:*

User is Admin 
User is logged in to RP
"SSO users only" toggle turned to 'OFF'
OrganizationA exists on the instance
Project1 is created in OrganizationA
User_1 is existing user on the RP Instance (e.g. User_1@example.com)

*Steps:*

# Go to "All Users" page
# Click on 'Invite user' button
# Enter User_1's email in 'Email' field
# Select OrganizatonA in "Organization" field
# Select Project1 in "Project" field
# Click on "Tick" button
# Click on "+ Add Project" button
# Select Project2 in "Project" field
# Click on "Tick" button
# Click on "Invite" button
# Click on "Got it" button
# Verify the list of users of the Organization A
# Verify the 'Project Team' page of the Project1
# Verify the 'Project Team' page of the Project2
# Open the email client for the entered email

*Expected results:*

10. 'Invite user' confirmation modal window is displayed with Invitation link
11. 'Invite user' confirmation modal window is closed
12-14. The user is not displayed in the list
15. The invitation mail is received

---

## Instance level. All Users page. Invite not existing user to several organizations

*Preconditions:*

User is Admin 
User is logged in to RP
"SSO users only" toggle turned to 'OFF'
OrganizationA and OrganizationB exist on the instance
User_1 is existing user on the RP Instance (e.g. User_1@example.com)

*Steps:*

# Go to "All Users" page
# Click on 'Invite user' button
# Enter User_1's email in 'Email' field
# Select OrganizatonA in "Organization" field
# Click on "Tick" button
# Click on '+ Add Organization' button
# Select OrganizatonB in "Organization" field
# Click on "Tick" button
# Click on "Invite" button
# Click on "Got it" button
# Verify the list of users of the Organization A
# Verify the list of users of the Organization B
# Open the email client for the entered email

*Expected results:*

9. 'Invite user' confirmation modal window is displayed with Invitation link
10. 'Invite user' confirmation modal window is closed
11-12. The user is not displayed in the list
13. The invitation mail is received

---

## Instance level. All Users page. Invite not existing user to several organizations and several projects

*Preconditions:*

User is Admin 
User is logged in to RP
"SSO users only" toggle turned to 'OFF'
OrganizationA and OrganizationB exist on the instance
Project1 is created in OrganizationA
Project2 is created in OrganizationB
User_1 is existing user on the RP Instance (e.g. User_1@example.com)

*Steps:*

# Go to "All Users" page
# Click on 'Invite user' button
# Enter User_1's email in 'Email' field
# Select OrganizatonA in "Organization" field
# Select Project1 in "Project" field
# Click on "Tick" button
# Click on '+ Add Organization' button
# Select OrganizatonB in "Organization" field
# Select Project2 in "Project" field
# Click on "Tick" button
# Click on "Invite" button
# Click on "Got it" button
# Verify the list of users of the Organization A
# Verify the list of users of the Organization B
# Verify the 'Project Team' page of the Project1
# Verify the 'Project Team' page of the Project2
# Open the email client for the entered email

*Expected results:*

11. 'Invite user' confirmation modal window is displayed with Invitation link
12. 'Invite user' confirmation modal window is closed
13-16. The user is not displayed in the list
17. The invitation mail is received
