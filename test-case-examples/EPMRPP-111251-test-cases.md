# Test cases: EPMRPP-111251 — [UI][QA] Rename Filters icon to All Filters and add fields to side panel (Launch start time, Launch name, Launch attribute, Test name)

**User story:** https://jiraeu.epam.com/browse/EPMRPP-111251

---

## Test Executions. 'Test Executions' page layout (empty state)

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# Project_1 is created
# User_1 is assigned to Project_1 with any project role (Project Manager, Member, Customer, Operator) 

*Steps:*
# Login as User_1
# Open Project_1
# Click 'Test executions' icon in the sidebar
# Hover over "Beta" label

*Expected results:*

3. 'Test Executions' page is opened, following elements are present:
 * Page header:
 ** 'Beta' label 
 ** "Export" button
 ** "Refresh" button
 ** 'Launch start time' dropdown with datepicker, 'Last 7 days' chosen by default
 ** 'Launch names' autocomplete with multiselect, 'Refine by launch name' placeholder
 ** 'Launch attributes' with '+ Add attribute' button, by clicking on the button, a pop-up is opened with:
- fields 'Key' and 'Value' with 'Specify key' and 'Specify value' placeholders
- 'Tick' icon- disabled 
- 'Cross' ison - enabled
 ** "All Filters" button
 * Empty table with 'No results. 
There are no test execution results matching the selected filters.' text

4. "This feature is currently under development and testing.
Some functionality may be unstable or limited." tooltip is shown

---

## Test Executions. "Filters" panel layout and default state

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# At least one pattern exists

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button

*Expected results:*

2. "Filters" panel is displayed and contains:
- "Filters" title
- "Cross" icon button

- "Launch start time" (dropdown with datepicker)
-* "Last 7 days" default value in the dropdown
- "Launch names" (autocomplete field)
-* "Refine by launch name" placeholder in the dropdown
- "Launch owners" (autocomplete field)
-* "Refine by launch owner (login)" placeholder in the dropdown
- "Launch attributes" (autocomplete chips)
-* "+ Add Attribute" button

- "Test execution name" (autocomplete field)
-* "Enter test execution name" placeholder in the dropdown
- "Latest executions only" toggle (OFF is default state)
- "Execution type" (multi-select dropdown)
-* "Select execution type" placeholder in the dropdown
- "Status" (multi-select dropdown)
-* "Select test status" placeholder in the dropdown
- "Defect type" (two-level multi-select dropdown)
-* "Select defect type" placeholder in the dropdown
- "Start time" (dropdown + calendar)
-* "Select time range" placeholder in the dropdown
- "Test attributes" (autocomplete chips)
-* "+ Add Attribute" button
- "Description" (operator dropdown + text input)
-* Dropdown with "Contains" option selected by default
-* Text field with "Enter description" placeholder
- "Defect comment" (operator dropdown + text input)
-* Dropdown with "Contains" option selected by default
-* Text field with "Enter comment" placeholder
- "Issue in BTS"(operator dropdown + text input) 
-* Dropdown with "Any" value option selected by default
-* Text field with "Enter issue in BTS" placeholder
- "Method type" (multi-select dropdown)
-* "Select type" placeholder in the dropdown
- "Retry" dropdown
-* "Select state" placeholder in the dropdown
- "Pattern name" (multi-select dropdown) (when at least one pattern exists at the project)
-* "Select pattern" placeholder in the dropdown
- "Analysed by AA" (single-select dropdown)
-* "Select state" placeholder in the dropdown
- "Ignored in AA" (single-select dropdown)
-* "Select state" placeholder in the dropdown

- "Clear All" button (disabled by default)
- "Save Filter" button (disabled by default)
- "Cancel" button
- "Apply" button (disabled by default)

---

## Test Executions. "Filters" panel is closed when clicking somewhere outside the panel

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click somewhere outside the panel

*Expected results:*

