# Test cases: EPMRPP-108273 — [UI][QA] Customizable columns in the Test execution table

**User story:** https://jiraeu.epam.com/browse/EPMRPP-108273

---

## Test Executions. 'Test Executions' table header

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# Project_1 is created
# User_1 is assigned to Project_1 with any project role (Project Manager, Member, Customer, Operator) 
# Multiple launches are reported on the project

*Steps:*
# Login as User_1
# Open Project_1
# Click 'Test executions' icon in the sidebar
# Observe the table's header

*Expected results:*

3. 'Test Executions' page is opened
4. Following elements in the header of the table are present:
 * 'Search results' table name
 * Statistics section with following values:
 ** 'Total' counter
 ** 'Passed' counter
 ** 'Failed' counter
 ** 'Skipped' counter
 ** 'In Progress' counter
 ** 'Interrupted' counter
 * 'Search' icon
 * 'Panel view' icon - {color:#FF0000}*hidden for now*{color}
 * 'Customize Columns' button with Settings icon
 * Table columns:
 ** 'Expand/collapse' icon
 ** 'Name' column
 ** 'Retries' column
 ** 'Start Time' column
 ** 'Status' column
 ** 'Defect Type' column
 ** 'Defect Comment' column

---

## Test Executions. "Customize Columns" modal window layout

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button

*Expected results:*

2. "Customize columns" modal window is displayed and contains:
- "Customize columns" title
- "Cross" icon button
- "Columns to display" text 
-* 1. Name with "Pin" icon
-* 2. Retries
-* 3. Start time
-* 4. Status
-* 5. Defect type
-* 6. Defect comment
-* *NOTE: All columns has "Cross" and "Drag" icons*
- "+ Add Column" button
- "Reset to default" button (disabled by default)
- "Cancel" button
- "Save" button (disabled by default)

---

## Test Executions. Possible to add new column to the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Select a column" dropdown, "Tick" and "Cross" button are displayed, "+Add column" button is not displayed
4. "Description" value is displayed in the dropdown
5. "Description" column is added to the bottom of the columns list with the last index number, "+Add column" and "Reset to default" buttons are enabled
6. "The table has been updated successfully" message is displayed in green bar, "Description" column is added to the table as the last column

---

## Test Executions. Possible to remove column from the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "Cross" icon near any column name (e.g. Defect comment)
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Defect comment" column is removed from the columns list, "Reset to default" button is enabled
4. "The table has been updated successfully" message is displayed in green bar, there is no "Defect comment" column in the table

---

## Test Executions. Impossible to remove "Name" column from the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Try to click on "Cross" icon near "Name" column

*Expected results:*

2. "Customize columns" modal window is displayed
3. Nothing happens, impossible to remove "Name" column from the table

---

## Test Executions. Possible to remove new added column from the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click on "Save" button
# Click on "Customize columns" button again
# Click on "Cross" icon near "Description" column
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "The table has been updated successfully" message is displayed in green bar, "Description" column is added to the table as the last column
7. "Customize columns" modal window is displayed again
8. "Description" column is removed from the columns list
9. "The table has been updated successfully" message is displayed in green bar, there is no "Description" column in the table

---

## Test Executions. Added column is no longer available in the "Add Column" dropdown

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Start time)
# Click on "Tick" icon
# Click on "+ Add Column" button again
# Try to find "Start time" value in the dropdown

*Expected results:*

2. "Customize columns" modal window is displayed
 4. "Start time" value is displayed in the dropdown
5. "Start time" column is added to the bottom of the columns list
7.  There is no "Start time" value in the dropdown anymore

---

## Test Executions. Removed column is available in the "Add Column" dropdown

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# "Test Executions" table has several columns
# User is assigned to Project  

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Try to find any of the selected columns in the dropdown (e.g. "Ignore in AA")
# Click on "Cross" icon near "Ignore in AA" column
# Click on "+ Add Column" button again
# Try to find "Ignore in AA" value in the dropdown

*Expected results:*

2. "Customize columns" modal window is displayed
4.  There is no "Ignore in AA" value in the dropdown
5. "Ignore in AA" column is removed from the columns list
7. "Ignore in AA" column is displayed in the dropdown

---

## Test Executions. Possible to remove all columns from the table except "Name"

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "Cross" icon near "Start time" column
# Click on "Cross" icon near "Status" column
# Click on "Cross" icon near "Defect type" column
# Click on "Cross" icon near "Defect comment" column
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
3-6. The column is removed from the columns list
7. "The table has been updated successfully" message is displayed in green bar, only "Name" column is displayed in the table

---

## Test Executions. "Reset to default" option returns table to default columns set

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# "Test Executions" table has default columns
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Remove several default columns
# Add some new columns (non-default columns)
# Reorder all columns in random positions
# Click on "Reset to default" button
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
5. List of selected columns in custom order is displayed
6. All custom columns are removed from the columns list, default columns are added back, order of column is set as by default:
- 1. Name
- 2. Retries
- 3. Start time
- 4. Status
- 5. Defect type
- 6. Defect comment

7. "The table has been updated successfully" message is displayed in green bar, the table has the following columns: 
- Name
- Retries
- Start time
- Status
- Defect type
- Defect comment

---

## Test Executions. "Add Column" dropdown available columns to select

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Put cursor in "Select a column" dropdown

*Expected results:*

4. "Add Column" dropdown contains the following columns:
- Analyzed by AA
- Attributes  
- Custom attribute
- Description
- Duration
- Execution type
- Ignore in AA  
- Issue in BTS 
- Launch owner
- Method type
- Test ID

---

## Test Executions. Cancelling changing columns in the table using "Cancel" button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click on "Cancel" button

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "Customize columns" modal window is closed,  "Description" column is not added to the table

---

