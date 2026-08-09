# Test cases: EPMRPP-114952 — [WS][UI][QA] CRUD Global Mobitru integration

**User story:** https://jiraeu.epam.com/browse/EPMRPP-114952

---

## Mobitru. Add Global integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields with valid data
4. Click on "Create" button
5. Go back via breadcrumbs to "Mobitru"

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields are filled
4. The modal window is closed, global integration is saved, 'Integration successfully added' message in green bar appears
5. Global integration is displayed

---

## Mobitru. "Create Global Integration" modal window layout

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button

*Expected results:*

2. "Create Global Integration" modal window is opened with the following fields:
   - Mobitru URL
   - API key
   - Mobitru Billing unit (slug)
   - "Cancel" and "Create" buttons

---

## Mobitru. Canceling of adding global integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields with valid data
4. Click on "Cancel" button / "X" button / "ESC" key

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields are filled
4. The modal window is closed, integration is not created, "+ Add integration" button is displayed

---

## Mobitru. Only one global integration can exist

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields with valid data
4. Click on "Create" button
5. Go back via breadcrumbs to "Mobitru"

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields are filled
4. The modal window is closed, global integration is saved, 'Integration successfully added' message in green bar appears
5. Global integration is displayed in "Global integration" section, "+ Add integration" button is *not* displayed

---

## Mobitru. Check plugin's API key in DB

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to DB > reportportal > Schemas > public > Tables > integration
2. Find Mobitru 'Integration Name' in name column
3. Check the API Key value in 'params' column

*Expected results:*

1. Integration table is opened
3. "API Key" exists and encoded (not stored in plain text)

---

## Mobitru. Impossible to create integration without filling mandatory fields

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. All mandatory fields are highlighted in red with "Field is required" message, modal window is still displayed, integration is not created

---

## Mobitru. Impossible to create integration with empty "Mobitru URL" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields except "Mobitru URL" with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields except "Mobitru URL" are filled
4. "Mobitru URL" field is highlighted in red, "Field is required" validation message is shown under the field, modal window is still displayed, integration is not created

---

## Mobitru. Impossible to create integration with empty "API key" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields except "API key" with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields except "API key" are filled
4. "API key" field is highlighted in red, "Field is required" validation message is shown under the field, modal window is still displayed, integration is not created

---

## Mobitru. Impossible to create integration with empty "Mobitru Billing unit (slug)" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill all fields except "Mobitru Billing unit (slug)" with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
3. Fields except "Mobitru Billing unit (slug)" are filled
4. "Mobitru Billing unit (slug)" field is highlighted in red, "Field is required" validation message is shown under the field, modal window is still displayed, integration is not created

---

## Mobitru. Impossible to create integration with invalid "Mobitru URL" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill "Mobitru URL" field with any invalid value (e.g. "app.mobitru.com"), other fields with valid data
4. Click on "Create" button
5. Fill "Mobitru URL" field with any HTTPS url, but invalid value (e.g. "https://m", "https://7"), other fields with valid data
6. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. "Please provide a valid URL" validation message is displayed under "Mobitru URL" field, modal window is still displayed, integration is not created
6. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not created

---

## Mobitru. Impossible to create integration with invalid "API Key" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill "API Key" field with invalid value, other fields with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not created

---

## Mobitru. Remove integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Trash bin" icon
4. Click on 'Delete' button

*Expected results:*

3. "Delete Mobitru" modal window is opened with "Are you sure you want to delete Integration Mobitru?" text, "Cancel" and "Delete" buttons
4. Modal window is closed, integration is removed, "Integration successfully deleted" message is displayed, "Mobitru settings" page is opened, "+ Add integration" button is displayed again

---

## Mobitru. Canceling of removing integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Trash bin" icon
4. Click on "Cancel" button / "X" button / "ESC" key

*Expected results:*

3. "Delete Mobitru" modal window is opened
4. Modal window is closed, integration is not removed

---

## Mobitru. Editing integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill all fields with new valid data
5. Click "Submit" button

*Expected results:*

4. All fields are filled with new values
5. "Integration successfully updated" message is displayed, new values in "Configuration" section are displayed

---

## Mobitru. Canceling of editing global integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill all fields with new valid data
5. Click "Cancel" button

*Expected results:*

4. All fields are filled with new values
5. Old values in "Configuration" section are displayed

---

## Mobitru. Impossible to create integration with invalid "Mobitru Billing unit (slug)" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill "Mobitru Billing unit (slug)" field with invalid value, other fields with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not created

---

## Mobitru. Impossible to edit integration with empty "Mobitru URL" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill all fields with new values except "Mobitru URL"
5. Click "Submit" button

*Expected results:*

5. "Mobitru URL" field is highlighted in red, "Field is required" validation message is shown under the field, integration is not updated

---

## Mobitru. Impossible to edit integration with empty "API key" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill all fields with new values except "API key"
5. Click "Submit" button

*Expected results:*

5. "API key" field is highlighted in red, "Field is required" validation message is shown under the field, integration is not updated

---

## Mobitru. Impossible to edit integration with empty "Mobitru Billing unit (slug)" field

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill all fields with new values except "Mobitru Billing unit (slug)"
5. Click "Submit" button

*Expected results:*

5. "Mobitru Billing unit (slug)" field is highlighted in red, "Field is required" validation message is shown under the field, integration is not updated

---

