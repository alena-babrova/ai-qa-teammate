# Test cases: EPMRPP-89670 — [UI][QA] Organization level. List of Projects

**User story:** https://jiraeu.epam.com/browse/EPMRPP-89670

---

## Organizations. Projects page. Layout

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page

*Expected results:*

2. The page consists of:
- Header :
-- breadcrumbs (All Organizations -> Organization A)
-- Organization name 
-- Project's icon with number of projects in the organization
-- User's icon with number of users in the organization
-- Storage icon - {color:#de350b}out of scope {color}
-- Billing plan icon - {color:#de350b}out of scope {color}
-- "Search" icon
-- "Filter" icon 
-- "Create project" button
- Project's table:
-- "Project name" column 
-- "Storage usage" column - {color:#de350b}out of scope {color}
-- "Teammates" column - number of users assigned to the project
-- "Launches" column - number of reported launches in the project
-- "Last launch date" column - date when last launch was reported
-- "Meatballs" button

---

## Organizations. Projects page. Projects within organization are displayed in the table

*Preconditions:*

'Organization A' is created with at least one Project (e.g. Project1)
'Organization B' is created with at least one Project (e.g. Project2)

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page of the 'Organization A'
3. Go to "Projects" page of the 'Organization B'

*Expected results:*

2. Only Project1 is displayed in the Project's list
2. Only Project2 is displayed in the Project's list

---

## Organizations. Projects page. Projects are sorted in alphabetical order in the list

*Preconditions:*

'Organization A' is created with several Projects

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page

*Expected results:*

2. All projects within the organization are displayed and sorted in alphabetical order

---

## Organizations. Projects page. Sorting projects by name

*Preconditions:*

'Organization A' is created with several Projects

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page
3. Click on "Project name" column

*Expected results:*

2. All projects within the organization are displayed and sorted in alphabetical ascending order
3. Projects are sorted in alphabetical descending order (from Z to A)

---

## Organizations. Projects page. Possible to navigate to "All Organizations" page via breadcrumbs

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page
3. Click on "All Organizations" link in the breadcrumbs  - {color:#de350b}out of scope {color}

*Expected results:*

3. "All organizations" page is displayed - {color:#de350b}out of scope {color}

---

## Organizations. Projects page. Organization info section is displayed only for Admin and Manager

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Repeat test case as Manager*

*Expected results:*

2. Info about Organization (Projects, Users, Storage and Billing plan) is displayed in the header

---

## Organizations. Projects page. Organization info section is not displayed for Admin and Manager when there is no project in the organization

*Preconditions:*

'Organization A' is created with no projects

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Repeat test case as Manager*

*Expected results:*

2. There is no info about Organization (Projects, Users, Storage and Billing plan), only breadcrumbs and Organization name are displayed in the header

---

## Organizations. Projects page. Organization info section is not displayed for Member

*Preconditions:*

'Organization A' is created with at least one Project
Member-editor is assigned to the Project from 'Organization A'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page

*Repeat test case as Member-viewer*

*Expected results:*

2. There is no info about Organization (Projects, Users, Storage and Billing plan), only breadcrumbs and Organization name are displayed in the header

---

## Organizations. Projects page. "n/a" value is displayed in "Last launch date" column when there are no launches in the project

*Preconditions:*

'Organization A' is created with at least one Project
There are no launches in the Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. "n/a" value is displayed in "Last launch date" column

---

## Organizations. Projects page. Users number in Organization info section

*Preconditions:*

'Organization A' is created with two Projects (Project1 and Project2)
Several Users (e.g. 10) are assigned to 'Organization A':
5 Users are assigned to Project1
4 Users are assigned to Project2
1 User is assigned to 'Organization A' without assignment to any Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Users number (10) is displayed in the header

---

## Organizations. Projects page. Projects number in Organization info section

*Preconditions:*

'Organization A' is created with several Projects (e.g. 15)

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Projects number (15) is displayed in the header

---

## Organizations. Projects page. 'Create project' button is displayed only for Admin and Manager

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Repeat test case as Manager*

*Expected results:*

2. "Create project" button is displayed in the page header

---

## Organizations. Projects page. 'Create project' button is not displayed for Member

*Preconditions:*

'Organization A' is created with at least one Project
Member-editor is assigned to the Project from 'Organization A'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page

*Repeat test case as Member-viewer*

*Expected results:*

2. Only "Search" and "Filter" icons are displayed in the page header

---

## Organizations. Projects page. "Search" and "Filter" icons are displayed for all type of users (roles)

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Repeat test case as Manager, Member-editor, Member-viewer*

*Expected results:*

2. "Search" and "Filter" icons are displayed in the page header

---

## Organizations. Projects page. Project's "Dashboard" page is opened when clicking on Project name

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page
3. Click on Project name

*Expected results:*

2. Project's "Dashboards" page is displayed

---

## Organizations. Projects page. "Teammates" column displays number of users assigned to the project

*Preconditions:*

'Organization A' is created with at least two Projects:
Project1 has e.g. 2 users
Project2 has e.g. 3 users

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Project1 has value 2 in "Teammates" column
Project2 has value 3 in "Teammates" column

---

## Organizations. Projects page. "0" value is displayed in "Teammates" column when there are no users in the project

*Preconditions:*

'Organization A' is created with at least one Project
There are no users in the Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. "0" value is displayed in "Teammates" column

---

## Organizations. Projects page. "Launches" column displays number of reported launches per project

*Preconditions:*

'Organization A' is created with at least two Projects:
Project1 has e.g. 5 launches
Project2 has e.g. 7 launches

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Project1 has value 5 in "Launches" column
Project2 has value 7 in "Launches" column

---

## Organizations. Projects page. "0" value is displayed in "Launches" column when there are no launches in the project

*Preconditions:*

'Organization A' is created with at least one Project
There are no launches in the Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. "0" value is displayed in "Launches" column

---

## Organizations. Projects page. "Last launch date" value behaviour

*Preconditions:*

'Organization A' is created with at least one Project

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page
3. Hover over value in "Last launch date" column
4. Unhover value in "Last launch date" column
5. Hover and click on value in "Last Login" column
6. Unhover value in "Last launch date" column
7. Go to another page and return back to "Projects" page
8. Refresh the page

*Expected results:*

2. "Last launch date" value is in "X (sec/min/hour etc.) ago" format
3. "Last launch date" value is in "YYYY-MM-DD HH:MM:SS" format
4. "Last launch date" value is in "X (sec/min/hour etc.) ago" format
5. "Last launch date" value is in "X (sec/min/hour etc.) ago" format
6. "Last launch date" value is in "YYYY-MM-DD HH:MM:SS" format (default display format is changed in comparison with step#2) 
7. "Last launch date" value is in "YYYY-MM-DD HH:MM:SS" format
8. "Last launch date" value is in "X (sec/min/hour etc.) ago" format (default format)

---

## Organizations. Projects page. Pagination

*Preconditions:*

'Organization A' is created with at least 21 Projects

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Only the first 20 projects in alphabetical order are displayed in the list, pagination control is displayed - {color:#de350b}out of scope {color}

---

## Organizations. Projects page. Long project name in "Project name" column

*Preconditions:*

'Organization A' is created with at least one Project
Project has long name (e.g. 256 symbols)

*Steps:*

1. Login to RP as Admin/Manager
2. Go to "Projects" page

*Expected results:*

3. Only visible part of the Project name is displayed in the "Project name" column - the rest is cut by ellipsis

---

## Organizations. Projects page. Header is fixed when scrolling

*Preconditions:*

'Organization A' is created with at least 20 Projects

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page
3. Scroll down

*Expected results:*

3. Page is scrolling down, header is fixed and displayed

---

## Organizations. Projects page. Permissions. Admin assigned to the Organization and not assigned to the Project can view Projects of the Organization

*Preconditions:*

Admin user is assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'
Admin user is assigned to 'Project A'
Admin user is *not* assigned to 'Project B'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page of Organization 'ABC'

*Expected results:*

2. Two projects ('Project A' and 'Project B') are displayed in the list

---

## Organizations. Projects page. Permissions. Admin not assigned to the Organization can view Projects of the Organization

*Preconditions:*

Admin user is *not* assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page of Organization 'ABC'

*Expected results:*

2. Two projects ('Project A' and 'Project B') are displayed in the list

---

## Organizations. Projects page. Permissions. Manager assigned to the Organization and not assigned to the Project can view Projects of the Organization

*Preconditions:*

Manager user is assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'
Manager user is assigned to 'Project A'
Manager user is *not* assigned to 'Project B'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page of Organization 'ABC'

*Expected results:*

2. Two projects ('Project A' and 'Project B') are displayed in the list

---

## Organizations. Projects page. Permissions. Manager not assigned to the Organization can't get Projects of the Organization via API

*Preconditions:*

Manager user is *not* assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'

*Steps:*

1. Send GET/{{url}}/api/organizations/{{organization_id}}/projects 
to get Projects as a Manager

*Expected results:*

1. The response is 403 error

---

## Organizations. Projects page. Permissions. Member assigned to the Organization and Projects can view only their assigned Projects

*Preconditions:*

Member-editor user is assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'
Member-editor user is assigned to 'Project A'
Member-editor user is *not* assigned to 'Project B'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page of Organization 'ABC'

*Repeat test case as Member-viewer*

*Expected results:*

2. Only one project ('Project A') is displayed in the list

---

## Organizations. Projects page. Permissions. Member assigned to the Organization and not assigned to Projects can't view Projects of the Organization

*Preconditions:*

Member-editor user is assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'
Member-editor user is *not* assigned to 'Project A' and 'Project B'

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to "Projects" page of Organization 'ABC'

*Repeat test case as Member-viewer*

*Expected results:*

2. There are no Projects in the list, "'No projects available yet'
The list of available to you projects is currently empty. 
Contact your Organization's manager for details." text is displayed

---

## Organizations. Projects page. Permissions. Member not assigned to the Organization can't get Projects of the Organization via API

*Preconditions:*

Member user is *not* assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'

*Steps:*

1. Send a GET/{{url}}/api/organizations/{{organization_id}}/projects
to get Projects as a Member

*Expected results:*

2. The response is 403 error

---

## Organizations. Projects page. Permissions. Member assigned to the Organization and not assigned to Projects can't get Projects of the Organization via API

*Preconditions:*

Member-editor user is assigned to Organization 'ABC'
'Project A' and 'Project B' are created in the Organization 'ABC'
Member user is *not* assigned to 'Project A' and 'Project B'

*Steps:*

1. Send GET/{{url}}/api/organizations/{{organization_id}}/projects
to get Projects as a Member

*Expected results:*

1. Status code is 200, empty array is returned

---

## Organizations. Projects page. "Launches" column displays number of all reported launches in Default and Debug modes

*Preconditions:*

'Organization A' is created with at least one Project
Project has e.g. 2 launches in Default mode
Project has e.g. 1 launch in Debug mode

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page

*Expected results:*

2. Project has value 3 in "Launches" column

---

## Organizations. Projects page. "Last launch date" column displays last launch date from Default or Debug modes

*Preconditions:*

'Organization A' is created with at least one Project
Project has e.g. 2 launches (one in Default mode, another one in Debug mode)
Launch in Debug mode is newer than Launch reported in Default mode (Launch in Debug mode is the latest reported launch)

*Steps:*

1. Login to RP as Admin
2. Go to "Projects" page
3. Report launch on Default mode
4. Go to "Projects" page

*Expected results:*

2. Project has date from launch reported in *Debug* mode in "Last launch date" column
4. Project has date from launch reported in *Default* mode in "Last launch date" column (now it's the latest reported launch)

---
