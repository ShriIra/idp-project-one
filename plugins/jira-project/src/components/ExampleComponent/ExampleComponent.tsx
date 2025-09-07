/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ExampleComponent.tsx

// added summary view
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect, ChangeEvent } from 'react';
// import {
//   Typography,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Card,
//   CardContent,
//   IconButton,
//   Tabs,
//   Tab,
// } from '@material-ui/core';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from 'react-beautiful-dnd';
// import { format, parseISO, differenceInDays } from 'date-fns';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import type { EventClickArg } from '@fullcalendar/core';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   assignee: string;
//   reporter: string;
//   team: string;
//   parentId: number | null;
//   start_date: string;
//   due_date: string;
//   created_at: string;
//   updated_at: string;
//   priority: string | null;
//   status: string | null;
//   labels: string | null;
//   attachmentUrl: string | null;
// };

// export const ExampleComponent = () => {
//   const [open, setOpen] = useState(false);
//   const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
//   const [tab, setTab] = useState<'summary' | 'board' | 'calendar'>('summary'); // 👈 Added Summary
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     type: '',
//     assignee: '',
//     reporter: '',
//     team: '',
//     parentId: '',
//     start_date: '',
//     due_date: '',
//     priority: '',
//     status: '',
//     labels: '',
//     attachmentUrl: '',
//   });

//   const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);

//   const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
//   const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];

//   const handleOpen = () => {
//     setEditingIssueId(null);
//     setFormData({
//       title: '',
//       description: '',
//       type: '',
//       assignee: '',
//       reporter: '',
//       team: '',
//       parentId: '',
//       start_date: '',
//       due_date: '',
//       priority: '',
//       status: '',
//       labels: '',
//       attachmentUrl: '',
//     });
//     setOpen(true);
//   };
//   const handleClose = () => setOpen(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData({ ...formData, attachmentUrl: file.name });
//     }
//   };

//   const fetchCreatedIssues = async () => {
//     try {
//       const res = await fetch('http://localhost:7007/api/jira-project/issues');
//       if (res.ok) {
//         const data: Issue[] = await res.json();
//         setCreatedIssues(data);
//       }
//     } catch (error) {
//       console.error('Error fetching issues:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingIssueId) {
//         const response = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${editingIssueId}`,
//           {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const updatedIssue: Issue = await response.json();
//           setCreatedIssues(prev =>
//             prev.map(issue =>
//               issue.id === editingIssueId ? updatedIssue : issue,
//             ),
//           );
//           alert('Issue updated successfully');
//         } else {
//           alert('Failed to update issue');
//         }
//       } else {
//         const response = await fetch(
//           'http://localhost:7007/api/jira-project/issues',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const newIssue: Issue = await response.json();
//           alert('Issue created successfully');
//           setCreatedIssues(prev => [...prev, newIssue]);
//         } else {
//           alert('Failed to create issue');
//         }
//       }
//       setOpen(false);
//     } catch (error) {
//       console.error(error);
//       alert('Error saving issue');
//     }
//   };

//   const handleEdit = (issue: Issue) => {
//     setEditingIssueId(issue.id);
//     setFormData({
//       title: issue.title || '',
//       description: issue.description || '',
//       type: issue.type || '',
//       assignee: issue.assignee || '',
//       reporter: issue.reporter || '',
//       team: issue.team || '',
//       parentId: issue.parentId ? String(issue.parentId) : '',
//       start_date: issue.start_date || '',
//       due_date: issue.due_date || '',
//       priority: issue.priority || '',
//       status: issue.status || '',
//       labels: issue.labels || '',
//       attachmentUrl: issue.attachmentUrl || '',
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this issue?')) return;
//     try {
//       const res = await fetch(
//         `http://localhost:7007/api/jira-project/issues/${id}`,
//         {
//           method: 'DELETE',
//         },
//       );
//       if (res.ok) {
//         setCreatedIssues(prev => prev.filter(issue => issue.id !== id));
//         alert('Issue deleted successfully');
//       } else {
//         alert('Failed to delete issue');
//       }
//     } catch (error) {
//       console.error('Error deleting issue:', error);
//       alert('Error deleting issue');
//     }
//   };

//   useEffect(() => {
//     fetchCreatedIssues();
//   }, []);

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const { source, destination } = result;
//     if (source.droppableId === destination.droppableId) return;

//     const movedIssueId = result.draggableId;
//     const updatedIssues = createdIssues.map(issue =>
//       issue.id.toString() === movedIssueId
//         ? { ...issue, status: destination.droppableId }
//         : issue,
//     );
//     setCreatedIssues(updatedIssues);

//     const movedIssue = updatedIssues.find(
//       i => i.id.toString() === movedIssueId,
//     );
//     if (movedIssue) {
//       try {
//         const res = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${movedIssue.id}/status`,
//           {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: movedIssue.status }),
//           },
//         );
//         if (!res.ok) {
//           console.error('Failed to update issue status');
//         }
//       } catch (error) {
//         console.error('Error updating issue status:', error);
//       }
//     }
//   };

//   // SUMMARY LOGIC
//   const now = new Date();
//   const last7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.created_at)) <= 7,
//   );
//   const updated7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const completed7Days = createdIssues.filter(
//     i =>
//       i.status === 'Done' && differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const dueSoon = createdIssues.filter(
//     i =>
//       i.due_date &&
//       differenceInDays(new Date(i.due_date), now) >= 0 &&
//       differenceInDays(new Date(i.due_date), now) <= 7,
//   );

//   const statusCounts = statuses.map(s => ({
//     name: s,
//     value: createdIssues.filter(i => (i.status || 'To Do') === s).length,
//   }));

//   const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>
//       <Content>
//         {/* View toggle tabs */}
//         <Tabs
//           value={tab}
//           onChange={(_, newVal) => setTab(newVal)}
//           indicatorColor="primary"
//           textColor="primary"
//         >
//           <Tab value="summary" label="Summary" />
//           <Tab value="board" label="Board View" />
//           <Tab value="calendar" label="Calendar View" />
//         </Tabs>

//         {/* Create Issue Button */}
//         <Grid item>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginTop: '16px' }}
//             onClick={handleOpen}
//           >
//             Create Issue
//           </Button>
//         </Grid>

//         {/* SUMMARY VIEW */}
//         {tab === 'summary' && (
//           <Grid container spacing={2} style={{ marginTop: 16 }}>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✅ <strong>{completed7Days.length} completed</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✏️ <strong>{updated7Days.length} updated</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>➕ {last7Days.length} created</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>📅 {dueSoon.length} due soon</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} style={{ marginTop: 20 }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Status overview</Typography>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={statusCounts}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={100}
//                         label
//                       >
//                         {statusCounts.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         )}

//         {/* BOARD VIEW */}
//         {tab === 'board' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Grid container spacing={2}>
//                 {statuses.map(status => (
//                   <Grid item xs={3} key={status}>
//                     <Typography
//                       variant="h6"
//                       align="center"
//                       style={{ marginBottom: '8px' }}
//                     >
//                       {status}
//                     </Typography>
//                     <Droppable droppableId={status}>
//                       {provided => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           style={{
//                             minHeight: '300px',
//                             backgroundColor: '#f4f5f7',
//                             padding: '8px',
//                             borderRadius: '8px',
//                           }}
//                         >
//                           {createdIssues
//                             .filter(
//                               issue => (issue.status || 'To Do') === status,
//                             )
//                             .map((issue, index) => (
//                               <Draggable
//                                 key={issue.id.toString()}
//                                 draggableId={issue.id.toString()}
//                                 index={index}
//                               >
//                                 {providedDraggable => (
//                                   <Card
//                                     ref={providedDraggable.innerRef}
//                                     {...providedDraggable.draggableProps}
//                                     {...providedDraggable.dragHandleProps}
//                                     style={{
//                                       marginBottom: '8px',
//                                       ...providedDraggable.draggableProps.style,
//                                     }}
//                                   >
//                                     <CardContent>
//                                       <div
//                                         style={{
//                                           display: 'flex',
//                                           justifyContent: 'space-between',
//                                         }}
//                                       >
//                                         <div>
//                                           <Typography
//                                             variant="subtitle2"
//                                             color="textSecondary"
//                                           >
//                                             {issue.type}
//                                           </Typography>
//                                           <Typography variant="h6">
//                                             {issue.title}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Priority: {issue.priority ?? 'N/A'}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Assignee: {issue.assignee}
//                                           </Typography>
//                                         </div>
//                                         <div>
//                                           <IconButton
//                                             onClick={() => handleEdit(issue)}
//                                           >
//                                             <EditIcon fontSize="small" />
//                                           </IconButton>
//                                           <IconButton
//                                             onClick={() =>
//                                               handleDelete(issue.id)
//                                             }
//                                           >
//                                             <DeleteIcon fontSize="small" />
//                                           </IconButton>
//                                         </div>
//                                       </div>
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   </Grid>
//                 ))}
//               </Grid>
//             </DragDropContext>
//           </Grid>
//         )}

//         {/* CALENDAR VIEW */}
//         {tab === 'calendar' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <Typography variant="h6" style={{ marginBottom: 16 }}>
//               Calendar View
//             </Typography>
//             <div
//               style={{
//                 background: 'white',
//                 padding: '16px',
//                 borderRadius: '8px',
//               }}
//             >
//               <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 headerToolbar={{
//                   left: 'prev,next today',
//                   center: 'title',
//                   right: 'dayGridMonth,dayGridWeek,dayGridDay',
//                 }}
//                 events={createdIssues
//                   .filter(issue => issue.start_date || issue.due_date)
//                   .map(issue => ({
//                     id: issue.id.toString(),
//                     title: `${issue.title}`,
//                     start: issue.start_date || issue.due_date,
//                     end: issue.due_date || issue.start_date,
//                   }))}
//                 eventClick={(info: EventClickArg) => {
//                   const issue = createdIssues.find(
//                     i => i.id.toString() === info.event.id,
//                   );
//                   if (issue) {
//                     handleEdit(issue);
//                   }
//                 }}
//                 height="auto"
//               />
//             </div>
//           </Grid>
//         )}
//       </Content>

//       {/* CREATE/EDIT DIALOG */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           {editingIssueId ? 'Edit Issue' : 'Create New Issue'}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             label="Issue Type"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             {issueTypes.map(type => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             {statuses.map(status => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </TextField>

//           {formData.type && (
//             <>
//               <TextField
//                 label="Title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={3}
//               />
//               <TextField
//                 label="Assignee"
//                 name="assignee"
//                 value={formData.assignee}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Reporter"
//                 name="reporter"
//                 value={formData.reporter}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Team"
//                 name="team"
//                 value={formData.team}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Parent ID"
//                 name="parentId"
//                 value={formData.parentId}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 name="start_date"
//                 value={formData.start_date}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Due Date"
//                 type="date"
//                 name="due_date"
//                 value={formData.due_date}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Labels"
//                 name="labels"
//                 value={formData.labels}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <label
//                 htmlFor="attachment"
//                 style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}
//               >
//                 Attachment URL
//               </label>
//               <input
//                 id="attachment"
//                 type="file"
//                 name="attachment"
//                 onChange={handleFileChange}
//                 style={{ marginTop: '8px', display: 'block' }}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             {editingIssueId ? 'Save Changes' : 'Create Issue'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Page>
//   );
// };
/** ******************************************************************************************************************* */