2. "Filters" panel is displayed
3. "Filters" panel is closed

---

## Test Executions. "Filters" panel is not closed when clicking somewhere outside the panel with changed values

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Input valid value in any field OR Switch "Latest executions only" toggle to ON
# Click somewhere outside the panel

*Expected results:*

2. "Filters" panel is displayed
4. "Filters" panel is not closed

---

## Test Executions. The entered values are removed by clicking on the 'Clear All' button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Input valid value in any field
# Click on "Clear All" button

*Expected results:*

2. "Filters" panel is displayed
3. The values are displayed in the fields, 'Apply' button is enabled 
4. "Filters" panel is opened, the values are removed from the fields, 'Apply' button is disabled

---

## Test Executions. The number of applied additional filters is displayed in 'All Filters' button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Select any value in 'Status" dropdown and click the 'Apply' button
# Click on the "All Filters" button -> select any value in 'Defect type' dropdown -> click the 'Apply' button
# Click on the "All Filters" button -> select any value in 'Start time' dropdown -> click the 'Apply' button
# Click on the "All Filters" button -> remove any filter option (e.g. select 'Any' option in  'Start time' dropdown) -> click the 'Apply' button
# Click on the "All Filters" button -> switch "Latest executions only" toggle to ON -> click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
3. The panel is closed, the filter is applied, Filter icon is displayed with the number '+1' next to it
4. The panel is closed, the filter is applied, Filter icon is displayed with the number '+2' next to it
5. The panel is closed, the filter is applied, Filter icon is displayed with the number '+3' next to it
6. The panel is closed, the filter is applied, Filter icon is displayed with the number '+2' next to it
7. The panel is closed, the filter is applied, Filter icon is displayed with the number '+3' next to it

---

## Test Executions. 'No results' message is displayed when there are no tests matching the filter parameters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported
# The launch has several tests with different conditions:
#* Test1 has "Failed" status and was analyzed by AA
#* Test2 has "Failed" status and wasn't analyzed by AA
#* Test3 has "Skipped" status and was analyzed by AA
# The launch was reported twice

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Status" dropdown -> Select 'Failed' option from the dropdown
# Switch "Latest executions only" toggle to ON
# Click on "Analyzed by AA" dropdown -> Select 'With “AA” mark' option from the dropdown
# Input 'nonexistenttext12345' value into the 'Description' field
# Click the 'Apply' button

*Repeat test case with different filter parameters*

*Expected results:*

2. "Filters" panel is displayed
7. 'No results'
"There are no test execution results matching the selected filters." - message is displayed on the page
The 'All Filters' button, 'Search' icon and 'Cusomize columns' button are available in the header of the page

---

## Test Executions. Filtering tests by several filter parameters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported
# The launch has several tests with different conditions:
#* Test1 has "Failed" status, "Product bug" defect type and was analyzed by AA
#* Test2 has "Failed" status, "To investigate" defect type and wasn't analyzed by AA
#* Test3 has "Skipped" status, "Product bug" defect type and was analyzed by AA

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Defect type" dropdown -> Select 'Product bug' option from the dropdown
# Click on "Analyzed by AA" dropdown -> Select 'With “AA” mark' option from the dropdown
# Click on "Status" dropdown -> Select 'Failed' option from the dropdown
# Click the 'Apply' button

*Repeat test case with different filter parameters*

*Expected results:*

2. "Filters" panel is displayed
6. The panel is closed, only tests that match all filter parameters are displayed (Test1)

---