## Test Executions. Cancelling changing columns in the table using "Cross" icon button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click on "Cross" icon button

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "Customize columns" modal window is closed,  "Description" column is not added to the table

---

## Test Executions. "Customize Columns" modal window closing by clicking somewhere outside the modal

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click somewhere outside the modal

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Customize columns" modal window is closed

---

## Test Executions. "Customize Columns" modal window is not closed when clicking somewhere outside the modal with changed data

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click somewhere outside the modal

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "Customize columns" modal window is not closed

---

## Test Executions. Сolumns width specifications

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# "Test Executions" table has default columns + all custom columns
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Verify columns widths in the table

*Expected results:*

2. The columns width is the following:
- Name - 300px
- Retries - 70px
- Start time - 140px
- Status - 120px
- Method type - 120px
- Analyzed by AA - 105px
- Ignore in AA - 105px
- Duration - 105px
- All other columns - 240px:
-* Defect type
-* Defect comment
-* Attributes  
-* Custom attribute
-* Description
-* Issue in BTS
-* Test ID

---

## Test Executions. All users can customize columns in the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is Admin

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click on "Save" button

*Repeat test case as Project Manager, Member, Customer, Operator*

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "The table has been updated successfully" message is displayed in green bar, "Description" column is added to the table as the last column

---

## Test Executions. Impossible to change "Name" column position in the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "Drag" icon near "Name" column and try to move the column

*Expected results:*

2. "Customize columns" modal window is displayed
3. Nothing happens, impossible to change position of "Name" column

---

## Test Executions. Possible to change columns position in the table

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "Drag" icon near any column name except "Name" and move the column to another position (e.g. Status)
# Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Status" column is changed its position from the third place to selected, all columns has correct index number in ascending order
4. "The table has been updated successfully" message is displayed in green bar, "Status" column is located in the new position in the table

---

## Test Executions. "Reset to default" button is disabled when the table has default set of columns

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Hover over "Reset to default" button
# Click on "Reset to default" button

*Expected results:*

2. "Customize columns" modal window is displayed, "Reset to default" button is disabled
3. "Columns are in default state already" tooltip appears
4. Nothing happens, set of columns is not changed

---

## Test Executions. "Reset to default" button is enabled when columns list is not in default state

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Remove one column
# Return back the removed column and put in to the original place
# Add new column
# Remove the added column
# Change the order of one column
# Change the order of the column back

*Expected results:*

2. "Customize columns" modal window is displayed, "Reset to default" button is disabled
3. "Reset to default" button is enabled
4. "Reset to default" button is disabled
5. "Reset to default" button is enabled
6. "Reset to default" button is disabled
7. "Reset to default" button is enabled
8. "Reset to default" button is disabled

---

## Test Executions. Possible to add all columns from "Add Column" dropdown

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project  

*Steps:*
1. Login as User -> Go to 'Test executions' page
2. Click on "Customize columns" button
3. Add the following columns:
- Analyzed by AA
- Attributes  
- Custom attribute
- Description
- Duration
- Execution type
- Ignore in AA  
- Issue in BTS 
- Launch owner
- Method type
- Test ID

4. Click on "Save" button

*Expected results:*

2. "Customize columns" modal window is displayed
3. All columns are added to the columns list
4. "The table has been updated successfully" message is displayed in green bar, all columns are added to the table. The columns order is the same as was selected in the modal window:
 - Name
 - Retries
 - Start time
 - Status
 - Defect type
 - Defect comment
 - Analyzed by AA
 - Attributes
 - Custom attribute
 - Description
 - Duration
 - Execution type
 - Ignore in AA
 - Issue in BTS
 - Launch owner
 - Method type
 - Test ID

---

## Test Executions. Impossible to change columns position in the table itself

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project

*Steps:*
# Login as User -> Go to 'Test executions' page
# Try to change any column position in the table (e.g. by Drag&Drop)

*Expected results:*

2. Impossible to do it in the table itself

---

## Test Executions. Columns configuration is saved in Local Storage

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# Several users are assigned to several Projects 

*Steps:*
# Login as User1 -> Go to 'Test executions' page of Project1
# Click on "Customize columns" button
# Add any column (e.g. Description)
# Click on "Save" button
# Go to any page of Project1 (e.g. "Project Settings" page)
# Go back to 'Test executions' page of Project1
# Go to 'Test executions' page of Project2
# Log out
# Login as User2 -> Go to 'Test executions' page of Project1
# Login as User1 in another browser -> Go to 'Test executions' page of Project1

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Description" column is added to the columns list
4. "The table has been updated successfully" message is displayed in green bar, "Description" column is added to the table
6. The table has default columns + "Description" column
7, 9, 10. The table has only default columns

---

## Test Executions. Possible to cancel adding new column to the columns list

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Cross" icon

*Expected results:*

2. "Customize columns" modal window is displayed
3. "Select a column" dropdown, "Tick" and "Cross" button are displayed, "+Add column" button is not displayed
4. "Description" value is displayed in the dropdown
5. "Select a column" dropdown, "Tick" and "Cross" button are not displayed anymore, "+Add column" button is displayed, new columns is not added to the columns list

---

## Test Executions. Cancelling changing columns in the table using "Esc" button

*Preconditions:*
# "Test Executions" plugin is installed and enabled
# User is assigned to Project 

*Steps:*
# Login as User -> Go to 'Test executions' page
# Click on "Customize columns" button
# Click on "+ Add Column" button
# Select any value in "Add Column" dropdown (e.g. Description)
# Click on "Tick" icon
# Click the 'Esc' button on the keyboard

*Expected results:*

2. "Customize columns" modal window is displayed
5. "Description" column is added to the bottom of the columns list
6. "Customize columns" modal window is closed,  "Description" column is not added to the table

---

