# Test cases: EPMRPP-114989 — [WS][UI][QA] View the list of devices

**User story:** https://jiraeu.epam.com/browse/EPMRPP-114989

---

## Cloud Devices. Empty page state

*Preconditions:*

"Mobitru" plugin is installed and enabled
There is no Mobitru global/project integration

*Steps:*

1. Go to Project level
2. Click on "Cloud Devices" option in the sidebar
3. Click on 'Open Settings' button
4. Click on 'Documentation' link

*Expected results:*

2. The empty state for 'Cloud Devices' page is displayed:
   - breadcrumb icon with project name
   - icon
   - text: 'No configuration yet
     Your plugin is installed but not configured yet.
     Go to settings to complete the setup.
   - 'Open Settings' button
   - 'Documentation' link
3. Project settings → Integrations → Mobitru page is opened
4. https://reportportal.io/docs/integrations/infrastructure-providers/Mobitru page is opened in the new tab

---

## Cloud Devices. Page state when integration is created

*Preconditions:*

"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created

*Steps:*

1. Go to Project level
2. Click on "Cloud Devices" option in the sidebar
3. Click on "Explore Devices" button

*Expected results:*

2. 'Cloud Devices' page is displayed with the following:
   - Header:
     - breadcrumb icon with project name
     - "Cloud Devices" page name
     - "iOS" tab (selected by default)
     - "Android" tab
     - "Explore Devices" button
   - "Premium Devices"
     - Devices in card form
   - "Available Devices"
     - Devices in card form
   - "Powered by Mobitru" text
3. https://app.mobitru.com/#!/devices page is opened in the new tab

---

## Cloud Devices. Switching between iOS and Android tabs

*Preconditions:*

"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created

*Steps:*

1. Go to "Cloud Devices" page
2. Click on "Android" tab
3. Click on "iOS" tab

*Expected results:*

2. 'Cloud Devices' page is displayed, "iOS" tab is selected
3. "Android" tab is selected, Android device list is rendered — "Premium Devices" and "Available Devices" sections are displayed with corresponding Android device cards, "Powered by Mobitru" text is displayed at the end of the device list
4. "iOS" tab is selected, iOS device list is rendered — "Premium Devices" and "Available Devices" sections are displayed with corresponding iOS device cards, "Powered by Mobitru" text is displayed at the end of the device list

---

## Cloud Devices. Device card displaying

*Preconditions:*

"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created

*Steps:*

1. Go to Project level
2. Click on "Cloud Devices" option in the sidebar
3. Hover over Device name
4. Click on Device name
5. Go back to RP
6. Hover over Device card
7. Click on Device card

*Expected results:*

2. 'Cloud Devices' page is displayed, each device card is displayed with the following:
   - Device name
   - Device version
   - Device image
3. "Open in new tab" icon is displayed near device name
4. https://app.mobitru.com/#!/devices page is opened in the new tab
6. "Open in new tab" icon is displayed near device name
7. https://app.mobitru.com/#!/devices page is opened in the new tab

---

## Cloud Devices. All users can see devices

*Preconditions:*

User is Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created

*Steps:*

1. Go to Project level
2. Click on "Cloud Devices" option in the sidebar

*Repeat test case as Manager, Member-editor, Member-viewer*

*Expected results:*

2. 'Cloud Devices' page is displayed, list of devices are displayed

---

## Log level. All users can see and download Mobitru attachment

*Preconditions:*

User is Admin
A launch is reported on the project
Mobitru plugin is uploaded
Mobitru integration is created
Test has log from Mobitru side

*Steps:*

1. Go to "Launches" page -> Drill down to Log level of the Test
2. Click on attached file

*Repeat test case as Manager, Member-editor, Member-viewer*

*Expected results:*

1. Mobitru log is displayed
2. Attached file is downloaded