// import React, { useState, useEffect, ChangeEvent } from 'react';
// import {
//   Typography,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Card,
//   CardContent,
//   IconButton,
//   Tabs,
//   Tab,
// } from '@material-ui/core';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from 'react-beautiful-dnd';
// import { differenceInDays } from 'date-fns';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// import type { EventClickArg } from '@fullcalendar/core';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   assignee: string;
//   reporter: string;
//   team: string;
//   parentId: number | null;
//   start_date: string;
//   due_date: string;
//   created_at: string;
//   updated_at: string;
//   priority: string | null;
//   status: string | null;
//   labels: string | null;
//   attachmentUrl: string | null;
// };

// export const ExampleComponent = () => {
//   const [open, setOpen] = useState(false);
//   const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
//   const [tab, setTab] = useState<'summary' | 'board' | 'calendar' | 'timeline'>(
//     'summary',
//   );
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     type: '',
//     assignee: '',
//     reporter: '',
//     team: '',
//     parentId: '',
//     start_date: '',
//     due_date: '',
//     priority: '',
//     status: '',
//     labels: '',
//     attachmentUrl: '',
//   });

//   const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);

//   const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
//   const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];

//   const handleOpen = () => {
//     setEditingIssueId(null);
//     setFormData({
//       title: '',
//       description: '',
//       type: '',
//       assignee: '',
//       reporter: '',
//       team: '',
//       parentId: '',
//       start_date: '',
//       due_date: '',
//       priority: '',
//       status: '',
//       labels: '',
//       attachmentUrl: '',
//     });
//     setOpen(true);
//   };
//   const handleClose = () => setOpen(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData({ ...formData, attachmentUrl: file.name });
//     }
//   };

//   const fetchCreatedIssues = async () => {
//     try {
//       const res = await fetch('http://localhost:7007/api/jira-project/issues');
//       if (res.ok) {
//         const data: Issue[] = await res.json();
//         setCreatedIssues(data);
//       }
//     } catch (error) {
//       console.error('Error fetching issues:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingIssueId) {
//         const response = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${editingIssueId}`,
//           {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const updatedIssue: Issue = await response.json();
//           setCreatedIssues(prev =>
//             prev.map(issue =>
//               issue.id === editingIssueId ? updatedIssue : issue,
//             ),
//           );
//           alert('Issue updated successfully');
//         } else {
//           alert('Failed to update issue');
//         }
//       } else {
//         const response = await fetch(
//           'http://localhost:7007/api/jira-project/issues',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const newIssue: Issue = await response.json();
//           alert('Issue created successfully');
//           setCreatedIssues(prev => [...prev, newIssue]);
//         } else {
//           alert('Failed to create issue');
//         }
//       }
//       setOpen(false);
//     } catch (error) {
//       console.error(error);
//       alert('Error saving issue');
//     }
//   };

//   const handleEdit = (issue: Issue) => {
//     setEditingIssueId(issue.id);
//     setFormData({
//       title: issue.title || '',
//       description: issue.description || '',
//       type: issue.type || '',
//       assignee: issue.assignee || '',
//       reporter: issue.reporter || '',
//       team: issue.team || '',
//       parentId: issue.parentId ? String(issue.parentId) : '',
//       start_date: issue.start_date || '',
//       due_date: issue.due_date || '',
//       priority: issue.priority || '',
//       status: issue.status || '',
//       labels: issue.labels || '',
//       attachmentUrl: issue.attachmentUrl || '',
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this issue?')) return;
//     try {
//       const res = await fetch(
//         `http://localhost:7007/api/jira-project/issues/${id}`,
//         {
//           method: 'DELETE',
//         },
//       );
//       if (res.ok) {
//         setCreatedIssues(prev => prev.filter(issue => issue.id !== id));
//         alert('Issue deleted successfully');
//       } else {
//         alert('Failed to delete issue');
//       }
//     } catch (error) {
//       console.error('Error deleting issue:', error);
//       alert('Error deleting issue');
//     }
//   };

//   useEffect(() => {
//     fetchCreatedIssues();
//   }, []);

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const { source, destination } = result;
//     if (source.droppableId === destination.droppableId) return;

//     const movedIssueId = result.draggableId;
//     const updatedIssues = createdIssues.map(issue =>
//       issue.id.toString() === movedIssueId
//         ? { ...issue, status: destination.droppableId }
//         : issue,
//     );
//     setCreatedIssues(updatedIssues);

//     const movedIssue = updatedIssues.find(
//       i => i.id.toString() === movedIssueId,
//     );
//     if (movedIssue) {
//       try {
//         const res = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${movedIssue.id}/status`,
//           {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: movedIssue.status }),
//           },
//         );
//         if (!res.ok) {
//           console.error('Failed to update issue status');
//         }
//       } catch (error) {
//         console.error('Error updating issue status:', error);
//       }
//     }
//   };

//   // SUMMARY LOGIC
//   const now = new Date();
//   const last7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.created_at)) <= 7,
//   );
//   const updated7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const completed7Days = createdIssues.filter(
//     i =>
//       i.status === 'Done' && differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const dueSoon = createdIssues.filter(
//     i =>
//       i.due_date &&
//       differenceInDays(new Date(i.due_date), now) >= 0 &&
//       differenceInDays(new Date(i.due_date), now) <= 7,
//   );

//   const statusCounts = statuses.map(s => ({
//     name: s,
//     value: createdIssues.filter(i => (i.status || 'To Do') === s).length,
//   }));

//   const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>
//       <Content>
//         {/* View toggle tabs */}
//         <Tabs
//           value={tab}
//           onChange={(_, newVal) => setTab(newVal)}
//           indicatorColor="primary"
//           textColor="primary"
//         >
//           <Tab value="summary" label="Summary" />
//           <Tab value="board" label="Board View" />
//           <Tab value="calendar" label="Calendar View" />
//           <Tab value="timeline" label="Timeline View" />
//         </Tabs>

//         {/* Create Issue Button */}
//         <Grid item>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginTop: '16px' }}
//             onClick={handleOpen}
//           >
//             Create Issue
//           </Button>
//         </Grid>

//         {/* SUMMARY VIEW */}
//         {tab === 'summary' && (
//           <Grid container spacing={2} style={{ marginTop: 16 }}>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✅ <strong>{completed7Days.length} completed</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✏️ <strong>{updated7Days.length} updated</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>➕ {last7Days.length} created</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>📅 {dueSoon.length} due soon</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} style={{ marginTop: 20 }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Status overview</Typography>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={statusCounts}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={100}
//                         label
//                       >
//                         {statusCounts.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         )}

//         {/* BOARD VIEW */}
//         {tab === 'board' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Grid container spacing={2}>
//                 {statuses.map(status => (
//                   <Grid item xs={3} key={status}>
//                     <Typography
//                       variant="h6"
//                       align="center"
//                       style={{ marginBottom: '8px' }}
//                     >
//                       {status}
//                     </Typography>
//                     <Droppable droppableId={status}>
//                       {provided => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           style={{
//                             minHeight: '300px',
//                             backgroundColor: '#f4f5f7',
//                             padding: '8px',
//                             borderRadius: '8px',
//                           }}
//                         >
//                           {createdIssues
//                             .filter(
//                               issue => (issue.status || 'To Do') === status,
//                             )
//                             .map((issue, index) => (
//                               <Draggable
//                                 key={issue.id.toString()}
//                                 draggableId={issue.id.toString()}
//                                 index={index}
//                               >
//                                 {providedDraggable => (
//                                   <Card
//                                     ref={providedDraggable.innerRef}
//                                     {...providedDraggable.draggableProps}
//                                     {...providedDraggable.dragHandleProps}
//                                     style={{
//                                       marginBottom: '8px',
//                                       ...providedDraggable.draggableProps.style,
//                                     }}
//                                   >
//                                     <CardContent>
//                                       <div
//                                         style={{
//                                           display: 'flex',
//                                           justifyContent: 'space-between',
//                                         }}
//                                       >
//                                         <div>
//                                           <Typography
//                                             variant="subtitle2"
//                                             color="textSecondary"
//                                           >
//                                             {issue.type}
//                                           </Typography>
//                                           <Typography variant="h6">
//                                             {issue.title}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Priority: {issue.priority ?? 'N/A'}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Assignee: {issue.assignee}
//                                           </Typography>
//                                         </div>
//                                         <div>
//                                           <IconButton
//                                             onClick={() => handleEdit(issue)}
//                                           >
//                                             <EditIcon fontSize="small" />
//                                           </IconButton>
//                                           <IconButton
//                                             onClick={() =>
//                                               handleDelete(issue.id)
//                                             }
//                                           >
//                                             <DeleteIcon fontSize="small" />
//                                           </IconButton>
//                                         </div>
//                                       </div>
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   </Grid>
//                 ))}
//               </Grid>
//             </DragDropContext>
//           </Grid>
//         )}

//         {/* CALENDAR VIEW */}
//         {tab === 'calendar' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <Typography variant="h6" style={{ marginBottom: 16 }}>
//               Calendar View
//             </Typography>
//             <div
//               style={{
//                 background: 'white',
//                 padding: '16px',
//                 borderRadius: '8px',
//               }}
//             >
//               <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 headerToolbar={{
//                   left: 'prev,next today',
//                   center: 'title',
//                   right: 'dayGridMonth,dayGridWeek,dayGridDay',
//                 }}
//                 events={createdIssues
//                   .filter(issue => issue.start_date || issue.due_date)
//                   .map(issue => ({
//                     id: issue.id.toString(),
//                     title: `${issue.title}`,
//                     start: issue.start_date || issue.due_date,
//                     end: issue.due_date || issue.start_date,
//                   }))}
//                 eventClick={(info: EventClickArg) => {
//                   const issue = createdIssues.find(
//                     i => i.id.toString() === info.event.id,
//                   );
//                   if (issue) {
//                     handleEdit(issue);
//                   }
//                 }}
//                 height="auto"
//               />
//             </div>
//           </Grid>
//         )}

//         {/* TIMELINE VIEW */}
// {tab === 'timeline' && (
//   <Grid item style={{ marginTop: 16 }}>
//     <Typography variant="h6" style={{ marginBottom: 16 }}>
//       Timeline View
//     </Typography>
//     <div
//       style={{
//         background: 'white',
//         padding: '16px',
//         borderRadius: '8px',
//       }}
//     >
//       <FullCalendar
//         {...({
//           plugins: [resourceTimelinePlugin, interactionPlugin],
//           initialView: 'resourceTimelineMonth',
//           schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
//           headerToolbar: {
//             left: 'prev,next today',
//             center: 'title',
//             right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
//           },
//           resources: createdIssues.map(issue => ({
//             id: issue.id.toString(),
//             title: issue.title,
//           })),
//           events: createdIssues
//             .filter(issue => issue.start_date && issue.due_date)
//             .map(issue => ({
//               id: issue.id.toString(),
//               resourceId: issue.id.toString(),
//               title: `${issue.title} (${issue.assignee})`,
//               start: issue.start_date,
//               end: issue.due_date,
//             })),
//           eventClick: (info: EventClickArg) => {
//             const issue = createdIssues.find(i => i.id.toString() === info.event.id);
//             if (issue) handleEdit(issue);
//           },
//           height: '80vh',
//         } as any)}
//       />

//     </div>
//   </Grid>
// )}
//       </Content>

//       {/* CREATE/EDIT DIALOG */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           {editingIssueId ? 'Edit Issue' : 'Create New Issue'}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             label="Issue Type"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             {issueTypes.map(type => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           >
//             {statuses.map(status => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </TextField>