## Mobitru. Impossible to edit integration with invalid "Mobitru URL" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill "Mobitru URL" field with any invalid value (e.g. "not a URL"), other fields with new valid data
5. Click "Submit" button
6. Fill "Mobitru URL" field with any HTTPS, but invalid value (e.g. https://n or https://7), other fields with new valid data
7. Click "Submit" button

*Repeat test case with different invalid values, e.g. "not a url", "https://mobitru"*

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. "Please provide a valid URL" validation message is displayed under "Mobitru URL" field, integration is not updated
6. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not created

---

## Mobitru. Impossible to edit integration with invalid "API Key" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill "API Key" field with invalid value, other fields with new valid data
5. Click "Submit" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not updated

---

## Mobitru. Impossible to edit integration with invalid "Mobitru Billing unit (slug)" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill "Mobitru Billing unit (slug)" field with invalid value, other fields with new valid data
5. Click "Submit" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. Error toaster with the message 'An error occurred while connecting to server; Impossible interact with integration. Connection refused' is displayed. Integration is not updated

---

## Mobitru. 'Global integrations' section when integration is created

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Check 'Global integration' section

*Expected results:*

2. 'Global integration' section contains clickable Global integration from preconditions:
   - Mobitru
   - <Creator> on <Creation date>
   - '>' on the right side

---

## Mobitru. "Mobitru settings" page with successfully connection

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on Global Mobitru integration

*Expected results:*

2. "Mobitru settings" page is displayed and contains:
   - Panel:
     - Mobitru
     - <Creator> on <Creation date>
     - "Connected" connection status
     - Edit icon
     - Trash icon
     - Mobitru URL
     - API key (with hidden data)
     - Mobitru Billing unit (slug)

---

## Mobitru. "Mobitru settings" page with failed connection

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created and *failed*

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on Global Mobitru integration

*Expected results:*

2. "Mobitru settings" page is displayed and contains:
   - Panel:
     - Mobitru
     - <Creator> on <Creation date>
     - Exclamation point and "Connection failed" in red color
     - Trash icon
   - "Configuration" section:
     - Mobitru URL
     - API key
     - Mobitru Billing unit (slug)
     - "Edit" button

---

## API. Mobitru. Non-admin user cannot create global integration

*Preconditions:*

User - Manager, "Mobitru" plugin is installed and enabled

*Steps:*

1. Send request for creating Mobitru integration:
   POST /api/v1/integration/mobitru
   ```
   {"enabled":true,
   "integrationParameters":
   {"url":"<url>",
   "apiKey":"<API_key>",
   "billingUnit":"<billing_unit>"},
   "name":"Mobitru"}
   ```

*Repeat test case as Member*

*Expected results:*

1. Response contains:
   - code: 403
   - message: "You do not have enough permissions. Access Denied."

---

## API. Mobitru. Non-admin user can get global integration

*Preconditions:*

User - Manager, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Send request for creating Mobitru integration:
   GET /api/v1/integration/global/all

*Repeat test case as Member*

*Expected results:*

1. Response contains:
   - code: 200
   - Response body: JSON with the list of all global integrations, including Mobutru

---

## API. Mobitru. Non-admin user cannot update global integration

*Preconditions:*

User - Manager, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Send request for creating Mobitru integration:
   PUT /api/v1/integration/{integrationId}
   ```
   {"enabled":true,
   "integrationParameters":
   {"url":"<url>",
   "apiKey":"<API_key>",
   "billingUnit":"<billing_unit>"},
   "name":"Mobitru"}
   ```

*Repeat test case as Member*

*Expected results:*

1. Response contains:
   - code: 403
   - message: "You do not have enough permissions. Access Denied"

---

## API. Mobitru. Non-admin user cannot delete global integration

*Preconditions:*

User - Manager, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Send request for creating Mobitru integration:
   DELETE /api/v1/integration/{integrationId}

*Repeat test case as Member*

*Expected results:*

1. Response contains:
   - code: 403
   - message: "You do not have enough permissions. Access Denied"

---

## API. Mobitru. Impossible to create the second global integration

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Send request for creating one more global Mobitru integration:
   POST /api/v1/integration/mobitru
   ```
   {"enabled":true,
   "integrationParameters":
   {"url":"<url>",
   "apiKey":"<API_key>",
   "billingUnit":"<billing_unit>"},
   "name":"Mobitru"}
   ```

*Expected results:*

1. Response contains:
   - code: 409
   - message: "Integration 'Global integration of type = 'mobitru' with name = 'Mobitru' already exists' already exists. You couldn't create the duplicate."

---

## Mobitru. Impossible to create integration with HHTP "Mobitru URL" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on "+ Add integration" button
3. Fill "Mobitru URL" field with a http value (e.g. http://app.mobitru.com), other fields with valid data
4. Click on "Create" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. "Please provide a valid HTPPS URL" validation message is displayed under "Mobitru URL" field, modal window is still displayed, integration is not created

---

## Mobitru. Impossible to edit integration with HTTP "Mobitru URL" value

*Preconditions:*

User - Admin, "Mobitru" plugin is installed and enabled
Global Mobitru integration is created

*Steps:*

1. Go to "Plugins" page > Mobitru
2. Click on existing global integration
3. Click on "Edit" button
4. Fill "Mobitru URL" field with any http value (e.g. http://app.mobitru.com), other fields with new valid data
5. Click "Submit" button

*Expected results:*

2. 'Create Global Integration' modal window is opened
4. "Please provide a valid HTTPS URL" validation message is displayed under "Mobitru URL" field, integration is not updated