## Test Executions. 'Clear All' button removes applied filter parameters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported
# The launch has several tests with different conditions:
#* Test1 has "Failed" status, "Product bug" defect type and was analyzed by AA
#* Test2 has "Failed" status, "To investigate" defect type and wasn't analyzed by AA
#* Test3 has "Skipped" status, "Product bug" defect type and was analyzed by AA
# The launch was reported twice

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Defect type" dropdown -> Select 'Product bug' option from the dropdown
# Switch "Latest executions only" toggle to ON
# Click on "Analyzed by AA" dropdown -> Select 'With “AA” mark' option from the dropdown
# Click on "Status" dropdown -> Select 'Failed' option from the dropdown
# Click the 'Apply' button
# Click on "All Filters" button again
# Click on "Clear All" button
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
7. The panel is closed, only tests that match all filter parameters are displayed (Test1 from the latest launch)
10. The panel is closed, "All Filters" button is displayed without any number next to it, all tests are displayed

---

## Test Executions. 'Launch start time' filter dropdown values

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch start time" dropdown

*Expected results:*

2. "Filters" panel is displayed
3. The dropdown is expanded. Available options:
 * 'Today'
 * 'Last 2 days'
 * 'Last 3 days'
 * 'Last 7 days' (chosen by default)
 * 'Last 30 days'
 * 'Last 60 days'
 * 'Last 90 days'
 * 'Custom range' single field
* 'The maximum date range is 90 days' hint below the field from above

---

## Test Executions. Filtering tests by 'Launch start time' filter

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# Launch1 is reported 7 days ago
# Launch2 is reported 3 days ago

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch start time" dropdown
# Select "Last 3 days" option
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
4. "Launch start time" filter has "Last 3 days" value
5. The panel is closed, "Launch start time" main filter has "Last 3 days" value, only tests from Launch2 are displayed

---

## Test Executions. "Launch names" filter field shows autocomplete suggestions

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch names" field
# Start typing a launch name (e.g. e)

*Expected results:*

2. "Filters" panel is displayed
4. Suggestions show launches that match the typed text (e.g. 'Smoke', 'Regression')

---

## Test Executions. Filter tests by Launch name

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch names" field
# Start typing a launch name (e.g. e)
# Select 'Regression' value
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
5. 'Regression' value is displayed in "Launch names" field
6. The panel is closed, "Launch names" main filter has "Regression" value, only tests from 'Regression' launch are displayed

---

## Test Executions. Filter tests by several Launch names

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch names" field
# Start typing a launch name (e.g. r)
# Select 'Regression' value
# Click the 'Apply' button
# Click on "All Filters" button again
# Click on "Launch names" field again
# Start typing a launch name (e.g. l)
# Select 'Launch' value
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
5. 'Regression' value is displayed in "Launch names" field
6. The panel is closed, "Launch names" main filter has "Regression" value, only tests from 'Regression' launch are displayed
7. "Filters" panel is displayed 
10. 'Regression' and 'Launch' values are displayed in "Launch names" field
11. The panel is closed, "Launch names" main filter has "Regression" and "Launch" values, tests from both launches are displayed

---

## Test Executions. Impossible to select the same value in "Launch names" filter field

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with the same names are reported in the last 7 days (e.g 'Regression')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch names" field
# Start typing a launch name (e.g. r)
# Select 'Regression' value
# Click on "Launch names" field again
# Start typing the same launch name (e.g. re)

*Expected results:*

2. "Filters" panel is displayed
5. 'Regression' value is displayed in "Launch names" field
7. There are no suggestions, "No available options" text is displayed

---

## Test Executions. Possible to remove value from "Launch names" filter field

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Select two launches in "Launch names" field (e.g. 'Regression', 'Launch')
# Click on "X" icon near launch name (e.g. near 'Regression' launch)

*Expected results:*

2. "Filters" panel is displayed
3. 'Regression' and 'Launch' values are displayed in "Launch names" field
4. Only 'Launch' value is displayed in "Launch names" field

---

## Test Executions. Possible to remove all values from "Launch names" filter field

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Select two launches in "Launch names" field (e.g. 'Regression', 'Launch')
# Click on "Cross" icon in the field

*Expected results:*

2. "Filters" panel is displayed
2. 'Regression' and 'Launch' values are displayed in "Launch names" field
3. "Launch names" field is empty, "Refine by launch name" placeholder is displayed in the field