//           {formData.type && (
//             <>
//               <TextField
//                 label="Tittle"
//                 name='title'
//                 value={formData.title}
//                 onChange={handleChange}
//                 fullWidth
//                 margin='normal'
//               />
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//               />
//               <TextField
//                 label="Assignee"
//                 name="assignee"
//                 value={formData.assignee}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Reporter"
//                 name="reporter"
//                 value={formData.reporter}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Team"
//                 name="team"
//                 value={formData.team}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Parent ID"
//                 name="parentId"
//                 value={formData.parentId}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 name="start_date"
//                 value={formData.start_date}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Due Date"
//                 type="date"
//                 name="due_date"
//                 value={formData.due_date}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 label="Priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Labels"
//                 name="labels"
//                 value={formData.labels}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <label
//                 htmlFor="attachment"
//                 style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}
//               >
//                 Attachment URL
//               </label>
//               <input
//                 id="attachment"
//                 type="file"
//                 name="attachment"
//                 onChange={handleFileChange}
//                 style={{ marginTop: '8px', display: 'block' }}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary" variant="contained">
//             {editingIssueId ? 'Save Changes' : 'Create Issue'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Page>
//   );
// };

/* ********************************************************************************************************************************* */
// import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
// import {
//   Typography,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Card,
//   CardContent,
//   IconButton,
//   Tabs,
//   Tab,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   InputAdornment,
//   Toolbar,
//   Chip,
// } from '@material-ui/core';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from 'react-beautiful-dnd';
// import { differenceInDays } from 'date-fns';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// import type { EventClickArg } from '@fullcalendar/core';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import SearchIcon from '@material-ui/icons/Search';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import ViewModuleIcon from '@material-ui/icons/ViewModule';
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import AddIcon from '@material-ui/icons/Add';

// type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   assignee: string;
//   reporter: string;
//   team: string;
//   parentId: number | null;
//   start_date: string;
//   due_date: string;
//   created_at: string;
//   updated_at: string;
//   priority: string | null;
//   status: string | null;
//   labels: string | null;
//   attachmentUrl: string | null;
//   comments?: string[];
// };

// export const ExampleComponent = () => {
//   const [open, setOpen] = useState(false);
//   const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
//   const [tab, setTab] = useState<
//     'summary' | 'board' | 'calendar' | 'timeline' | 'list' | 'allwork'
//   >('allwork');
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     type: '',
//     assignee: '',
//     reporter: '',
//     team: '',
//     parentId: '',
//     start_date: '',
//     due_date: '',
//     priority: '',
//     status: '',
//     labels: '',
//     attachmentUrl: '',
//   });

//   const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [commentDialogOpen, setCommentDialogOpen] = useState(false);
//   const [currentIssueId, setCurrentIssueId] = useState<number | null>(null);
//   const [commentText, setCommentText] = useState('');

//   const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
//   const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];

//   const [columns, setColumns] = useState([
//     { id: 'checkbox', label: '', width: 50 },
//     { id: 'key', label: 'Key', width: 100 },
//     { id: 'summary', label: 'Summary', width: 250 },
//     { id: 'type', label: 'Type', width: 100 },
//     { id: 'status', label: 'Status', width: 100 },
//     { id: 'priority', label: 'Priority', width: 100 },
//     { id: 'reporter', label: 'Reporter', width: 150 },
//     { id: 'assignee', label: 'Assignee', width: 150 },
//     { id: 'team', label: 'Team', width: 100 },
//     { id: 'dueDate', label: 'Due Date', width: 150 },
//     { id: 'comments', label: 'Comments', width: 150 },
//     { id: 'actions', label: 'Actions', width: 100, align: 'right' },
//   ]);

//   const [groupBy, setGroupBy] = useState<string>('None');

//   const handleOpen = () => {
//     setEditingIssueId(null);
//     setFormData({
//       title: '',
//       description: '',
//       type: '',
//       assignee: '',
//       reporter: '',
//       team: '',
//       parentId: '',
//       start_date: '',
//       due_date: '',
//       priority: '',
//       status: '',
//       labels: '',
//       attachmentUrl: '',
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData({ ...formData, attachmentUrl: file.name });
//     }
//   };

//   const fetchCreatedIssues = async () => {
//     try {
//       const res = await fetch('http://localhost:7007/api/jira-project/issues');
//       if (res.ok) {
//         const data: Issue[] = await res.json();
//         setCreatedIssues(data);
//       }
//     } catch (error) {
//       console.error('Error fetching issues:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editingIssueId) {
//         const response = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${editingIssueId}`,
//           {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const updatedIssue: Issue = await response.json();
//           setCreatedIssues(prev =>
//             prev.map(issue =>
//               issue.id === editingIssueId ? updatedIssue : issue,
//             ),
//           );
//           alert('Issue updated successfully');
//         } else {
//           alert('Failed to update issue');
//         }
//       } else {
//         const response = await fetch(
//           'http://localhost:7007/api/jira-project/issues',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//           },
//         );
//         if (response.ok) {
//           const newIssue: Issue = await response.json();
//           alert('Issue created successfully');
//           setCreatedIssues(prev => [...prev, newIssue]);
//         } else {
//           alert('Failed to create issue');
//         }
//       }
//       setOpen(false);
//     } catch (error) {
//       console.error(error);
//       alert('Error saving issue');
//     }
//   };

//   const handleEdit = (issue: Issue) => {
//     setEditingIssueId(issue.id);
//     setFormData({
//       title: issue.title || '',
//       description: issue.description || '',
//       type: issue.type || '',
//       assignee: issue.assignee || '',
//       reporter: issue.reporter || '',
//       team: issue.team || '',
//       parentId: issue.parentId ? String(issue.parentId) : '',
//       start_date: issue.start_date || '',
//       due_date: issue.due_date || '',
//       priority: issue.priority || '',
//       status: issue.status || '',
//       labels: issue.labels || '',
//       attachmentUrl: issue.attachmentUrl || '',
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this issue?')) return;
//     try {
//       const res = await fetch(
//         `http://localhost:7007/api/jira-project/issues/${id}`,
//         {
//           method: 'DELETE',
//         },
//       );
//       if (res.ok) {
//         setCreatedIssues(prev => prev.filter(issue => issue.id !== id));
//         alert('Issue deleted successfully');
//       } else {
//         alert('Failed to delete issue');
//       }
//     } catch (error) {
//       console.error('Error deleting issue:', error);
//       alert('Error deleting issue');
//     }
//   };

//   useEffect(() => {
//     fetchCreatedIssues();
//   }, []);

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const { source, destination, type } = result;

//     if (type === 'COLUMNS') {
//       const newColumns = Array.from(columns);
//       const [movedColumn] = newColumns.splice(source.index, 1);
//       newColumns.splice(destination.index, 0, movedColumn);
//       setColumns(newColumns);
//       return;
//     }

//     if (source.droppableId === destination.droppableId) return;

//     const movedIssueId = result.draggableId;
//     const updatedIssues = createdIssues.map(issue =>
//       issue.id.toString() === movedIssueId
//         ? { ...issue, status: destination.droppableId }
//         : issue,
//     );
//     setCreatedIssues(updatedIssues);

//     const movedIssue = updatedIssues.find(
//       i => i.id.toString() === movedIssueId,
//     );
//     if (movedIssue) {
//       try {
//         const res = await fetch(
//           `http://localhost:7007/api/jira-project/issues/${movedIssue.id}/status`,
//           {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: movedIssue.status }),
//           },
//         );
//         if (!res.ok) {
//           console.error('Failed to update issue status');
//         }
//       } catch (error) {
//         console.error('Error updating issue status:', error);
//       }
//     }
//   };

//   const now = new Date();
//   const last7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.created_at)) <= 7,
//   );
//   const updated7Days = createdIssues.filter(
//     i => differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const completed7Days = createdIssues.filter(
//     i =>
//       i.status === 'Done' && differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const dueSoon = createdIssues.filter(
//     i =>
//       i.due_date &&
//       differenceInDays(new Date(i.due_date), now) >= 0 &&
//       differenceInDays(new Date(i.due_date), now) <= 7,
//   );

//   const statusCounts = statuses.map(s => ({
//     name: s,
//     value: createdIssues.filter(i => (i.status || 'To Do') === s).length,
//   }));

//   const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

//   const filteredIssues = createdIssues.filter(issue =>
//     issue.title.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const handleCommentOpen = (issueId: number) => {
//     setCurrentIssueId(issueId);
//     setCommentText('');
//     setCommentDialogOpen(true);
//   };

//   const handleCommentClose = () => {
//     setCommentDialogOpen(false);
//     setCurrentIssueId(null);
//   };

//   const handleAddComment = () => {
//     console.log(`Adding comment for issue ${currentIssueId}: ${commentText}`);
//     alert('Comment added!');
//     handleCommentClose();
//   };

//   const formatDate = (dateString: string) => {
//     return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
//   };

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return '#FF4D4D';
//       case 'medium':
//         return '#FFBB28';
//       case 'low':
//         return '#00C49F';
//       default:
//         return '#9e9e9e';
//     }
//   };

//   const allColumns = [
//     { id: 'allwork', label: 'All Work', width: 350 },
//     { id: 'status', label: 'Status', width: 100 },
//     { id: 'priority', label: 'Priority', width: 100 },
//     { id: 'reporter', label: 'Reporter', width: 150 },
//     { id: 'assignee', label: 'Assignee', width: 150 },
//     { id: 'team', label: 'Team', width: 100 },
//     { id: 'dueDate', label: 'Due Date', width: 150 },
//     { id: 'created_at', label: 'Created', width: 150 },
//     { id: 'updated_at', label: 'Updated', width: 150 },
//     { id: 'comments', label: 'Comments', width: 150 },
//     { id: 'actions', label: 'Actions', width: 100, align: 'right' as 'right' },
//   ];

//   const groupedIssues = useMemo(() => {
//     if (!groupBy || groupBy === 'None') {
//       return { 'All Issues': filteredIssues };
//     }

//     const groups: { [key: string]: Issue[] } = {};
//     filteredIssues.forEach(issue => {
//       let groupKey = issue[groupBy as keyof Issue] || 'None';
//       if (Array.isArray(groupKey)) {
//         groupKey = groupKey.join(', ');
//       }
//       if (!groups[groupKey]) {
//         groups[groupKey] = [];
//       }
//       groups[groupKey].push(issue);
//     });

//     return groups;
//   }, [filteredIssues, groupBy]);

