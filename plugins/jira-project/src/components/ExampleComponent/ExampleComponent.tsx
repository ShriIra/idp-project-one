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
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { format, parseISO, differenceInDays } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';

// ---------------- TYPES ----------------
type Issue = {
  id: number;
  title: string;
  description: string;
  type: string;
  assignee: string;
  reporter: string;
  team: string;
  parentId?: number;
  start_date?: string;
  due_date?: string;
  priority: string;
  status: string;
  labels: string;
  attachmentUrl?: string;
  created_at?: string;
  updated_at?: string;
};

type SummaryData = {
  priorityBreakdown: { [key: string]: number };
  typesOfWork: { [key: string]: number };
  recentActivity: {
    id: number;
    user: string;
    title: string;
    status: string;
    date: string;
  }[];
  allIssues: Issue[];
};

// ---------------- MAIN COMPONENT ----------------
export const ExampleComponent = () => {
  const [open, setOpen] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
  const [tab, setTab] = useState<'summary' | 'board' | 'calendar'>('summary');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    assignee: '',
    reporter: '',
    team: '',
    parentId: '',
    start_date: '',
    due_date: '',
    priority: '',
    status: '',
    labels: '',
    attachmentUrl: '',
  });

  const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
  const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];

  // ---------------- CRUD HANDLERS ----------------
  const handleOpen = () => {
    setEditingIssueId(null);
    setFormData({
      title: '',
      description: '',
      type: '',
      assignee: '',
      reporter: '',
      team: '',
      parentId: '',
      start_date: '',
      due_date: '',
      priority: '',
      status: '',
      labels: '',
      attachmentUrl: '',
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, attachmentUrl: file.name });
    }
  };

  const fetchCreatedIssues = async () => {
    try {
      const res = await fetch('http://localhost:7007/api/jira-project/issues');
      if (res.ok) {
        const data: Issue[] = await res.json();
        setCreatedIssues(data);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:7007/api/issues/summary');
      if (res.ok) {
        const data: SummaryData = await res.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingIssueId) {
        const response = await fetch(
          `http://localhost:7007/api/jira-project/issues/${editingIssueId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          },
        );
        if (response.ok) {
          const updatedIssue: Issue = await response.json();
          setCreatedIssues(prev =>
            prev.map(issue =>
              issue.id === editingIssueId ? updatedIssue : issue,
            ),
          );
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
            body: JSON.stringify(formData),
          },
        );
        if (response.ok) {
          const newIssue: Issue = await response.json();
          alert('Issue created successfully');
          setCreatedIssues(prev => [...prev, newIssue]);
        } else {
          alert('Failed to create issue');
        }
      }
      setOpen(false);
      fetchSummary(); // refresh summary after submit
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
      assignee: issue.assignee || '',
      reporter: issue.reporter || '',
      team: issue.team || '',
      parentId: issue.parentId ? String(issue.parentId) : '',
      start_date: issue.start_date || '',
      due_date: issue.due_date || '',
      priority: issue.priority || '',
      status: issue.status || '',
      labels: issue.labels || '',
      attachmentUrl: issue.attachmentUrl || '',
    });
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
        alert('Issue deleted successfully');
        fetchSummary();
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
  }, []);

  // ---------------- DRAG HANDLER ----------------
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
        }
      } catch (error) {
        console.error('Error updating issue status:', error);
      }
    }
  };

  // ---------------- SUMMARY LOGIC ----------------
  const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

  const renderSummary = () => {
    if (!summary) return <p>Loading summary...</p>;

    const now = new Date();
    const allIssues = summary.allIssues;

    const last7Days = allIssues.filter(
      i => i.created_at && differenceInDays(now, new Date(i.created_at)) <= 7,
    );
    const updated7Days = allIssues.filter(
      i => i.updated_at && differenceInDays(now, new Date(i.updated_at)) <= 7,
    );
    const completed7Days = allIssues.filter(
      i =>
        i.status === 'Done' &&
        i.updated_at &&
        differenceInDays(now, new Date(i.updated_at)) <= 7,
    );
    const dueSoon = allIssues.filter(
      i =>
        i.due_date &&
        differenceInDays(new Date(i.due_date), now) >= 0 &&
        differenceInDays(new Date(i.due_date), now) <= 7,
    );

    const statusCounts = statuses.map(s => ({
      name: s,
      value: allIssues.filter(i => (i.status || 'To Do') === s).length,
    }));

    const priorityData = Object.entries(summary.priorityBreakdown).map(
      ([key, value]) => ({ name: key, count: value }),
    );
    const typeData = Object.entries(summary.typesOfWork).map(
      ([key, value]) => ({ name: key, count: value }),
    );

    return (
      <Page themeId="tool">
        <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
          <HeaderLabel label="Owner" value="Team X" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
        <Content>
          {/* View toggle tabs */}
          <Tabs
            value={tab}
            onChange={(_, newVal) => setTab(newVal)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab value="summary" label="Summary" />
            <Tab value="board" label="Board View" />
            <Tab value="calendar" label="Calendar View" />
          </Tabs>

          {/* Create Issue Button */}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              onClick={handleOpen}
            >
              Create Issue
            </Button>
          </Grid>

          {/* SUMMARY VIEW */}
          {tab === 'summary' && (
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              {/* Existing 4 cards */}
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography>
                      ✅ <strong>{completed7Days.length} completed</strong>
                      <br />
                      <span style={{ color: 'gray' }}>in next 7 days</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography>
                      ✏️ <strong>{updated7Days.length} updated</strong>
                      <br />
                      <span style={{ color: 'gray' }}>in next 7 days</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography>
                      <strong>➕ {last7Days.length} created</strong>
                      <br />
                      <span style={{ color: 'gray' }}>in next 7 days</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Typography>
                      <strong>📅 {dueSoon.length} due soon</strong>
                      <br />
                      <span style={{ color: 'gray' }}>in next 7 days</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Status Overview */}
              <Grid item xs={12} md={6}>
                <Card className="shadow-lg rounded-2xl">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Status overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={statusCounts}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label
                        >
                          {statusCounts.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
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
              Priority Breakdown
              <Grid item xs={12} md={6}>
                <Card className="shadow-lg rounded-2xl">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Priority breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={priorityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#6b7280"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              {/* Types of Work */}
              <Grid item xs={12} md={6}>
                <Card className="shadow-lg rounded-2xl">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Types of work
                    </Typography>
                    {typeData.map(t => (
                      <div
                        key={t.name}
                        className="flex justify-between items-center my-2"
                      >
                        <span className="capitalize">{t.name}</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gray-500 h-3 rounded-full"
                            style={{ width: `${t.count}%` }}
                          />
                        </div>
                        <span>{t.count}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Card className="shadow-lg rounded-2xl">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent activity
                    </Typography>
                    <ul className="divide-y divide-gray-200">
                      {summary.recentActivity.map(activity => (
                        <li
                          key={activity.id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div>
                            <Typography variant="body1" className="font-medium">
                              {activity.user}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Updated{' '}
                              <span className="font-semibold">
                                {activity.title}
                              </span>
                            </Typography>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                              {activity.status}
                            </span>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(activity.date).toLocaleDateString()}
                            </Typography>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* BOARD VIEW */}
          {tab === 'board' && (
            <Grid item style={{ marginTop: 16 }}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={2}>
                  {statuses.map(status => (
                    <Grid item xs={3} key={status}>
                      <Typography
                        variant="h6"
                        align="center"
                        style={{ marginBottom: '8px' }}
                      >
                        {status}
                      </Typography>
                      <Droppable droppableId={status}>
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              minHeight: '300px',
                              backgroundColor: '#f4f5f7',
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            {createdIssues
                              .filter(
                                issue => (issue.status || 'To Do') === status,
                              )
                              .map((issue, index) => (
                                <Draggable
                                  key={issue.id.toString()}
                                  draggableId={issue.id.toString()}
                                  index={index}
                                >
                                  {providedDraggable => (
                                    <Card
                                      ref={providedDraggable.innerRef}
                                      {...providedDraggable.draggableProps}
                                      {...providedDraggable.dragHandleProps}
                                      style={{
                                        marginBottom: '8px',
                                        ...providedDraggable.draggableProps
                                          .style,
                                      }}
                                    >
                                      <CardContent>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <div>
                                            <Typography
                                              variant="subtitle2"
                                              color="textSecondary"
                                            >
                                              {issue.type}
                                            </Typography>
                                            <Typography variant="h6">
                                              {issue.title}
                                            </Typography>
                                            <Typography variant="body2">
                                              Priority:{' '}
                                              {issue.priority ?? 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                              Assignee: {issue.assignee}
                                            </Typography>
                                          </div>
                                          <div>
                                            <IconButton
                                              onClick={() => handleEdit(issue)}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                              onClick={() =>
                                                handleDelete(issue.id)
                                              }
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </div>
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
                    </Grid>
                  ))}
                </Grid>
              </DragDropContext>
            </Grid>
          )}

          {/* CALENDAR VIEW */}
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
                      title: `${issue.title}`,
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
                  height="auto"
                />
              </div>
            </Grid>
          )}
        </Content>

        {/* CREATE/EDIT DIALOG */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingIssueId ? 'Edit Issue' : 'Create New Issue'}
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Issue Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {issueTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            {formData.type && (
              <>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  label="Assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Reporter"
                  name="reporter"
                  value={formData.reporter}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Parent ID"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Start Date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Due Date"
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Labels"
                  name="labels"
                  value={formData.labels}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <label
                  htmlFor="attachment"
                  style={{
                    fontWeight: 'bold',
                    marginTop: 10,
                    display: 'block',
                  }}
                >
                  Attachment URL
                </label>
                <input
                  id="attachment"
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  style={{ marginTop: '8px', display: 'block' }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {editingIssueId ? 'Save Changes' : 'Create Issue'}
            </Button>
          </DialogActions>
        </Dialog>
      </Page>
    );
  };
};