---

## Test Executions. Filter tests by 'Launch attribute' filter

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different attributes are reported in the last 7 days (e.g 'build:1.1', 'platform:Android', 'component:UI')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Add Attribute" button
# Specify attribute key and value (e.g. 'build:1.1')
# Click on "Tick" button
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
5. 'build:1.1' attribute label is displayed in "Launch attributes" section
6. The panel is closed, "Launch attributes" main filter has 'build:1.1' attribute label, only tests from the launch that has 'build:1.1' are displayed

---

## Test Executions. Filter tests by several 'Launch attributes' filters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different attributes are reported in the last 7 days (e.g 'build:1.1', 'platform:Android', 'component:UI')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Add Attribute" button
# Specify attribute key and value (e.g. 'build:1.1')
# Click on "Tick" button
# Click the 'Apply' button
# Click on "All Filters" button again
# Click on "Add Attribute" button again
# Specify another attribute key and value (e.g. 'component:UI')
# Click on "Tick" button
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
5. 'build:1.1' attribute label is displayed in "Launch attributes" section
6. The panel is closed, "Launch attributes" main filter has 'build:1.1' attribute label, only tests from the launch that has 'build:1.1' are displayed
7. "Filters" panel is displayed
10. 'build:1.1' and 'component:UI' attribute labels are displayed in "Launch attributes" section 
11. The panel is closed, "Launch attributes" main filter has 'build:1.1' and 'component:UI' attribute labels, tests from the launches that have 'build:1.1' and 'component:UI'  attributes are displayed

---

## Test Executions. Possible to remove launch attribute from "Launch attributes" filter

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different attributes are reported in the last 7 days (e.g 'build:1.1', 'platform:Android', 'component:UI')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Add Attribute" button
# Specify attribute key and value (e.g. 'build:1.1')
# Click on "Tick" button
# Click on 'Cross' icon for the Attribute

*Expected results:*

2. "Filters" panel is displayed
5. 'build:1.1' attribute label is displayed in "Launch attributes" section
6. Attribute is removed from "Launch attributes" section

---

## Test Executions. 'Test execution name' filter field validation (long value)

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Enter more than 256 characters in the "Test execution name" field (e.g. 260)

*Expected results:*

3. The "Test execution name" filed is filled with 256 characters, the rest of the value is cut off

---

## Test Executions. Possible to remove value from 'Test execution name' filter

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has two tests: Test1 and Test2

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Enter Test name in the "Test execution name" field (e.g. 'Test1')
# Click on 'Cross' icon in the "Test execution name" field

*Expected results:*

2. "Filters" panel is displayed
3. 'Test1' value is displayed in "Test execution name" field
4. "Test execution name" field is cleared

---

## Test Executions. Filter tests by 'Test execution name' filter

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has three tests: Test1, Test2, Login

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Enter 3 symbols in the "Test execution name" field (e.g. 'Tes')
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
3. 'Tes' value is displayed in "Test execution name" field
4. The panel is closed, "Search" field has 'Tes' value, only 'Test1' and 'Test2' are displayed in the table

---

## Test Executions. 'Test execution name' filter works by 'contains' principle

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has two tests: Test1 and Test2

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Enter 3 symbols in the "Test execution name" field (e.g. 'EST')
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
3. 'EST' value is displayed in "Test execution name" field
4. The panel is closed, "Search" field has 'EST' value, only 'Test1' and 'Test2' are displayed in the table

---

## Test Executions. 'Test execution name' filter field requires minimum of 3 entered symbols

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has three tests: Test1, Test2, Login

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Enter the first symbol in the "Test execution name" field (e.g. 'T')
# Click the 'Apply' button
# Enter the second symbol in the "Test execution name" field (e.g. 'Te')
# Enter the third symbol in the "Test execution name" field (e.g. 'Tes')

*Expected results:*