//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>
//       <Content>
//         <Tabs
//           value={tab}
//           onChange={(_, newVal) => setTab(newVal)}
//           indicatorColor="primary"
//           textColor="primary"
//         >
//           <Tab value="summary" label="Summary" />
//           <Tab value="board" label="Board" />
//           <Tab value="calendar" label="Calendar" />
//           <Tab value="timeline" label="Timeline" />
//           <Tab value="list" label="List" />
//           <Tab value="allwork" label="All Work" />
//         </Tabs>
//         <Grid item>
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginTop: '16px' }}
//             onClick={handleOpen}
//           >
//             Create Issue
//           </Button>
//         </Grid>
//         {tab === 'summary' && (
//           <Grid container spacing={2} style={{ marginTop: 16 }}>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✅ <strong>{completed7Days.length} completed</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✏️ <strong>{updated7Days.length} updated</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>➕ {last7Days.length} created</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     <strong>📅 {dueSoon.length} due soon</strong>
//                     <br />
//                     <span style={{ color: 'gray' }}>in next 7 days</span>
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} style={{ marginTop: 20 }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Status overview</Typography>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={statusCounts}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={100}
//                         label
//                       >
//                         {statusCounts.map((_entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         )}
// {tab === 'list' && (
//   <Grid container spacing={2} style={{ marginTop: 16 }}>
//     <Grid item xs={12}>
//       <Paper style={{ padding: '16px', borderRadius: '8px' }}>
//         <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search list"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             style={{ marginRight: '16px' }}
//           />
//           <Button startIcon={<FilterListIcon />}>Filter</Button>
//           <div style={{ flexGrow: 1 }} />
//           <Button
//             variant="outlined"
//             startIcon={<ViewModuleIcon />}
//             style={{ marginRight: '8px' }}
//           >
//             Group
//           </Button>
//           <IconButton>
//             <MoreHorizIcon />
//           </IconButton>
//         </Toolbar>
//         <TableContainer>
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Table>
//               <Droppable
//                 droppableId="columns"
//                 direction="horizontal"
//                 type="COLUMNS"
//               >
//                 {provided => (
//                   <TableHead
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     <TableRow>
//                       {columns.map((column, index) => (
//                         <Draggable
//                           key={column.id}
//                           draggableId={column.id}
//                           index={index}
//                         >
//                           {providedDraggable => (
//                             <TableCell
//                               {...providedDraggable.draggableProps}
//                               ref={providedDraggable.innerRef}
//                               style={{
//                                 ...providedDraggable.draggableProps
//                                   .style,
//                                 width: column.width,
//                               }}
//                             >
//                               <span
//                                 {...providedDraggable.dragHandleProps}
//                               >
//                                 {column.label}
//                               </span>
//                             </TableCell>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </TableRow>
//                   </TableHead>
//                 )}
//               </Droppable>
//               <TableBody>
//                 {filteredIssues.map(issue => (
//                   <TableRow key={issue.id}>
//                     {columns.map(column => (
//                       <TableCell
//                         key={column.id}
//                         align={column.align as any}
//                       >
//                         {(() => {
//                           switch (column.id) {
//                             case 'checkbox':
//                               return <Checkbox />;
//                             case 'key':
//                               return `PROJECT-${issue.id}`;
//                             case 'summary':
//                               return issue.title;
//                             case 'type':
//                               return issue.type;
//                             case 'status':
//                               return (
//                                 <Button
//                                   variant="contained"
//                                   style={{
//                                     backgroundColor: '#f4f5f7',
//                                     color: 'black',
//                                   }}
//                                 >
//                                   {issue.status}
//                                 </Button>
//                               );
//                             case 'priority':
//                               return (
//                                 <Chip
//                                   label={issue.priority || 'N/A'}
//                                   style={{
//                                     backgroundColor: getPriorityColor(
//                                       issue.priority,
//                                     ),
//                                     color: 'white',
//                                   }}
//                                 />
//                               );
//                             case 'reporter':
//                               return issue.reporter;
//                             case 'assignee':
//                               return issue.assignee;
//                             case 'team':
//                               return issue.team;
//                             case 'dueDate':
//                               return formatDate(issue.due_date);
//                             case 'comments':
//                               return (
//                                 <Button
//                                   startIcon={<AddIcon />}
//                                   onClick={() =>
//                                     handleCommentOpen(issue.id)
//                                   }
//                                 >
//                                   Add comment
//                                 </Button>
//                               );
//                             case 'actions':
//                               return (
//                                 <div
//                                   style={{
//                                     display: 'flex',
//                                     justifyContent: 'flex-end',
//                                   }}
//                                 >
//                                   <IconButton
//                                     onClick={() => handleEdit(issue)}
//                                   >
//                                     <EditIcon fontSize="small" />
//                                   </IconButton>
//                                   <IconButton
//                                     onClick={() =>
//                                       handleDelete(issue.id)
//                                     }
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 </div>
//                               );
//                             default:
//                               return null;
//                           }
//                         })()}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </DragDropContext>
//         </TableContainer>
//       </Paper>
//     </Grid>
//   </Grid>
// )}
// {tab === 'allwork' && (
//   <Grid container spacing={2} style={{ marginTop: 16 }}>
//     <Grid item xs={12}>
//       <Paper style={{ padding: '16px', borderRadius: '8px' }}>
//         <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search all work"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             style={{ marginRight: '16px', width: '300px' }}
//           />
//           <Button startIcon={<FilterListIcon />}>Filter</Button>
//           <div style={{ flexGrow: 1 }} />
//           <TextField
//             select
//             variant="outlined"
//             size="small"
//             value={groupBy}
//             onChange={e => setGroupBy(e.target.value)}
//             label="Group by"
//             style={{ marginRight: '8px' }}
//           >
//             <MenuItem value="None">None</MenuItem>
//             <MenuItem value="status">Status</MenuItem>
//             <MenuItem value="assignee">Assignee</MenuItem>
//             <MenuItem value="reporter">Reporter</MenuItem>
//             <MenuItem value="team">Team</MenuItem>
//             <MenuItem value="priority">Priority</MenuItem>
//             <MenuItem value="type">Type</MenuItem>
//           </TextField>
//           <IconButton>
//             <MoreHorizIcon />
//           </IconButton>
//         </Toolbar>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {allColumns.map(column => (
//                   <TableCell
//                     key={column.id}
//                     style={{ width: column.width }}
//                     align={column.align as any}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {Object.entries(groupedIssues).map(
//                 ([groupName, issues]) => (
//                   <React.Fragment key={groupName}>
//                     <TableRow>
//                       <TableCell
//                         colSpan={allColumns.length}
//                         style={{
//                           backgroundColor: '#f5f5f5',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         {groupName} ({issues.length})
//                       </TableCell>
//                     </TableRow>
//                     {issues.map(issue => (
//                       <TableRow key={issue.id}>
//                         <TableCell>
//                           <Grid
//                             container
//                             spacing={1}
//                             alignItems="center"
//                           >
//                             <Grid item>
//                               <Typography
//                                 variant="body2"
//                                 style={{ fontWeight: 'bold' }}
//                               >
//                                 PROJECT-{issue.id}
//                               </Typography>
//                             </Grid>
//                             <Grid item xs>
//                               <Typography variant="body2">
//                                 {issue.title}
//                               </Typography>
//                             </Grid>
//                           </Grid>
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant="contained"
//                             style={{
//                               backgroundColor: '#f4f5f7',
//                               color: 'black',
//                             }}
//                           >
//                             {issue.status}
//                           </Button>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={issue.priority || 'N/A'}
//                             style={{
//                               backgroundColor: getPriorityColor(
//                                 issue.priority,
//                               ),
//                               color: 'white',
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>{issue.reporter}</TableCell>
//                         <TableCell>{issue.assignee}</TableCell>
//                         <TableCell>{issue.team}</TableCell>
//                         <TableCell>
//                           {formatDate(issue.due_date)}
//                         </TableCell>
//                         <TableCell>
//                           {formatDate(issue.created_at)}
//                         </TableCell>
//                         <TableCell>
//                           {formatDate(issue.updated_at)}
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             startIcon={<AddIcon />}
//                             onClick={() => handleCommentOpen(issue.id)}
//                           >
//                             Add comment
//                           </Button>
//                         </TableCell>
//                         <TableCell align="right">
//                           <div
//                             style={{
//                               display: 'flex',
//                               justifyContent: 'flex-end',
//                             }}
//                           >
//                             <IconButton
//                               onClick={() => handleEdit(issue)}
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                             <IconButton
//                               onClick={() => handleDelete(issue.id)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </React.Fragment>
//                 ),
//               )}
//               <TableRow>
//                 <TableCell
//                   colSpan={allColumns.length}
//                   style={{ borderBottom: 'none' }}
//                 >
//                   <Button
//                     onClick={handleOpen}
//                     color="primary"
//                     startIcon={<AddIcon />}
//                   >
//                     Create New Issue
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Grid>
//   </Grid>
// )}
//         {tab === 'board' && (
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Grid
//               container
//               spacing={2}
//               style={{ marginTop: 16, overflowX: 'auto', flexWrap: 'nowrap' }}
//             >
//               {statuses.map(status => (
//                 <Grid item xs key={status}>
//                   <Paper
//                     style={{
//                       minWidth: 270,
//                       height: '80vh',
//                       padding: 8,
//                       backgroundColor: '#f4f5f7',
//                       overflowY: 'auto',
//                     }}
//                   >
//                     <Typography
//                       variant="h6"
//                       style={{
//                         padding: '8px 0',
//                         borderBottom: '1px solid #e0e0e0',
//                       }}
//                     >
//                       {status}
//                     </Typography>
//                     <Droppable droppableId={status}>
//                       {(provided, snapshot) => (
//                         <div
//                           {...provided.droppableProps}
//                           ref={provided.innerRef}
//                           style={{
//                             backgroundColor: snapshot.isDraggingOver
//                               ? '#e0e0e0'
//                               : 'inherit',
//                             padding: 4,
//                             minHeight: 'calc(100% - 48px)',
//                           }}
//                         >
//                           {createdIssues
//                             .filter(issue => issue.status === status)
//                             .map((issue, index) => (
//                               <Draggable
//                                 key={issue.id}
//                                 draggableId={String(issue.id)}
//                                 index={index}
//                               >
//                                 {(providedDraggable, snapshotDraggable) => (
//                                   <Card
//                                     ref={providedDraggable.innerRef}
//                                     {...providedDraggable.draggableProps}
//                                     {...providedDraggable.dragHandleProps}
//                                     style={{
//                                       marginBottom: 8,
//                                       userSelect: 'none',
//                                       backgroundColor:
//                                         snapshotDraggable.isDragging
//                                           ? '#e8f5e9'
//                                           : 'white',
//                                       ...providedDraggable.draggableProps.style,
//                                     }}
//                                   >
//                                     <CardContent>
//                                       <Typography
//                                         variant="body2"
//                                         style={{ fontWeight: 'bold' }}
//                                       >
//                                         PROJECT-{issue.id}
//                                       </Typography>
//                                       <Typography variant="body1">
//                                         {issue.title}
//                                       </Typography>
//                                       <Typography
//                                         variant="body2"
//                                         color="textSecondary"
//                                       >
//                                         Type: {issue.type}
//                                       </Typography>
//                                       <div
//                                         style={{
//                                           display: 'flex',
//                                           justifyContent: 'flex-end',
//                                           marginTop: 8,
//                                         }}
//                                       >
//                                         <IconButton
//                                           size="small"
//                                           onClick={() => handleEdit(issue)}
//                                         >
//                                           <EditIcon fontSize="small" />
//                                         </IconButton>
//                                         <IconButton
//                                           size="small"
//                                           onClick={() => handleDelete(issue.id)}
//                                         >
//                                           <DeleteIcon fontSize="small" />
//                                         </IconButton>
//                                       </div>
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </DragDropContext>
//         )}

//         {/* {tab === 'calendar' && (
//                     <Grid container spacing={2} style={{ marginTop: 16 }}>
//                         <Grid item xs={12}>
//                             <Paper style={{ padding: '16px', borderRadius: '8px' }}>
//                                 <FullCalendar
//                                     plugins={[dayGridPlugin, interactionPlugin]}
//                                     initialView="dayGridMonth"
//                                     headerToolbar={{
//                                         left: 'prev,next today',
//                                         center: 'title',
//                                         right: 'dayGridMonth,dayGridWeek,dayGridDay',
//                                     }}
//                                     events={createdIssues.map(issue => ({
//                                         title: issue.title,
//                                         date: issue.due_date,
//                                         extendedProps: {
//                                             issue: issue,
//                                         },
//                                     }))}
//                                     eventClick={(arg: EventClickArg) => {
//                                         const issue = arg.event.extendedProps.issue as Issue;
//                                         handleEdit(issue);
//                                     }}
//                                 />
//                             </Paper>
//                         </Grid>
//                     </Grid> */}
//         {/* )} */}
//         {/* CALENDAR VIEW */}
//         {tab === 'calendar' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <Typography variant="h6" style={{ marginBottom: 16 }}>
//               Calendar View
//             </Typography>
//             <div
//               style={{
//                 background: 'white',
//                 padding: '16px',
//                 borderRadius: '8px',
//               }}
//             >
//               <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 headerToolbar={{
//                   left: 'prev,next today',
//                   center: 'title',
//                   right: 'dayGridMonth,dayGridWeek,dayGridDay',
//                 }}
//                 events={createdIssues
//                   .filter(issue => issue.start_date || issue.due_date)
//                   .map(issue => ({
//                     id: issue.id.toString(),
//                     title: `${issue.title}`,
//                     start: issue.start_date || issue.due_date,
//                     end: issue.due_date || issue.start_date,
//                   }))}
//                 eventClick={(info: EventClickArg) => {
//                   const issue = createdIssues.find(
//                     i => i.id.toString() === info.event.id,
//                   );
//                   if (issue) {
//                     handleEdit(issue);
//                   }
//                 }}
//                 height="auto"
//               />
//             </div>
//           </Grid>
//         )}
//         {tab === 'timeline' && (
//           <Grid container spacing={2} style={{ marginTop: 16 }}>
//             <Grid item xs={12}>
//               <Paper style={{ padding: '16px', borderRadius: '8px' }}>
//                 <FullCalendar
//                   plugins={[resourceTimelinePlugin, interactionPlugin]}
//                   initialView="resourceTimelineWeek"
//                   schedulerLicenseKey="CC-BY-NC-4.0"
//                   headerToolbar={{
//                     left: 'prev,next today',
//                     center: 'title',
//                     right:
//                       'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
//                   }}
//                   resources={createdIssues.map(issue => ({
//                     id: `resource-${issue.id}`,
//                     title: issue.title,
//                   }))}
//                   events={createdIssues.map(issue => ({
//                     id: String(issue.id),
//                     resourceId: `resource-${issue.id}`,
//                     title: `${issue.title} - ${issue.status}`,
//                     start: issue.start_date,
//                     end: issue.due_date,
//                   }))}
//                   eventClick={(arg: EventClickArg) => {
//                     const issueId = Number(arg.event.id);
//                     const issue = createdIssues.find(i => i.id === issueId);
//                     if (issue) {
//                       handleEdit(issue);
//                     }
//                   }}
//                 />
//               </Paper>
//             </Grid>
//           </Grid>
//         )}
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           aria-labelledby="form-dialog-title"
//         >
//           <DialogTitle id="form-dialog-title">
//             {editingIssueId ? 'Edit Issue' : 'Create Issue'}
//           </DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               name="title"
//               label="Title"
//               type="text"
//               fullWidth
//               value={formData.title}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="description"
//               label="Description"
//               type="text"
//               fullWidth
//               multiline
//               rows={4}
//               value={formData.description}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="type"
//               label="Type"
//               select
//               fullWidth
//               value={formData.type}
//               onChange={handleChange}
//             >
//               {issueTypes.map(type => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               margin="dense"
//               name="assignee"
//               label="Assignee"
//               type="text"
//               fullWidth
//               value={formData.assignee}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="reporter"
//               label="Reporter"
//               type="text"
//               fullWidth
//               value={formData.reporter}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="team"
//               label="Team"
//               type="text"
//               fullWidth
//               value={formData.team}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="parentId"
//               label="Parent Issue ID"
//               type="text"
//               fullWidth
//               value={formData.parentId}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="start_date"
//               label="Start Date"
//               type="date"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               value={formData.start_date}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="due_date"
//               label="Due Date"
//               type="date"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               value={formData.due_date}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="priority"
//               label="Priority"
//               select
//               fullWidth
//               value={formData.priority}
//               onChange={handleChange}
//             >
//               {['High', 'Medium', 'Low'].map(priority => (
//                 <MenuItem key={priority} value={priority}>
//                   {priority}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               margin="dense"
//               name="status"
//               label="Status"
//               select
//               fullWidth
//               value={formData.status}
//               onChange={handleChange}
//             >
//               {statuses.map(status => (
//                 <MenuItem key={status} value={status}>
//                   {status}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               margin="dense"
//               name="labels"
//               label="Labels (comma-separated)"
//               type="text"
//               fullWidth
//               value={formData.labels}
//               onChange={handleChange}
//             />
//             <Button
//               variant="contained"
//               component="label"
//               style={{ marginTop: '16px' }}
//             >
//               Upload Attachment
//               <input type="file" hidden onChange={handleFileChange} />
//             </Button>
//             {formData.attachmentUrl && (
//               <Typography style={{ marginTop: '8px' }}>
//                 File selected: {formData.attachmentUrl}
//               </Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} color="primary">
//               {editingIssueId ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog open={commentDialogOpen} onClose={handleCommentClose}>
//           <DialogTitle>Add Comment</DialogTitle>
//           <DialogContent>
//             <TextField
//               // eslint-disable-next-line jsx-a11y/no-autofocus
//               autoFocus
//               margin="dense"
//               label="Comment"
//               type="text"
//               fullWidth
//               multiline
//               rows={4}
//               value={commentText}
//               onChange={e => setCommentText(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCommentClose} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleAddComment} color="primary">
//               Add
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Content>
//     </Page>
//   );
// };

/* ************************************************************************************************************************************************** */

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Divider,
  Paper,
  Toolbar,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { differenceInDays } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import type { EventClickArg } from '@fullcalendar/core';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { x } from '@fullcalendar/resource/internal-common';

/** ---------- Types ---------- */
type UserRef = {
  name: string;
  email?: string;
};

type PersonOrString = UserRef | string | null;
type TeamField = UserRef[] | string | null;

type Issue = {
  id: number;
  title: string;
  description: string;
  type: string;
  assignee: PersonOrString;
  reporter: PersonOrString;
  team: TeamField;
  parentId: number | null;
  start_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  priority: string | null;
  status: string | null;
  labels: string | null;
  attachmentUrl: string | null;
};

type IssueSummary = {
  total: number;
  open: number;
  closed: number;
  highPriority: number;
  types: { type: string; count: number }[];
  priorities: { priority: string; count: number }[];
};

/** ---------- Helpers ---------- */
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map(p => p[0]?.toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function nameFromEmail(email: string) {
  const local = (email && String(email).split('@')[0]) || '';
  const spaced = local.replace(/[._-]+/g, ' ');
  return titleCase(spaced);
}

function initialsFromName(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = (parts[0]?.[0] || '').toUpperCase();
  const second = (parts[1]?.[0] || '').toUpperCase();
  return first + second || first || '?';
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString();
  } catch (e) {
    return 'Invalid Date';
  }
}

/** Parse fields returned by backend robustly:
 * - If value is null/undefined -> null / []
 * - If value is object -> use it
 * - If value is JSON string -> parse it
 * - If value is plain string (non-JSON) -> return string (or single-member team)
 */
function parsePersonField(v: any): PersonOrString {
  if (v === null) return null;
  if (typeof v === 'object') {
    // Already parsed object, assume { name, email }
    return v as UserRef;
  }
  if (typeof v === 'string') {
    // Try JSON.parse (common if backend stored JSON.stringify)
    try {
      const p = JSON.parse(v);
      if (p && typeof p === 'object') return p as UserRef;
    } catch {
      // not JSON — fallthrough to return the raw string
    }
    return v;
  }
  return null;
}

function parseTeamField(v: any): UserRef[] {
  if (v === null) return [];
  if (Array.isArray(v)) {
    return v as UserRef[];
  }
  if (typeof v === 'object') {
    // object but not array — maybe a single member stored as object
    return [v as UserRef];
  }
  if (typeof v === 'string') {
    // Try parse JSON array first
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed as UserRef[];
      if (parsed && typeof parsed === 'object') return [parsed as UserRef];
    } catch {
      // not JSON — treat as a single plain string name/email
      // If it looks like an email, extract name from it
      if (emailRegex.test(v)) {
        return [{ name: nameFromEmail(v), email: v }];
      }
      return [{ name: String(v) }];
    }
  }
  return [];
}

