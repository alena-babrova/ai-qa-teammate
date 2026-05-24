# Test cases: EPMRPP-114990 — [UI][QA] View Mobitru video on log level in Remote device tab

**User story:** https://jiraeu.epam.com/browse/EPMRPP-114990

---

## 1. Log level. "Remote device" tab. Tab is displayed when Mobitru video evidence exists

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
A launch is reported on the project, and the test item has Mobitru video evidence (MBID-correlated recording, produced by the US-LOG-MOB-001 flow)

*Steps:*

1. Login to RP as Admin
2. Go to "Launches" page -> Drill down to Log level of the test item that has Mobitru video evidence

*Expected results:*

2. Log level of the test item is opened, the sidebar tabs include the "Remote device" tab alongside the other test item tabs ("Item details", "History of actions", "Stack trace", "All logs", "Attachments")

---

## 2. Log level. "Remote device" tab. Tab is hidden when no Mobitru video evidence exists

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
A launch is reported on the project, and the test item has *no* Mobitru video evidence

*Steps:*

1. Login to RP as Admin
2. Go to "Launches" page -> Drill down to Log level of the test item that has no Mobitru video evidence

*Expected results:*

2. Log level of the test item is opened, "Remote device" tab is *not* displayed in the sidebar tabs

---

## 3. Log level. "Remote device" tab. Tab content layout

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has Mobitru video evidence

*Steps:*

1. Login to RP as Admin
2. Go to Log level of the test item that has Mobitru video evidence
3. Click on "Remote device" tab

*Expected results:*

3. "Remote device" tab is selected, the tab content is displayed with the following:
   - Mobitru video player with playback controls (Play / Pause)
   - Current time / total duration timestamp on the player
   - Session metadata block (e.g. ID, Start Time, End Time, Owner, Device, OS, Browser, Automation Backend)

---

## 4. Log level. "Remote device" tab. Video playback

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has Mobitru video evidence

*Steps:*

1. Login to RP as Admin
2. Go to Log level of the test item that has Mobitru video evidence
3. Click on "Remote device" tab
4. Click "Play" control on the video player
5. Click "Pause" control on the video player

*Expected results:*

3. "Remote device" tab is selected, Mobitru video is loaded and ready to play (Play control is enabled, current time = `00:00`, total duration is shown)
4. Video starts playing, current time progresses
5. Video is paused, current time stops progressing at the paused position

---

## 5. Log level. "Remote device" tab. Multiple Mobitru videos are displayed for the test item

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has more than one Mobitru video linked (multiple MBIDs)

*Steps:*

1. Login to RP as Admin
2. Go to Log level of the test item that has multiple Mobitru videos
3. Click on "Remote device" tab

*Expected results:*

3. "Remote device" tab is selected, **all** Mobitru videos linked to the current test item are displayed (none of them is omitted); each video is viewable with its own player

---

## 6. Log level. "Remote device" tab. Switching between tabs preserves Remote device content

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has Mobitru video evidence

*Steps:*

1. Login to RP as Admin
2. Go to Log level of the test item that has Mobitru video evidence
3. Click on "Remote device" tab
4. Click on "Stack trace" tab
5. Click on "Remote device" tab again

*Expected results:*

3. "Remote device" tab is selected, Mobitru video(s) are displayed
4. "Stack trace" tab is selected, "Remote device" content is hidden
5. "Remote device" tab is selected again, the same Mobitru video(s) are displayed

---

## 7. Log level. "Remote device" tab. Permissions. Manager, Editor, Viewer can view Mobitru videos

*Preconditions:*

"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has Mobitru video evidence
User is project Manager / Member-editor / Member-viewer (assigned to the project)

*Steps:*

1. Login to RP as the user from the preconditions
2. Go to Log level of the test item that has Mobitru video evidence
3. Click on "Remote device" tab
4. Click "Play" on the video player

*Repeat test case as Manager, Member-editor, Member-viewer*

*Expected results:*

2. Log level of the test item is opened, "Remote device" tab is displayed in the sidebar tabs
3. "Remote device" tab is selected, Mobitru video(s) are displayed for view in *read-only* mode (no edit / delete / upload controls are present on the tab)
4. Video plays

---

## 8. Log level. "Remote device" tab. Failure state when video cannot be loaded

*Preconditions:*

User - Admin
"Mobitru" plugin is installed and enabled
Mobitru global or project integration is created
Test item has Mobitru video evidence, but the video source is unreachable (e.g. Mobitru is down, video file is missing, network failure)

*Steps:*

1. Login to RP as Admin
2. Go to Log level of the test item that has Mobitru video evidence
3. Click on "Remote device" tab
4. Click on "Stack trace" tab

*Expected results:*

3. "Remote device" tab is selected, a *non-blocking* error state/message is displayed in place of the video (e.g. "Video cannot be loaded"); the rest of the Log level page remains usable — other sidebar tabs ("Item details", "Stack trace", "All logs", "Attachments") can be opened, navigation away from the test item works
4. "Stack trace" tab is opened normally, no global error is shown
