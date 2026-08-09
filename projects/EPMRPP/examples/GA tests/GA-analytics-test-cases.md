# Test cases: GA analytics — reference suite

Curated from linked Jira **Test** issues for Google Analytics / `collect` payload verification. Use with **`CONTEXT.md`** and **`PROJECT.md`** in this pack when a story requires **GA.** coverage.

**Sample sources (Jira Tests):**

| Jira Test | Reference |
|-----------|-----------|
| [EPMRPP-104763](https://jiraeu.epam.com/browse/EPMRPP-104763) | Instance level — menu action (`icon_name`) |
| [EPMRPP-104765](https://jiraeu.epam.com/browse/EPMRPP-104765) | Instance level — GA OFF |
| [EPMRPP-95766](https://jiraeu.epam.com/browse/EPMRPP-95766) | Organization level — sidebar hover |
| [EPMRPP-116724](https://jiraeu.epam.com/browse/EPMRPP-116724) | Project level — `page_view` on open |
| [EPMRPP-116725](https://jiraeu.epam.com/browse/EPMRPP-116725) | Project level — `element_name` on click |
| [EPMRPP-113162](https://jiraeu.epam.com/browse/EPMRPP-113162) | Project Team — GA ON, multiple actions |
| [EPMRPP-113163](https://jiraeu.epam.com/browse/EPMRPP-113163) | Project Team — GA OFF |
| [EPMRPP-116025](https://jiraeu.epam.com/browse/EPMRPP-116025) | Promo page — `link_name` |
| [EPMRPP-116026](https://jiraeu.epam.com/browse/EPMRPP-116026) | Promo page — GA OFF |

---

## GA. Instance level. All Users page. GA is sent when selecting "Delete" option

*Preconditions:*

At least one User is created on the instance except Admin
Browser Dev tools are opened

*Steps:*

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu for the User -> Select "Delete" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4. The collect request contains the following data:
instanceID
version
uid
timestamp
*category:* all_users
*place:* all_users_page
*icon_name:* delete

---

## GA. Instance level. All Users page. GA is sent when clicking on "Delete" button

*Preconditions:*

At least one User is created on the instance except Admin
Browser Dev tools are opened

*Steps:*

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu for the User -> Select "Delete" option
# Click on "Delete" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

5. The collect request contains the following data:
instanceID
version
uid
timestamp
*category:* all_users
*place:* all_users_page
*modal:* delete_user
*element_name:* delete

---

## GA. Instance level. All Users page. Set GA OFF and click on "Delete" button in "Delete user" modal window

*Preconditions:*

GA is OFF
At least one User is created on the instance except Admin
Browser Dev tools are opened

*Steps:*

# Login to RP as Admin
# Go to "All Users" page
# Click on "Meatball" menu for the User -> Select "Delete" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Delete" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools
6. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools

---

## GA. Organizations. Sidebar. GA is sent on click on the user in the expanded sidebar on the Organization level

*Preconditions:*

Admin/Manager user is logged in to RP
The user is assigned to at least 1 organization
Organization level is opened
The sidebar is collapsed
Browser Dev tools are opened

*Steps:*

# Hover over the sidebar so that it expands
# Click on the user's icon/photo in the *expanded* sidebar
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. The collect request contains the following data:

instanceID
organization_id
version
uid
timestamp
auto_analysis
pattern_analysis
project_id
kind
category: sidebar
*icon_name: user_control*
*place: sidebar_hover*

---

## GA. Project level. Cloud Devices. GA is sent by opening the empty state of "Cloud Devices" page

*Preconditions:*

Analytics is ON on the instance
"Mobitru" plugin is installed and enabled on the instance
There is no Mobitru global integration
There is no Mobitru project integration on 'Project1'
Browser Dev tools are opened (Network tab)
Admin/Manager/user is logged in to RP

*Steps:*

1. Go to 'Project1'
2. Click on "Cloud Devices" option in the sidebar
3. Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3. The collect request contains the following data:
 * en: page_view
 * instanceID
 * version
 * uid
 * timestamp
 * auto_analysis
 * pattern_analysis
 * place: *cloud_device_empty_state*

---

## GA. Project level. Cloud Devices. GA is sent by clicking on "Open Settings" button on the empty state

*Preconditions:*

Analytics is ON on the instance
"Mobitru" plugin is installed and enabled on the instance
There is no Mobitru global integration
There is no Mobitru project integration on 'Project1'
Browser Dev tools are opened (Network tab)
Admin/Manager/user is logged in to RP

*Steps:*

1. Go to 'Project1'
2. Click on "Cloud Devices" option in the sidebar
3. Click on "Open Settings" button on the empty state
4. Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4. The collect request contains the following data:
 * instanceID
 * organization_id
 * version
 * uid
 * timestamp
 * auto_analysis
 * pattern_analysis
 * kind
 * category: *cloud_device*
 * place: *cloud_device_empty_state*
 * element_name: *open_settings*

---

## GA. Project Team. GA is sent when changing project role

*Preconditions:*

# Several Users are created on the instance except Admin
# The User1 is assigned to the project with Member-viewer role
# The User2 is assigned to the project with Member-editor role
# Browser Dev tools are opened

*Steps:*

# Login to RP as Admin
# Go to "Project Team" page
# Click on "Meatball" menu for the User1 -> Select "Change to Can Edit" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Meatball" menu for the User2 -> Select "Change to Can View" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4. The request contains the following data:
instanceID
organization_id
version
uid
timestamp
auto_analysis
pattern_analysis
kind
project_id
*category:* project_team
*element_name:* change to can edit
6. *category:* project_team
*element_name:* change to view only

---

## GA. Organizations. Project Team page. GA OFF and change project role

*Preconditions:*

# GA is OFF
# Several Users are created on the instance except Admin
# The User1 is assigned to the project with Member-viewer role
# The User2 is assigned to the project with Member-editor role
# Browser Dev tools are opened

*Steps:*

# Login to RP as Admin
# Go to "Project Team" page
# Click on "Meatball" menu for the User1 -> Select "Change to Can Edit" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Meatball" menu for the User2 -> Select "Change to Can View" option
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4, 6. GA event is not sent - "collect" HTTP request is not displayed in Browser Dev tools

---

## GA. Promo page. GA is sent when clicking on buttons on the page

*Preconditions:*

GA is ON
Browser Dev tools are opened

*Steps:*

# Go to RP -> Log in
# Click on "Explore Cloud version" star icon
# Click on "Request Cloud Access" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Explore Billing Plans" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Explore Premium Features" link
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

4. The collect request contains the following data:
instanceID
version
uid
timestamp
*category:* cloud_version
*link_name:* request_cloud_access
6. *category:* cloud_version
*link_name:* explore_billing_plans
8. *category:* cloud_version
*link_name:* explore_premium_features

---

## GA. Promo page. Set GA OFF and verify actions on the page

*Preconditions:*

GA is OFF
Browser Dev tools are opened

*Steps:*

# Go to RP -> Log in
# Click on "Explore Cloud version" star icon
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Request Cloud Access" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Explore Billing Plans" button
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools
# Click on "Explore Premium Features" link
# Check the data in the Request Payload of "collect" HTTP request in Browser Dev tools

*Expected results:*

3, 5, 7, 9. GA is not sent. "collect" HTTP request is not displayed in Browser Dev tools