2. "Filters" panel is displayed
4. 'Apply' button is disabled, "Enter at least 3 symbols to apply filter" validation message is displayed under "Test execution name" field
5. "Enter at least 3 symbols to apply filter" validation message is displayed under the field
6. 'Apply' button is enabled, there is no validation message under the field

---

## Test Executions. "Cross" icon is displayed in "All Filters" button when applying main filters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Launch names" field
# Start typing a launch name (e.g. e)
# Select 'Regression' value

*Repeat test case with different main filters*

*Expected results:*

4. 'Regression' value is displayed in "Launch names" field, only tests from 'Regression' launch are displayed, "Cross" icon is displayed in "All Filters" button

---

## Test Executions. "Cross" icon is displayed in "All Filters" button when applying additional filters

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has tests with different statuses:
#* Test1 has "Passed" status
#* Test2 has "Failed" status
#* Test3 has "Skipped" status
#* Test4 has "Interrupted" status
#* Test5 has "In progress" status

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Status" dropdown
# Select 'Passed' option from the dropdown 
# Click the 'Apply' button

*Repeat test case with different additional filters*

*Expected results:*

2. "Filters" panel is displayed
5. The panel is closed, only tests that have "Passed" status are displayed in the list (Test1), 
"Cross" icon is displayed in "All Filters" button

---

## Test Executions. Possible to remove all filters using "Cross" icon in "All Filters" button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# At least one launch is reported
# The launch has tests with different statuses:
#* Test1 has "Passed" status
#* Test2 has "Failed" status
#* Test3 has "Skipped" status
#* Test4 has "Interrupted" status
#* Test5 has "In progress" status
# The launch was reported twice

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Status" dropdown
# Select 'Passed' option from the dropdown 
# Switch "Latest executions only" toggle to ON
# Click the 'Apply' button
# Click on "Cross" icon in "All Filters" button

*Repeat test case with different combinations main and additional filters*

*Expected results:*

2. "Filters" panel is displayed
6. The panel is closed, only tests that have "Passed" status are displayed in the list (Test1 from the latest launch), 
"Cross" icon is displayed in "All Filters" button
7. There is no "Cross" icon in "All Filters" button anymore, all tests are displayed

---

## Test Executions. Applied main filters are displayed in "Filters" panel

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 
# Several launches with different names are reported in the last 7 days (e.g 'Smoke', 'Regression', 'Launch')

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Launch names" field
# Start typing a launch name (e.g. e)
# Select 'Regression' value
# Click on "All Filters" button

*Repeat test case with different main filters*

*Expected results:*

4. 'Regression' value is displayed in "Launch names" field, only tests from 'Regression' launch are displayed
5. "Filters" panel is displayed, "Launch names" field has 'Regression' value

---

## Test Executions. The number of applied main filters is not displayed in 'All Filters' button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# At least one launch is reported

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Select any value in 'Status" dropdown and click the 'Apply' button
# Click on the "All Filters" button again
# Click on "Launch names" field -> Start typing a launch name (e.g. e) -> Select 'Regression' value
# Click the 'Apply' button

*Repeat test case with different combinations main and additional filters*

*Expected results:*

2. "Filters" panel is displayed
3. The panel is closed, the filter is applied, Filter icon is displayed with the number '+1' next to it
6. The panel is closed, the filter is applied, "Launch names" main filter has "Regression" value, Filter icon is displayed with the number '+1' next to it

---

## Test Executions. Filtering tests by 'Launch start time' filter using custom date range

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project
# Launch1 is reported 20 days ago
# Launch2 is reported 15 days ago

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "All Filters" button
# Click on "Launch start time" dropdown
# Select custom range (e.g. range of the last 17 days)
# Click the 'Apply' button

*Expected results:*

2. "Filters" panel is displayed
4. "Launch start time" filter has custom range value
5. The panel is closed, "Launch start time" main filter has custom range value, only tests from Launch2 are displayed

---