/** ---------- Main component ---------- */
export const ExampleComponent = () => {
  const [open, setOpen] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<
    'summary' | 'board' | 'list' | 'calendar' | 'timeline' | 'allwork'
  >('summary');
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<number | null>(null);
  const [groupBy, setGroupBy] = useState('None'); // New state for grouping
  const [showFilters, setShowFilters] = useState(false); // New state to toggle filter sidebar

  // New filter states
  const [filters, setFilters] = useState({
    assignee: '',
    reporter: '',
    status: [] as string[],
    priority: '',
    workType: [] as string[],
    dueDateStart: '',
    dueDateEnd: '',
    labels: '',
  });

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: string;
    assignee: PersonOrString;
    reporter: PersonOrString;
    team: UserRef[];
    parentId: string;
    start_date: string;
    due_date: string;
    priority: string;
    status: string;
    labels: string;
    attachmentUrl: string;
  }>({
    title: '',
    description: '',
    type: '',
    assignee: null,
    reporter: null,
    team: [],
    parentId: '',
    start_date: '',
    due_date: '',
    priority: '',
    status: '',
    labels: '',
    attachmentUrl: '',
  });

  // local inputs for people pickers
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterName, setReporterName] = useState('');

  // team dialog state
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState(''); // optional team name
  const [teamMemberEmail, setTeamMemberEmail] = useState('');
  const [teamMemberName, setTeamMemberName] = useState('');

  const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
  const [summary, setSummary] = useState<IssueSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];

  // Backend values always uppercase
  const statuses = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'TESTING', label: 'Testing' },
    { value: 'DONE', label: 'Done' },
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH'];

  const columns = [
    { id: 'checkbox', label: '', minWidth: 20, align: 'left' },
    { id: 'key', label: 'Key', minWidth: 80, align: 'left' },
    { id: 'summary', label: 'Summary', minWidth: 200, align: 'left' },
    { id: 'type', label: 'Type', minWidth: 80, align: 'left' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
    { id: 'priority', label: 'Priority', minWidth: 80, align: 'left' },
    { id: 'reporter', label: 'Reporter', minWidth: 100, align: 'left' },
    { id: 'assignee', label: 'Assignee', minWidth: 100, align: 'left' },
    { id: 'team', label: 'Team', minWidth: 150, align: 'left' },
    { id: 'dueDate', label: 'Due Date', minWidth: 100, align: 'left' },
    { id: 'comments', label: 'Comments', minWidth: 120, align: 'left' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'right' },
  ];

  // New columns for 'allwork' tab
  const allColumns = [
    { id: 'allWorkSummary', label: 'All Work', minWidth: 300, align: 'left' },
    { id: 'allWorkStatus', label: 'Status', minWidth: 100, align: 'left' },
    { id: 'allWorkPriority', label: 'Priority', minWidth: 100, align: 'left' },
    { id: 'allWorkReporter', label: 'Reporter', minWidth: 150, align: 'left' },
    { id: 'allWorkAssignee', label: 'Assignee', minWidth: 150, align: 'left' },
    { id: 'allWorkTeam', label: 'Team', minWidth: 150, align: 'left' },
    { id: 'allWorkDueDate', label: 'Due Date', minWidth: 120, align: 'left' },
    {
      id: 'allWorkCreatedAt',
      label: 'Created At',
      minWidth: 120,
      align: 'left',
    },
    {
      id: 'allWorkUpdatedAt',
      label: 'Updated At',
      minWidth: 120,
      align: 'left',
    },
    { id: 'allWorkComments', label: 'Comments', minWidth: 120, align: 'left' },
    { id: 'allWorkActions', label: 'Actions', minWidth: 100, align: 'right' },
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      assignee: null,
      reporter: null,
      team: [],
      parentId: '',
      start_date: '',
      due_date: '',
      priority: '',
      status: '',
      labels: '',
      attachmentUrl: '',
    });
    setAssigneeEmail('');
    setAssigneeName('');
    setReporterEmail('');
    setReporterName('');
    setTeamName('');
    setTeamMemberEmail('');
    setTeamMemberName('');
  };

  const handleOpen = () => {
    setEditingIssueId(null);
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const normalizeStatus = (status: string | null): string => {
    if (!status) return 'TODO';
    const s = status.toUpperCase().replace(' ', '_');
    if (['TODO', 'IN_PROGRESS', 'TESTING', 'DONE'].includes(s)) return s;
    return 'TODO';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, attachmentUrl: file.name });
    }
  };

  /** Fetch issues and normalize person/team fields */
  const fetchCreatedIssues = async () => {
    try {
      const res = await fetch('http://localhost:7007/api/jira-project/issues');
      if (res.ok) {
        const data: any[] = await res.json();
        const parsed: Issue[] = data.map(raw => ({
          ...raw,
          status: normalizeStatus(raw.status),
          assignee: parsePersonField(raw.assignee),
          reporter: parsePersonField(raw.reporter),
          team: parseTeamField(raw.team),
        }));
        setCreatedIssues(parsed);
      } else {
        console.error('Failed to fetch issues', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetch(
        'http://localhost:7007/api/jira-project/issues-summary',
      );
      if (!res.ok) throw new Error('Failed to fetch issue summary');
      const raw = await res.json();
      const toNum = (v: any) =>
        typeof v === 'string' ? parseInt(v, 10) : Number(v) || 0;
      setSummary({
        total: toNum(raw.total),
        open: toNum(raw.open),
        closed: toNum(raw.closed),
        highPriority: toNum(raw.highPriority),
        types: (raw.types || []).map((t: any) => ({
          type: t.type,
          count: toNum(t.count),
        })),
        priorities: (raw.priorities || []).map((p: any) => ({
          priority: p.priority,
          count: toNum(p.count),
        })),
      });
    } catch (e: any) {
      console.error(e);
      setSummaryError(e?.message || 'Error loading summary');
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  /** ---------- People picker helpers ---------- */
  const addAssignee = () => {
    if (!emailRegex.test(assigneeEmail)) {
      alert('Enter a valid assignee email');
      return;
    }
    const name = assigneeName.trim() || nameFromEmail(assigneeEmail);
    setFormData(prev => ({
      ...prev,
      assignee: { name, email: assigneeEmail },
    }));
    setAssigneeEmail('');
    setAssigneeName('');
  };

  const clearAssignee = () => {
    setFormData(prev => ({ ...prev, assignee: null }));
  };

  const addReporter = () => {
    if (!emailRegex.test(reporterEmail)) {
      alert('Enter a valid reporter email');
      return;
    }
    const name = reporterName.trim() || nameFromEmail(reporterEmail);
    setFormData(prev => ({
      ...prev,
      reporter: { name, email: reporterEmail },
    }));
    setReporterEmail('');
    setReporterName('');
  };

  const clearReporter = () => {
    setFormData(prev => ({ ...prev, reporter: null }));
  };

  const addTeamMember = () => {
    if (!emailRegex.test(teamMemberEmail)) {
      alert('Enter a valid team member email');
      return;
    }
    const name = teamMemberName.trim() || nameFromEmail(teamMemberEmail);
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name, email: teamMemberEmail }],
    }));
    setTeamMemberEmail('');
    setTeamMemberName('');
  };

  const removeTeamMember = (email: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m.email !== email),
    }));
  };

  /** ---------- Submit (create/update) ---------- */
  const handleSubmit = async () => {
    try {
      // reporter required by backend
      if (!formData.reporter) {
        alert('Reporter is required');
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        assignee: formData.assignee,
        reporter: formData.reporter,
        team: formData.team,
        parentId: formData.parentId ? Number(formData.parentId) : null,
        start_date: formData.start_date || null,
        due_date: formData.due_date || null,
        priority: formData.priority,
        status: normalizeStatus(formData.status),
        labels: formData.labels,
        attachmentUrl: formData.attachmentUrl,
      };

      if (editingIssueId) {
        const response = await fetch(
          `http://localhost:7007/api/jira-project/issues/${editingIssueId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
        if (response.ok) {
          const updatedIssue: any = await response.json();
          const parsed: Issue = {
            ...updatedIssue,
            status: normalizeStatus(updatedIssue.status),
            assignee: parsePersonField(updatedIssue.assignee),
            reporter: parsePersonField(updatedIssue.reporter),
            team: parseTeamField(updatedIssue.team),
          };
          setCreatedIssues(prev =>
            prev.map(issue => (issue.id === editingIssueId ? parsed : issue)),
          );
          await fetchSummary();
          alert('Issue updated successfully');
        } else {
          alert('Failed to update issue');
        }
      } else {
        const response = await fetch(
          'http://localhost:7007/api/jira-project/issues',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
        if (response.ok) {
          const newIssue: any = await response.json();
          const parsed: Issue = {
            ...newIssue,
            status: normalizeStatus(newIssue.status),
            assignee: parsePersonField(newIssue.assignee),
            reporter: parsePersonField(newIssue.reporter),
            team: parseTeamField(newIssue.team),
          };
          setCreatedIssues(prev => [...prev, parsed]);
          await fetchSummary();
          alert('Issue created successfully');
        } else {
          alert('Failed to create issue');
        }
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error saving issue');
    }
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssueId(issue.id);
    setFormData({
      title: issue.title || '',
      description: issue.description || '',
      type: issue.type || '',
      assignee: issue.assignee || null,
      reporter: issue.reporter || null,
      team: Array.isArray(issue.team)
        ? [...issue.team]
        : parseTeamField(issue.team),
      parentId: issue.parentId ? String(issue.parentId) : '',
      start_date: issue.start_date || '',
      due_date: issue.due_date || '',
      priority: issue.priority || '',
      status: normalizeStatus(issue.status),
      labels: issue.labels || '',
      attachmentUrl: issue.attachmentUrl || '',
    });
    // clear the local input boxes (optional)
    setAssigneeEmail('');
    setAssigneeName('');
    setReporterEmail('');
    setReporterName('');
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      const res = await fetch(
        `http://localhost:7007/api/jira-project/issues/${id}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        setCreatedIssues(prev => prev.filter(issue => issue.id !== id));
        await fetchSummary();
        alert('Issue deleted successfully');
      } else {
        alert('Failed to delete issue');
      }
    } catch (error) {
      console.error('Error deleting issue:', error);
      alert('Error deleting issue');
    }
  };

  useEffect(() => {
    fetchCreatedIssues();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    const movedIssueId = result.draggableId;
    const updatedIssues = createdIssues.map(issue =>
      issue.id.toString() === movedIssueId
        ? { ...issue, status: destination.droppableId }
        : issue,
    );
    setCreatedIssues(updatedIssues);

    const movedIssue = updatedIssues.find(
      i => i.id.toString() === movedIssueId,
    );
    if (movedIssue) {
      try {
        const res = await fetch(
          `http://localhost:7007/api/jira-project/issues/${movedIssue.id}/status`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: movedIssue.status }),
          },
        );
        if (!res.ok) {
          console.error('Failed to update issue status');
        } else {
          await fetchSummary();
        }
      } catch (error) {
        console.error('Error updating issue status:', error);
      }
    }
  };

  const now = new Date();
  const last7Days = createdIssues.filter(
    i => differenceInDays(now, new Date(i.created_at)) <= 7,
  );
  const updated7Days = createdIssues.filter(
    i => differenceInDays(now, new Date(i.updated_at)) <= 7,
  );
  const completed7Days = createdIssues.filter(
    i =>
      normalizeStatus(i.status) === 'DONE' &&
      differenceInDays(now, new Date(i.updated_at)) <= 7,
  );
  const dueSoon = createdIssues.filter(
    i =>
      i.due_date &&
      differenceInDays(new Date(i.due_date), now) >= 0 &&
      differenceInDays(new Date(i.due_date), now) <= 7,
  );

  const statusCounts = statuses.map(s => ({
    name: s.label,
    value: createdIssues.filter(i => normalizeStatus(i.status) === s.value)
      .length,
  }));

  const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

  const PRIORITY_COLORS: Record<string, string> = {
    HIGH: '#ff4d4f',
    MEDIUM: '#faad14',
    LOW: '#52c41a',
  };
  const TYPE_COLORS: Record<string, string> = {
    Epic: '#8e44ad',
    Feature: '#2980b9',
    Task: '#27ae60',
    Story: '#f1c40f',
    Bug: '#e67e22',
  };

  const getPriorityColor = (priority: string | null): string => {
    return PRIORITY_COLORS[priority?.toUpperCase() || 'LOW'] || 'gray';
  };

  const typeChartData = summary?.types
    ? issueTypes.map(t => {
        const found = summary.types.find(x => x.type === t);
        return { type: t, count: found ? Number(found.count) : 0 };
      })
    : [];

  const priorityChartData = summary?.priorities
    ? ['HIGH', 'MEDIUM', 'LOW'].map(p => {
        const found = summary.priorities.find(
          x => String(x.priority).toUpperCase() === p,
        );
        return { priority: p, count: found ? Number(found.count) : 0 };
      })
    : [];
  // Filter logic for 'List' and 'All Work' views
  const filteredIssues = createdIssues.filter(issue => {
    const searchTermMatch = issue.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // eslint-disable-next-line no-nested-ternary
    const assigneeMatch = filters.assignee
      ? typeof issue.assignee === 'string'
        ? issue.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
        : issue.assignee?.name
            .toLowerCase()
            .includes(filters.assignee.toLowerCase())
      : true;
    // eslint-disable-next-line no-nested-ternary
    const reporterMatch = filters.reporter
      ? typeof issue.reporter === 'string'
        ? issue.reporter.toLowerCase().includes(filters.reporter.toLowerCase())
        : issue.reporter?.name
            .toLowerCase()
            .includes(filters.reporter.toLowerCase())
      : true;
    const statusMatch =
      filters.status.length > 0
        ? filters.status.includes(normalizeStatus(issue.status))
        : true;
    const workTypeMatch =
      filters.workType.length > 0
        ? filters.workType.includes(issue.type)
        : true;
    const labelsMatch = filters.labels
      ? issue.labels?.toLowerCase().includes(filters.labels.toLowerCase())
      : true;
    const dueDateStartMatch = filters.dueDateStart
      ? new Date(issue.due_date) >= new Date(filters.dueDateStart)
      : true;
    const dueDateEndMatch = filters.dueDateEnd
      ? new Date(issue.due_date) <= new Date(filters.dueDateEnd)
      : true;

    return (
      searchTermMatch &&
      assigneeMatch &&
      reporterMatch &&
      statusMatch &&
      workTypeMatch &&
      labelsMatch &&
      dueDateStartMatch &&
      dueDateEndMatch
    );
  });

  /** ---------- safe render helpers for board ---------- */
  const renderPersonChip = (field: PersonOrString) => {
    if (!field) return null;
    if (typeof field === 'string') {
      return (
        <Chip
          avatar={<Avatar>{field[0]?.toUpperCase() || '?'}</Avatar>}
          label={field}
          size="small"
        />
      );
    }
    // object
    return (
      <Chip
        avatar={<Avatar>{initialsFromName(field.name)}</Avatar>}
        label={field.name}
        size="small"
      />
    );
  };

  const renderTeamChips = (teamField: TeamField) => {
    if (!teamField) return null;
    if (typeof teamField === 'string') {
      // plain string
      return (
        <Chip
          avatar={<Avatar>{teamField[0]?.toUpperCase()}</Avatar>}
          label={teamField}
          size="small"
        />
      );
    }
    // array of UserRef
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        {teamField.map(member => (
          <Chip
            key={member.email || member.name}
            avatar={<Avatar>{initialsFromName(member.name)}</Avatar>}
            label={member.name}
            size="small"
          />
        ))}
      </div>
    );
  };

  const handleCommentOpen = (issueId: number) => {
    setCurrentIssueId(issueId);
    setCommentDialogOpen(true);
  };

  const handleCommentClose = () => {
    setCommentDialogOpen(false);
    setCurrentIssueId(null);
  };

  /** ---------- New Timeline View Logic ---------- */
  const getCalendarEvents = () => {
    // Filter issues that have both a start and due date
    return createdIssues
      .filter(issue => issue.start_date && issue.due_date)
      .map(issue => ({
        id: issue.id,
        title: issue.title,
        start: issue.start_date,
        // Add one day to the end date so the end day is inclusive on the calendar
        end: new Date(new Date(issue.due_date).getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        color:
          PRIORITY_COLORS[issue.priority?.toUpperCase() || 'LOW'] || '#52c41a',
      }));
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const issueId = Number(clickInfo.event.id);
    const issue = createdIssues.find(i => i.id === issueId);
    if (issue) {
      handleEdit(issue);
    }
  };

  // Grouping logic for 'All Work' view
  const groupIssues = (
    issues: Issue[],
    key: string,
  ): Record<string, Issue[]> => {
    if (key === 'None') {
      return { 'All Issues': issues };
    }

    return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
      let groupName = 'Unassigned';
      if (key === 'status') {
        groupName = normalizeStatus(issue.status);
      } else if (key === 'priority') {
        groupName = issue.priority || 'Unassigned';
      } else if (key === 'type') {
        groupName = issue.type || 'Unassigned';
      } else if (key === 'assignee') {
        const assignee = parsePersonField(issue.assignee);
        groupName =
          typeof assignee === 'string'
            ? assignee
            : assignee?.name || 'Unassigned';
      } else if (key === 'reporter') {
        const reporter = parsePersonField(issue.reporter);
        groupName =
          typeof reporter === 'string'
            ? reporter
            : reporter?.name || 'Unassigned';
      } else if (key === 'team') {
        const team = parseTeamField(issue.team);
        groupName =
          team.length > 0
            ? team.map(member => member.name).join(', ')
            : 'Unassigned';
      }

      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(issue);
      return acc;
    }, {});
  };

  const groupedIssues = groupIssues(filteredIssues, groupBy);

  // Filter change handlers
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      return { ...prev, status: newStatus };
    });
  };

  const handleWorkTypeFilterChange = (workType: string) => {
    setFilters(prev => {
      const newWorkType = prev.workType.includes(workType)
        ? prev.workType.filter(t => t !== workType)
        : [...prev.workType, workType];
      return { ...prev, workType: newWorkType };
    });
  };

  // Place this logic near the other state-management functions in your component
  // For example, right after the handleClose function.

  const handleClearFilters = () => {
    setFilters({
      assignee: '',
      reporter: '',
      status: [],
      priority: '',
      workType: [],
      dueDateStart: '',
      dueDateEnd: '',
      labels: '',
    });
    setSearchTerm('');
  };

  const handleClearGroup = () => {
    setGroupBy('None');
  };

  return (
    <Page themeId="tool">
      <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          <Grid item>
            <TextField
              variant="outlined"
              placeholder="Search…"
              size="small"
              // Add state and a change handler here
              // value={searchTerm}
              // onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '0px', height: '50px' }}
              onClick={handleOpen}
            >
              Create project
            </Button>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, newVal) => setTab(newVal)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="summary" label="Summary" />
          <Tab value="timeline" label="Timeline View" />
          <Tab value="board" label="Board View" />
          <Tab value="calendar" label="Calendar View" />
          <Tab value="list" label="List View" />
          <Tab value="allwork" label="All Work" />
        </Tabs>

        {/* Summary view */}
        {tab === 'summary' && (
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12}>
              <Typography variant="h6">Summary (from backend)</Typography>
            </Grid>
            {summaryLoading && <Typography>Loading summary…</Typography>}
            {summaryError && (
              <Typography color="error">{summaryError}</Typography>
            )}
            {!summaryLoading && !summaryError && summary && (
              <>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>📊 {summary.total} total</strong>
                        <br />
                        All issues
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>🟡 {summary.open} open</strong>
                        <br />
                        Not done yet
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>✅ {summary.closed} closed</strong>
                        <br />
                        Marked Done
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>🔥 {summary.highPriority} high priority</strong>
                        <br />
                        Priority = HIGH
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography>
                    ✅ <strong>{completed7Days.length} completed</strong>
                    <br />
                    last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography>
                    ✏ <strong>{updated7Days.length} updated</strong>
                    <br />
                    last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography>
                    ➕ <strong>{last7Days.length} created</strong>
                    <br />
                    last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardContent>
                  <Typography>
                    📅 <strong>{dueSoon.length} due soon</strong>
                    <br />
                    next 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} style={{ marginTop: 20 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Status overview</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusCounts}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {statusCounts.map((_entry, index) => (
                          <Cell
                            key={`Cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {summary && (
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Types of work</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={typeChartData}
                          dataKey="count"
                          nameKey="type"
                          outerRadius={100}
                          label
                        >
                          {typeChartData.map((_entry, index) => (
                            <Cell
                              key={`cell-type-${index}`}
                              fill={
                                TYPE_COLORS[_entry.type] ||
                                COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {summary && (
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Priority breakdown</Typography>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={priorityChartData}
                        margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="priority" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Count">
                          {priorityChartData.map((_entry, index) => (
                            <Cell
                              key={`cell-priority-${index}`}
                              fill={
                                PRIORITY_COLORS[_entry.priority] ||
                                COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
        {/* Board view */}
        {tab === 'board' && (
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              {statuses.map(status => (
                <Grid item xs={12} sm={6} md={3} key={status.value}>
                  <Paper elevation={3} style={{ padding: 16 }}>
                    <Typography
                      variant="h6"
                      style={{ marginBottom: 16, textAlign: 'center' }}
                    >
                      {status.label} (
                      {
                        createdIssues.filter(
                          issue =>
                            normalizeStatus(issue.status) === status.value,
                        ).length
                      }
                      )
                    </Typography>
                    <Droppable droppableId={status.value}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightgray'
                              : '#f4f5f7',
                            padding: 8,
                            borderRadius: '4px',
                            minHeight: '500px',
                          }}
                          {...provided.droppableProps}
                        >
                          {createdIssues
                            .filter(
                              issue =>
                                normalizeStatus(issue.status) === status.value,
                            )
                            .map((issue, index) => (
                              <Draggable
                                key={issue.id}
                                draggableId={issue.id.toString()}
                                index={index}
                              >
                                {provided => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      marginBottom: 8,
                                      cursor: 'pointer',
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={() => handleEdit(issue)}
                                  >
                                    <CardContent>
                                      <Grid
                                        container
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {issue.type}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Chip
                                            label={issue.priority}
                                            size="small"
                                            style={{
                                              backgroundColor: getPriorityColor(
                                                issue.priority,
                                              ),
                                              color: 'white',
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                      <Typography
                                        variant="h6"
                                        component="h2"
                                        noWrap
                                      >
                                        {issue.title}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        noWrap
                                      >
                                        Due: {formatDate(issue.due_date)}
                                      </Typography>
                                      <div style={{ marginTop: 8 }}>
                                        {renderPersonChip(issue.assignee)}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Paper>
                </Grid>
              ))}
            </DragDropContext>
          </Grid>
        )}

        {/* List view */}
        {tab === 'list' && (
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            {showFilters && (
              <Grid item xs={12} sm={3}>
                <Paper elevation={3} style={{ padding: 16 }}>
                  <Typography variant="h6" gutterBottom>
                    Filters
                  </Typography>
                  <Divider style={{ margin: '8px 0' }} />
                  {/* Status Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  <Grid container spacing={1}>
                    {statuses.map(s => (
                      <Grid item key={s.value}>
                        <Chip
                          label={s.label}
                          clickable
                          onClick={() => handleStatusFilterChange(s.value)}
                          color={
                            filters.status.includes(s.value)
                              ? 'primary'
                              : 'default'
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider style={{ margin: '16px 0' }} />
                  {/* Due Date Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Due Date
                  </Typography>
                  <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={filters.dueDateStart}
                    onChange={e =>
                      handleFilterChange('dueDateStart', e.target.value)
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={filters.dueDateEnd}
                    onChange={e =>
                      handleFilterChange('dueDateEnd', e.target.value)
                    }
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  {/* Assignee Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Assignee
                  </Typography>
                  <TextField
                    placeholder="Search by name or email"
                    fullWidth
                    value={filters.assignee}
                    onChange={e =>
                      handleFilterChange('assignee', e.target.value)
                    }
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  {/* Reporter Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Reporter
                  </Typography>
                  <TextField
                    placeholder="Search by name or email"
                    fullWidth
                    value={filters.reporter}
                    onChange={e =>
                      handleFilterChange('reporter', e.target.value)
                    }
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  {/* Work Type Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Work Type
                  </Typography>
                  <Grid container spacing={1}>
                    {issueTypes.map(t => (
                      <Grid item key={t}>
                        <Chip
                          label={t}
                          clickable
                          onClick={() => handleWorkTypeFilterChange(t)}
                          color={
                            filters.workType.includes(t) ? 'primary' : 'default'
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider style={{ margin: '16px 0' }} />
                  {/* Labels Filter */}
                  <Typography variant="subtitle2" gutterBottom>
                    Labels
                  </Typography>
                  <TextField
                    placeholder="Search labels"
                    fullWidth
                    value={filters.labels}
                    onChange={e => handleFilterChange('labels', e.target.value)}
                  />
                </Paper>
              </Grid>
            )}
            <Grid item xs={12} sm={showFilters ? 9 : 12}>
              <Paper elevation={3}>
                <Toolbar>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search issues"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginRight: 16 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    style={{ marginLeft: 8 }}
                  >
                    Clear
                  </Button>
                  <div style={{ flexGrow: 1 }} />
                  <TextField
                    select
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value)}
                    variant="outlined"
                    size="small"
                    label="Group by"
                    style={{ width: 150 }}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="assignee">Assignee</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined"
                    onClick={handleClearGroup}
                    style={{ marginLeft: 8 }}
                  >
                    Clear
                  </Button>
                </Toolbar>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map(column => (
                          <TableCell
                            key={column.id}
                            align={column.align as any}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    {groupBy === 'None' ? (
                      <TableBody>
                        {filteredIssues.map(issue => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={issue.id}
                          >
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell>{`PROJ-${issue.id}`}</TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <Chip label={issue.type} size="small" />
                                <Typography variant="body2" noWrap>
                                  {issue.title}
                                </Typography>
                              </div>
                            </TableCell>
                            <TableCell>{issue.type}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  statuses.find(
                                    s =>
                                      s.value === normalizeStatus(issue.status),
                                  )?.label || normalizeStatus(issue.status)
                                }
                                size="small"
                                style={{
                                  backgroundColor:
                                    // eslint-disable-next-line no-nested-ternary
                                    normalizeStatus(issue.status) === 'DONE'
                                      ? '#52c41a'
                                      : normalizeStatus(issue.status) ===
                                        'IN_PROGRESS'
                                      ? '#1890ff'
                                      : 'lightgray',
                                  color: 'white',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={issue.priority || 'N/A'}
                                size="small"
                                style={{
                                  backgroundColor: getPriorityColor(
                                    issue.priority,
                                  ),
                                  color: 'white',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {renderPersonChip(issue.reporter)}
                            </TableCell>
                            <TableCell>
                              {renderPersonChip(issue.assignee)}
                            </TableCell>
                            <TableCell>{renderTeamChips(issue.team)}</TableCell>
                            <TableCell>{formatDate(issue.due_date)}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleCommentOpen(issue.id)}
                                size="small"
                                variant="outlined"
                              >
                                Add Comment
                              </Button>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton onClick={() => handleEdit(issue)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDelete(issue.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <IconButton>
                                <MoreHorizIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      // This is the new logic for grouping
                      Object.keys(groupedIssues).map(groupName => (
                        <TableBody key={groupName}>
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              style={{
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                              }}
                            >
                              {groupName} ({groupedIssues[groupName].length})
                            </TableCell>
                          </TableRow>
                          {groupedIssues[groupName].map(issue => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={issue.id}
                            >
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>{`PROJ-${issue.id}`}</TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                  }}
                                >
                                  <Chip label={issue.type} size="small" />
                                  <Typography variant="body2" noWrap>
                                    {issue.title}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell>{issue.type}</TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    statuses.find(
                                      s =>
                                        s.value ===
                                        normalizeStatus(issue.status),
                                    )?.label || normalizeStatus(issue.status)
                                  }
                                  size="small"
                                  style={{
                                    backgroundColor:
                                      // eslint-disable-next-line no-nested-ternary
                                      normalizeStatus(issue.status) === 'DONE'
                                        ? '#52c41a'
                                        : normalizeStatus(issue.status) ===
                                          'IN_PROGRESS'
                                        ? '#1890ff'
                                        : 'lightgray',
                                    color: 'white',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={issue.priority || 'N/A'}
                                  size="small"
                                  style={{
                                    backgroundColor: getPriorityColor(
                                      issue.priority,
                                    ),
                                    color: 'white',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {renderPersonChip(issue.reporter)}
                              </TableCell>
                              <TableCell>
                                {renderPersonChip(issue.assignee)}
                              </TableCell>
                              <TableCell>
                                {renderTeamChips(issue.team)}
                              </TableCell>
                              <TableCell>
                                {formatDate(issue.due_date)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleCommentOpen(issue.id)}
                                  size="small"
                                  variant="outlined"
                                >
                                  Add Comment
                                </Button>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton onClick={() => handleEdit(issue)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(issue.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton>
                                  <MoreHorizIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      ))
                    )}
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
        {/* All Work view */}
        {tab === 'allwork' && (
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12}>
              <Paper style={{ padding: '16px', borderRadius: '8px' }}>
                <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search all work"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginRight: '16px', width: '300px' }}
                  />
                  {/* <Button startIcon={<FilterListIcon />}>Filter</Button> */}
                  <div style={{ flexGrow: 1 }} />
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    value={groupBy}
                    onChange={e => setGroupBy(e.target.value)}
                    label="Group by"
                    style={{ marginRight: '8px' }}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="assignee">Assignee</MenuItem>
                    <MenuItem value="reporter">Reporter</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                  </TextField>
                  <IconButton>{/* <MoreHorizIcon /> */}</IconButton>
                </Toolbar>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {allColumns.map(column => (
                          <TableCell
                            key={column.id}
                            style={{ width: column.minWidth }}
                            align={column.align as any}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(groupedIssues).map(
                        ([groupName, issues]) => (
                          <React.Fragment key={groupName}>
                            <TableRow>
                              <TableCell
                                colSpan={allColumns.length}
                                style={{
                                  backgroundColor: '#f5f5f5',
                                  fontWeight: 'bold',
                                }}
                              >
                                {groupName} ({issues.length})
                              </TableCell>
                            </TableRow>
                            {issues.map(issue => (
                              <TableRow key={issue.id}>
                                <TableCell>
                                  <Grid
                                    container
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Grid item>
                                      <Typography
                                        variant="body2"
                                        style={{ fontWeight: 'bold' }}
                                      >
                                        PROJECT-{issue.id}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs>
                                      <Typography variant="body2">
                                        {issue.title}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: '#f4f5f7',
                                      color: 'black',
                                    }}
                                  >
                                    {issue.status}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={issue.priority || 'N/A'}
                                    style={{
                                      backgroundColor: getPriorityColor(
                                        issue.priority,
                                      ),
                                      color: 'white',
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {renderPersonChip(issue.reporter)}
                                </TableCell>
                                <TableCell>
                                  {renderPersonChip(issue.assignee)}
                                </TableCell>
                                <TableCell>
                                  {renderTeamChips(issue.team)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(issue.due_date)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(issue.created_at)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(issue.updated_at)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => handleCommentOpen(issue.id)}
                                  >
                                    Add comment
                                  </Button>
                                </TableCell>
                                <TableCell align="right">
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleEdit(issue)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDelete(issue.id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ),
                      )}
                      <TableRow>
                        <TableCell
                          colSpan={allColumns.length}
                          style={{ borderBottom: 'none' }}
                        >
                          <Button
                            onClick={handleOpen}
                            color="primary"
                            startIcon={<AddIcon />}
                          >
                            Create
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Calendar view */}

        {tab === 'calendar' && (
          <Grid item style={{ marginTop: 16 }}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Calendar View
            </Typography>
            <div
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
                events={createdIssues
                  .filter(issue => issue.start_date || issue.due_date)
                  .map(issue => ({
                    id: issue.id.toString(),
                    title: issue.title,
                    start: issue.start_date || issue.due_date,
                    end: issue.due_date || issue.start_date,
                  }))}
                eventClick={(info: EventClickArg) => {
                  const issue = createdIssues.find(
                    i => i.id.toString() === info.event.id,
                  );
                  if (issue) {
                    handleEdit(issue);
                  }
                }}
              />
            </div>
          </Grid>
        )}

        {/* {Timeline View} */}
        {tab === 'timeline' && (
          <Grid item style={{ marginTop: 16 }}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Timeline View
            </Typography>
            <div
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <FullCalendar
                {...({
                  plugins: [resourceTimelinePlugin, interactionPlugin],
                  initialView: 'resourceTimelineMonth',
                  schedulerLicenseKey:
                    'CC-Attribution-NonCommercial-NoDerivatives',
                  headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right:
                      'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
                  },
                  resources: createdIssues.map(issue => ({
                    id: issue.id.toString(),
                    title: issue.title,
                  })),
                  events: createdIssues
                    .filter(issue => issue.start_date && issue.due_date)
                    .map(issue => ({
                      id: issue.id.toString(),
                      resourceId: issue.id.toString(),
                      title: `${issue.title} (${issue.assignee})`,
                      start: issue.start_date,
                      end: issue.due_date,
                    })),
                  eventClick: (info: EventClickArg) => {
                    const issue = createdIssues.find(
                      i => i.id.toString() === info.event.id,
                    );
                    if (issue) handleEdit(issue);
                  },
                  height: '80vh',
                } as any)}
              />
            </div>
          </Grid>
        )}
      </Content>
      {/* Create/Edit Issue Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingIssueId ? 'Edit Issue' : 'Create project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                margin="dense"
                name="title"
                label="Title"
                type="text"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                margin="dense"
                name="type"
                label="Type"
                fullWidth
                value={formData.type}
                onChange={handleChange}
              >
                {issueTypes.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                margin="dense"
                name="priority"
                label="Priority"
                fullWidth
                value={formData.priority}
                onChange={handleChange}
              >
                {priorities.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                margin="dense"
                name="status"
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="start_date"
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="due_date"
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.due_date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="parentId"
                label="Parent Issue ID"
                type="number"
                fullWidth
                value={formData.parentId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="labels"
                label="Labels (comma separated)"
                type="text"
                fullWidth
                value={formData.labels}
                onChange={handleChange}
              />
            </Grid>
            {/* Reporter Picker */}
            <Grid item xs={12}>
              <Divider style={{ margin: '16px 0' }} />
              <Typography variant="subtitle1" gutterBottom>
                Reporter
              </Typography>
              {formData.reporter ? (
                <Chip
                  label={
                    typeof formData.reporter === 'string'
                      ? formData.reporter
                      : formData.reporter.name
                  }
                  onDelete={clearReporter}
                  avatar={
                    <Avatar>
                      {initialsFromName(
                        typeof formData.reporter === 'string'
                          ? formData.reporter
                          : formData.reporter.name,
                      )}
                    </Avatar>
                  }
                />
              ) : (
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      placeholder="Name"
                      value={reporterName}
                      onChange={e => setReporterName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      placeholder="Email"
                      value={reporterEmail}
                      onChange={e => setReporterEmail(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addReporter}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {/* Assignee Picker */}
            <Grid item xs={12}>
              <Divider style={{ margin: '16px 0' }} />
              <Typography variant="subtitle1" gutterBottom>
                Assignee (Optional)
              </Typography>
              {formData.assignee ? (
                <Chip
                  label={
                    typeof formData.assignee === 'string'
                      ? formData.assignee
                      : formData.assignee.name
                  }
                  onDelete={clearAssignee}
                  avatar={
                    <Avatar>
                      {initialsFromName(
                        typeof formData.assignee === 'string'
                          ? formData.assignee
                          : formData.assignee.name,
                      )}
                    </Avatar>
                  }
                />
              ) : (
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      placeholder="Name"
                      value={assigneeName}
                      onChange={e => setAssigneeName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      placeholder="Email"
                      value={assigneeEmail}
                      onChange={e => setAssigneeEmail(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addAssignee}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {/* Team Picker */}
            <Grid item xs={12}>
              <Divider style={{ margin: '16px 0' }} />
              <Typography variant="subtitle1" gutterBottom>
                Team (Optional)
              </Typography>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.team.map(member => (
                  <Chip
                    key={member.email || member.name}
                    label={member.name}
                    onDelete={() => removeTeamMember(member.email!)}
                    avatar={<Avatar>{initialsFromName(member.name)}</Avatar>}
                  />
                ))}
              </div>
              <Grid
                container
                spacing={1}
                alignItems="center"
                style={{ marginTop: 8 }}
              >
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="Name"
                    value={teamMemberName}
                    onChange={e => setTeamMemberName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    size="small"
                    placeholder="Email"
                    value={teamMemberEmail}
                    onChange={e => setTeamMemberEmail(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addTeamMember}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editingIssueId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={handleCommentClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Comment to Issue {currentIssueId}</DialogTitle>
        <DialogContent>
          <TextField
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            margin="dense"
            label="Your Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCommentClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCommentClose}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};
