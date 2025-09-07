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
//   Avatar,
//   Chip,
//   Divider,
//   Popover,
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
// import type { EventClickArg } from '@fullcalendar/core';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from 'recharts';

// /** ---------- Types ---------- */
// type UserRef = {
//   name: string;
//   email?: string;
// };

// type PersonOrString = UserRef | string | null;
// type TeamField = UserRef[] | string | null;

// type Issue = {
//   id: number;
//   title: string;
//   description: string;
//   type: string;
//   assignee: PersonOrString;
//   reporter: PersonOrString;
//   team: TeamField;
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

// type IssueSummary = {
//   total: number;
//   open: number;
//   closed: number;
//   highPriority: number;
//   types: { type: string; count: number }[];
//   priorities: { priority: string; count: number }[];
// };

// /** ---------- Helpers ---------- */
// const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// function titleCase(s: string) {
//   return s
//     .split(/\s+/)
//     .filter(Boolean)
//     .map(p => p[0]?.toUpperCase() + p.slice(1).toLowerCase())
//     .join(' ');
// }

// function nameFromEmail(email: string) {
//   const local = (email && String(email).split('@')[0]) || '';
//   const spaced = local.replace(/[._-]+/g, ' ');
//   return titleCase(spaced);
// }

// function initialsFromName(name: string) {
//   if (!name) return '?';
//   const parts = name.trim().split(/\s+/);
//   const first = (parts[0]?.[0] || '').toUpperCase();
//   const second = (parts[1]?.[0] || '').toUpperCase();
//   return first + second || first || '?';
// }

// /** Generate consistent color from email */
// function stringToColor(str: string) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     // simple hash
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const hue = Math.abs(hash) % 360;
//   return hsl(${hue}, 70%, 60%);
// }

// /** ---------- Custom accessible circular email chip (button) ---------- */
// /** Keeps the same EmailChip name so integration is minimal. */
// function EmailChip({
//   email,
//   onClick,
//   selected,
//   size = 36,
// }: {
//   email: string;
//   onClick: () => void;
//   selected: boolean;
//   size?: number;
// }) {
//   const name = nameFromEmail(email);
//   const initials = initialsFromName(name);
//   const bg = stringToColor(email);

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={selected}
//       title={email}
//       style={{
//         cursor: 'pointer',
//         borderRadius: '50%',
//         width: size,
//         height: size,
//         display: 'inline-flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: selected ? '#111' : bg,
//         color: 'white',
//         fontWeight: 700,
//         marginRight: 8,
//         border: 'none',
//         outline: 'none',
//       }}
//       onKeyDown={e => {
//         if (e.key === 'Enter' || e.key === ' ') {
//           e.preventDefault();
//           onClick();
//         }
//       }}
//     >
//       {initials}
//     </button>
//   );
// }

// /** Parse fields returned by backend robustly:
//  * - If value is null/undefined -> null / []
//  * - If value is object -> use it
//  * - If value is JSON string -> parse it
//  * - If value is plain string (non-JSON) -> return string (or single-member team)
//  */
// function parsePersonField(v: any): PersonOrString {
//   if (v === null) return null;
//   if (typeof v === 'object') {
//     // Already parsed object, assume { name, email }
//     return v as UserRef;
//   }
//   if (typeof v === 'string') {
//     // Try JSON.parse (common if backend stored JSON.stringify)
//     try {
//       const p = JSON.parse(v);
//       if (p && typeof p === 'object') return p as UserRef;
//     } catch {
//       // not JSON — fallthrough to return the raw string
//     }
//     return v;
//   }
//   return null;
// }

// function parseTeamField(v: any): UserRef[] {
//   if (v === null) return [];
//   if (Array.isArray(v)) {
//     return v as UserRef[];
//   }
//   if (typeof v === 'object') {
//     // object but not array — maybe a single member stored as object
//     return [v as UserRef];
//   }
//   if (typeof v === 'string') {
//     // Try parse JSON array first
//     try {
//       const parsed = JSON.parse(v);
//       if (Array.isArray(parsed)) return parsed as UserRef[];
//       if (parsed && typeof parsed === 'object') return [parsed as UserRef];
//     } catch {
//       // not JSON — treat as a single plain string name/email
//       // If it looks like an email, extract name from it
//       if (emailRegex.test(v)) {
//         return [{ name: nameFromEmail(v), email: v }];
//       }
//       return [{ name: String(v) }];
//     }
//   }
//   return [];
// }

// /** ---------- Main component ---------- */
// export const ExampleComponent = () => {
//   // original states & form data (kept as in your original file)
//   const [open, setOpen] = useState(false);
//   const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
//   const [tab, setTab] = useState<'summary' | 'board' | 'calendar'>('summary');

//   const [formData, setFormData] = useState<{
//     title: string;
//     description: string;
//     type: string;
//     assignee: PersonOrString;
//     reporter: PersonOrString;
//     team: UserRef[];
//     parentId: string;
//     start_date: string;
//     due_date: string;
//     priority: string;
//     status: string;
//     labels: string;
//     attachmentUrl: string;
//   }>({
//     title: '',
//     description: '',
//     type: '',
//     assignee: null,
//     reporter: null,
//     team: [],
//     parentId: '',
//     start_date: '',
//     due_date: '',
//     priority: '',
//     status: '',
//     labels: '',
//     attachmentUrl: '',
//   });

//   // local inputs for people pickers
//   const [assigneeEmail, setAssigneeEmail] = useState('');
//   const [assigneeName, setAssigneeName] = useState('');
//   const [reporterEmail, setReporterEmail] = useState('');
//   const [reporterName, setReporterName] = useState('');

//   // team dialog state
//   const [teamDialogOpen, setTeamDialogOpen] = useState(false);
//   const [teamName, setTeamName] = useState(''); // optional team name
//   const [teamMemberEmail, setTeamMemberEmail] = useState('');
//   const [teamMemberName, setTeamMemberName] = useState('');

//   const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
//   const [summary, setSummary] = useState<IssueSummary | null>(null);
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [summaryError, setSummaryError] = useState<string | null>(null);

//   const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];

//   //  Backend values always uppercase
//   const statuses = [
//     { value: 'TODO', label: 'To Do' },
//     { value: 'IN_PROGRESS', label: 'In Progress' },
//     { value: 'TESTING', label: 'Testing' },
//     { value: 'DONE', label: 'Done' },
//   ];

//   const priorities = ['LOW', 'MEDIUM', 'HIGH'];

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       type: '',
//       assignee: null,
//       reporter: null,
//       team: [],
//       parentId: '',
//       start_date: '',
//       due_date: '',
//       priority: '',
//       status: '',
//       labels: '',
//       attachmentUrl: '',
//     });
//     setAssigneeEmail('');
//     setAssigneeName('');
//     setReporterEmail('');
//     setReporterName('');
//     setTeamName('');
//     setTeamMemberEmail('');
//     setTeamMemberName('');
//   };

//   const handleOpen = () => {
//     setEditingIssueId(null);
//     resetForm();
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     resetForm();
//   };

//   const normalizeStatus = (status: string | null): string => {
//     if (!status) return 'TODO';
//     const s = status.toUpperCase().replace(' ', '_');
//     if (['TODO', 'IN_PROGRESS', 'TESTING', 'DONE'].includes(s)) return s;
//     return 'TODO';
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData({ ...formData, attachmentUrl: file.name });
//     }
//   };

//   /** Fetch issues and normalize person/team fields */
//   const fetchCreatedIssues = async () => {
//     try {
//       const res = await fetch('http://localhost:7007/api/jira-project/issues');
//       if (res.ok) {
//         const data: any[] = await res.json();
//         const parsed: Issue[] = data.map(raw => ({
//           ...raw,
//           status: normalizeStatus(raw.status),
//           assignee: parsePersonField(raw.assignee),
//           reporter: parsePersonField(raw.reporter),
//           team: parseTeamField(raw.team),
//         }));
//         setCreatedIssues(parsed);
//       } else {
//         console.error('Failed to fetch issues', res.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching issues:', error);
//     }
//   };

//   const fetchSummary = async () => {
//     setSummaryLoading(true);
//     setSummaryError(null);
//     try {
//       const res = await fetch(
//         'http://localhost:7007/api/jira-project/issues-summary',
//       );
//       if (!res.ok) throw new Error('Failed to fetch issue summary');
//       const raw = await res.json();
//       const toNum = (v: any) =>
//         typeof v === 'string' ? parseInt(v, 10) : Number(v) || 0;
//       setSummary({
//         total: toNum(raw.total),
//         open: toNum(raw.open),
//         closed: toNum(raw.closed),
//         highPriority: toNum(raw.highPriority),
//         types: (raw.types || []).map((t: any) => ({
//           type: t.type,
//           count: toNum(t.count),
//         })),
//         priorities: (raw.priorities || []).map((p: any) => ({
//           priority: p.priority,
//           count: toNum(p.count),
//         })),
//       });
//     } catch (e: any) {
//       console.error(e);
//       setSummaryError(e?.message || 'Error loading summary');
//       setSummary(null);
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   /** ---------- People picker helpers ---------- */
//   const addAssignee = () => {
//     if (!emailRegex.test(assigneeEmail)) {
//       alert('Enter a valid assignee email');
//       return;
//     }
//     const name = assigneeName.trim() || nameFromEmail(assigneeEmail);
//     setFormData(prev => ({
//       ...prev,
//       assignee: { name, email: assigneeEmail },
//     }));
//     setAssigneeEmail('');
//     setAssigneeName('');
//   };

//   const clearAssignee = () => {
//     setFormData(prev => ({ ...prev, assignee: null }));
//   };

//   const addReporter = () => {
//     if (!emailRegex.test(reporterEmail)) {
//       alert('Enter a valid reporter email');
//       return;
//     }
//     const name = reporterName.trim() || nameFromEmail(reporterEmail);
//     setFormData(prev => ({
//       ...prev,
//       reporter: { name, email: reporterEmail },
//     }));
//     setReporterEmail('');
//     setReporterName('');
//   };

//   const clearReporter = () => {
//     setFormData(prev => ({ ...prev, reporter: null }));
//   };

//   const addTeamMember = () => {
//     if (!emailRegex.test(teamMemberEmail)) {
//       alert('Enter a valid team member email');
//       return;
//     }
//     const name = teamMemberName.trim() || nameFromEmail(teamMemberEmail);
//     setFormData(prev => ({
//       ...prev,
//       team: [...prev.team, { name, email: teamMemberEmail }],
//     }));
//     setTeamMemberEmail('');
//     setTeamMemberName('');
//   };

//   const removeTeamMember = (email: string) => {
//     setFormData(prev => ({
//       ...prev,
//       team: prev.team.filter(m => m.email !== email),
//     }));
//   };

//   /** ---------- Submit (create/update) ---------- */
//   const handleSubmit = async () => {
//     try {
//       // reporter required by backend
//       if (!formData.reporter) {
//         alert('Reporter is required');
//         return;
//       }

//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         type: formData.type,
//         assignee: formData.assignee,
//         reporter: formData.reporter,
//         team: formData.team,
//         parentId: formData.parentId ? Number(formData.parentId) : null,
//         start_date: formData.start_date || null,
//         due_date: formData.due_date || null,
//         priority: formData.priority,
//         status: normalizeStatus(formData.status),
//         labels: formData.labels,
//         attachmentUrl: formData.attachmentUrl,
//       };

//       if (editingIssueId) {
//         const response = await fetch(
//           http://localhost:7007/api/jira-project/issues/${editingIssueId},
//           {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//           },
//         );
//         if (response.ok) {
//           const updatedIssue: any = await response.json();
//           const parsed: Issue = {
//             ...updatedIssue,
//             status: normalizeStatus(updatedIssue.status),
//             assignee: parsePersonField(updatedIssue.assignee),
//             reporter: parsePersonField(updatedIssue.reporter),
//             team: parseTeamField(updatedIssue.team),
//           };
//           setCreatedIssues(prev =>
//             prev.map(issue => (issue.id === editingIssueId ? parsed : issue)),
//           );
//           await fetchSummary();
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
//             body: JSON.stringify(payload),
//           },
//         );
//         if (response.ok) {
//           const newIssue: any = await response.json();
//           const parsed: Issue = {
//             ...newIssue,
//             status: normalizeStatus(newIssue.status),
//             assignee: parsePersonField(newIssue.assignee),
//             reporter: parsePersonField(newIssue.reporter),
//             team: parseTeamField(newIssue.team),
//           };
//           setCreatedIssues(prev => [...prev, parsed]);
//           await fetchSummary();
//           alert('Issue created successfully');
//         } else {
//           alert('Failed to create issue');
//         }
//       }
//       setOpen(false);
//       resetForm();
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
//       assignee: issue.assignee || null,
//       reporter: issue.reporter || null,
//       team: Array.isArray(issue.team)
//         ? [...issue.team]
//         : parseTeamField(issue.team),
//       parentId: issue.parentId ? String(issue.parentId) : '',
//       start_date: issue.start_date || '',
//       due_date: issue.due_date || '',
//       priority: issue.priority || '',
//       status: normalizeStatus(issue.status),
//       labels: issue.labels || '',
//       attachmentUrl: issue.attachmentUrl || '',
//     });
//     // clear the local input boxes (optional)
//     setAssigneeEmail('');
//     setAssigneeName('');
//     setReporterEmail('');
//     setReporterName('');
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this issue?')) return;
//     try {
//       const res = await fetch(
//         http://localhost:7007/api/jira-project/issues/${id},
//         {
//           method: 'DELETE',
//         },
//       );
//       if (res.ok) {
//         setCreatedIssues(prev => prev.filter(issue => issue.id !== id));
//         await fetchSummary();
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
//     fetchSummary();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
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
//           http://localhost:7007/api/jira-project/issues/${movedIssue.id}/status,
//           {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: movedIssue.status }),
//           },
//         );
//         if (!res.ok) {
//           console.error('Failed to update issue status');
//         } else {
//           await fetchSummary();
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
//       normalizeStatus(i.status) === 'DONE' &&
//       differenceInDays(now, new Date(i.updated_at)) <= 7,
//   );
//   const dueSoon = createdIssues.filter(
//     i =>
//       i.due_date &&
//       differenceInDays(new Date(i.due_date), now) >= 0 &&
//       differenceInDays(new Date(i.due_date), now) <= 7,
//   );

//   const statusCounts = statuses.map(s => ({
//     name: s.label,
//     value: createdIssues.filter(i => normalizeStatus(i.status) === s.value)
//       .length,
//   }));

//   const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];

//   const PRIORITY_COLORS: Record<string, string> = {
//     HIGH: '#ff4d4f',
//     MEDIUM: '#faad14',
//     LOW: '#52c41a',
//   };
//   const TYPE_COLORS: Record<string, string> = {
//     Epic: '#8e44ad',
//     Feature: '#2980b9',
//     Task: '#27ae60',
//     Story: '#f1c40f',
//     Bug: '#e67e22',
//   };

//   const typeChartData = summary?.types
//     ? issueTypes.map(t => {
//         const found = summary.types.find(x => x.type === t);
//         return { type: t, count: found ? Number(found.count) : 0 };
//       })
//     : [];

//   const priorityChartData = summary?.priorities
//     ? ['HIGH', 'MEDIUM', 'LOW'].map(p => {
//         const found = summary.priorities.find(
//           x => String(x.priority).toUpperCase() === p,
//         );
//         return { priority: p, count: found ? Number(found.count) : 0 };
//       })
//     : [];

//   /** ---------- safe render helpers for board ---------- */
//   const renderPersonChip = (field: PersonOrString) => {
//     if (!field) return null;
//     if (typeof field === 'string') {
//       return (
//         <Chip
//           avatar={<Avatar>{String(field)[0]?.toUpperCase() || '?'}</Avatar>}
//           label={field}
//           size="small"
//         />
//       );
//     }
//     // object
//     return (
//       <Chip
//         avatar={<Avatar>{initialsFromName(field.name)}</Avatar>}
//         label={field.name}
//         size="small"
//       />
//     );
//   };

//   const renderTeamChips = (teamField: TeamField) => {
//     if (!teamField) return null;
//     if (typeof teamField === 'string') {
//       return (
//         <Chip
//           avatar={<Avatar>{teamField[0]?.toUpperCase()}</Avatar>}
//           label={teamField}
//           size="small"
//         />
//       );
//     }
//     // array of UserRef
//     return (
//       <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
//         {teamField.map(member => (
//           <Chip
//             key={member.email || member.name}
//             avatar={<Avatar>{initialsFromName(member.name)}</Avatar>}
//             label={member.name}
//             size="small"
//           />
//         ))}
//       </div>
//     );
//   };

//   /** ---------- NEW: search + email-filter state & derived data ---------- */
//   // added the following state hooks to fix missing variable errors:
//   const [searchTerm, setSearchTerm] = useState(''); // added
//   const [selectedEmail, setSelectedEmail] = useState<string | null>(null); // added
//   const [chipAnchor, setChipAnchor] = useState<HTMLElement | null>(null); // added

//   // compute unique emails robustly (assignee, reporter, team members) including string forms
//   const uniqueEmails: string[] = Array.from(
//     new Set(
//       createdIssues.flatMap(issue => {
//         const arr: string[] = [];
//         // assignee
//         if (typeof issue.assignee === 'object' && issue.assignee?.email)
//           arr.push(issue.assignee.email as string);
//         if (
//           typeof issue.assignee === 'string' &&
//           emailRegex.test(issue.assignee)
//         )
//           arr.push(issue.assignee as string);
//         // reporter
//         if (typeof issue.reporter === 'object' && issue.reporter?.email)
//           arr.push(issue.reporter.email as string);
//         if (
//           typeof issue.reporter === 'string' &&
//           emailRegex.test(issue.reporter)
//         )
//           arr.push(issue.reporter as string);
//         // team
//         if (Array.isArray(issue.team))
//           issue.team.forEach(m => m.email && arr.push(m.email as string));
//         return arr.filter(Boolean);
//       }),
//     ),
//   ).filter(Boolean);

//   // search matcher across multiple fields
//   const matchesSearch = (issue: Issue, term: string) => {
//     if (!term) return true;
//     const t = term.toLowerCase();

//     if ((issue.title || '').toLowerCase().includes(t)) return true;
//     if (
//       String(issue.description || '')
//         .toLowerCase()
//         .includes(t)
//     )
//       return true;
//     // assignee
//     if (issue.assignee && typeof issue.assignee === 'object') {
//       if (
//         (issue.assignee.name &&
//           issue.assignee.name.toLowerCase().includes(t)) ||
//         (issue.assignee.email && issue.assignee.email.toLowerCase().includes(t))
//       ) {
//         return true;
//       }
//     } else if (
//       typeof issue.assignee === 'string' &&
//       issue.assignee.toLowerCase().includes(t)
//     ) {
//       return true;
//     }

//     // reporter
//     if (issue.reporter && typeof issue.reporter === 'object') {
//       if (
//         (issue.reporter.name &&
//           issue.reporter.name.toLowerCase().includes(t)) ||
//         (issue.reporter.email && issue.reporter.email.toLowerCase().includes(t))
//       ) {
//         return true;
//       }
//     } else if (
//       typeof issue.reporter === 'string' &&
//       issue.reporter.toLowerCase().includes(t)
//     ) {
//       return true;
//     }

//     // team
//     if (Array.isArray(issue.team)) {
//       for (const m of issue.team) {
//         if (m.name && m.name.toLowerCase().includes(t)) return true;
//         if (m.email && m.email.toLowerCase().includes(t)) return true;
//       }
//     }

//     return false;
//   };

//   const filteredIssues = createdIssues.filter(issue => {
//     const matches = matchesSearch(issue, searchTerm);

//     const matchesEmail =
//       !selectedEmail ||
//       (typeof issue.assignee === 'object' &&
//         issue.assignee?.email === selectedEmail) ||
//       (typeof issue.assignee === 'string' &&
//         issue.assignee === selectedEmail) ||
//       (typeof issue.reporter === 'object' &&
//         issue.reporter?.email === selectedEmail) ||
//       (typeof issue.reporter === 'string' &&
//         issue.reporter === selectedEmail) ||
//       (Array.isArray(issue.team) &&
//         issue.team.some(m => m.email === selectedEmail));

//     return matches && matchesEmail;
//   });

//   // filtered aggregates used in UI (so the filter applies to summary/boards/calendar)
//   const fNow = new Date();
//   const fLast7Days = filteredIssues.filter(
//     i => differenceInDays(fNow, new Date(i.created_at)) <= 7,
//   );
//   const fUpdated7Days = filteredIssues.filter(
//     i => differenceInDays(fNow, new Date(i.updated_at)) <= 7,
//   );
//   const fCompleted7Days = filteredIssues.filter(
//     i =>
//       normalizeStatus(i.status) === 'DONE' &&
//       differenceInDays(fNow, new Date(i.updated_at)) <= 7,
//   );
//   const fDueSoon = filteredIssues.filter(
//     i =>
//       i.due_date &&
//       differenceInDays(new Date(i.due_date), fNow) >= 0 &&
//       differenceInDays(new Date(i.due_date), fNow) <= 7,
//   );

//   const statusCountsFiltered = statuses.map(s => ({
//     name: s.label,
//     value: filteredIssues.filter(i => normalizeStatus(i.status) === s.value)
//       .length,
//   }));

//   const filteredTypeChartData = issueTypes.map(t => ({
//     type: t,
//     count: filteredIssues.filter(i => i.type === t).length,
//   }));

//   const filteredPriorityChartData = ['HIGH', 'MEDIUM', 'LOW'].map(p => ({
//     priority: p,
//     count: filteredIssues.filter(i => String(i.priority).toUpperCase() === p)
//       .length,
//   }));

//   /** ---------- Render ---------- */
//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to jira-project!" subtitle="Optional subtitle">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>
//       <Content>
//         {/* Tabs */}
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

//         {/* Top controls: Create Project + Search + Email chips */}
//         <Grid
//           container
//           spacing={2}
//           alignItems="center"
//           style={{ marginTop: '16px' }}
//         >
//           <Grid item>
//             <Button variant="contained" color="primary" onClick={handleOpen}>
//               CREATE PROJECT
//             </Button>
//           </Grid>

//           <Grid item xs>
//             <TextField
//               placeholder="Search projects, titles, descriptions, people..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               fullWidth
//               variant="outlined"
//               size="small"
//             />
//           </Grid>

//           <Grid item>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               {uniqueEmails.slice(0, 3).map(email => (
//                 <div key={email}>
//                   <EmailChip
//                     email={email}
//                     onClick={() =>
//                       setSelectedEmail(prev => (prev === email ? null : email))
//                     }
//                     selected={selectedEmail === email}
//                   />
//                 </div>
//               ))}

//               {uniqueEmails.length > 3 && (
//                 <div
//                   onClick={e => setChipAnchor(e.currentTarget as HTMLElement)}
//                   style={{
//                     cursor: 'pointer',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: 36,
//                     height: 36,
//                     borderRadius: '50%',
//                     backgroundColor: '#e0e0e0',
//                     color: '#333',
//                     fontWeight: 700,
//                     marginLeft: 4,
//                     border: 'none',
//                   }}
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={e => {
//                     if (e.key === 'Enter')
//                       setChipAnchor(e.currentTarget as HTMLElement);
//                   }}
//                 >
//                   +{uniqueEmails.length - 3}
//                 </div>
//               )}
//             </div>
//           </Grid>
//         </Grid>

//         <Popover
//           open={Boolean(chipAnchor)}
//           anchorEl={chipAnchor}
//           onClose={() => setChipAnchor(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         >
//           <Grid container spacing={1} style={{ padding: 8 }}>
//             {uniqueEmails.slice(3).map(email => (
//               <Grid item key={email}>
//                 <EmailChip
//                   email={email}
//                   onClick={() => {
//                     setSelectedEmail(prev => (prev === email ? null : email));
//                     setChipAnchor(null);
//                   }}
//                   selected={selectedEmail === email}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Popover>

//         {/* Summary view — uses filtered aggregates */}
//         {tab === 'summary' && (
//           <Grid container spacing={2} style={{ marginTop: 16 }}>
//             <Grid item xs={12}>
//               <Typography variant="h6">Summary (from backend)</Typography>
//             </Grid>
//             {summaryLoading && <Typography>Loading summary…</Typography>}
//             {summaryError && (
//               <Typography color="error">{summaryError}</Typography>
//             )}
//             {!summaryLoading && !summaryError && summary && (
//               <>
//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>📊 {filteredIssues.length} total</strong>
//                         <br />
//                         <span style={{ color: 'gray' }}>
//                           backend: {summary.total}
//                         </span>
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>🟡 {fUpdated7Days.length} open</strong>
//                         <br />
//                         <span style={{ color: 'gray' }}>
//                           backend: {summary.open}
//                         </span>
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>✅ {fCompleted7Days.length} closed</strong>
//                         <br />
//                         <span style={{ color: 'gray' }}>
//                           backend: {summary.closed}
//                         </span>
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>
//                           🔥{' '}
//                           {
//                             filteredIssues.filter(
//                               i => String(i.priority).toUpperCase() === 'HIGH',
//                             ).length
//                           }{' '}
//                           high priority
//                         </strong>
//                         <br />
//                         <span style={{ color: 'gray' }}>
//                           backend: {summary.highPriority}
//                         </span>
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </>
//             )}
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✅ <strong>{fCompleted7Days.length} completed</strong>
//                     <br />
//                     last 7 days
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ✏ <strong>{fUpdated7Days.length} updated</strong>
//                     <br />
//                     last 7 days
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     ➕ <strong>{fLast7Days.length} created</strong>
//                     <br />
//                     last 7 days
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={3}>
//               <Card>
//                 <CardContent>
//                   <Typography>
//                     📅 <strong>{fDueSoon.length} due soon</strong>
//                     <br />
//                     next 7 days
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
//                         data={statusCountsFiltered}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={100}
//                         label
//                       >
//                         {statusCountsFiltered.map((entry, index) => (
//                           <Cell
//                             key={cell-${index}}
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

//             <Grid item xs={12} style={{ marginTop: 20 }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Types of work</Typography>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={filteredTypeChartData}
//                         dataKey="count"
//                         nameKey="type"
//                         outerRadius={100}
//                         label
//                       >
//                         {filteredTypeChartData.map((entry, index) => (
//                           <Cell
//                             key={cell-type-${index}}
//                             fill={
//                               TYPE_COLORS[entry.type] ||
//                               COLORS[index % COLORS.length]
//                             }
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

//             <Grid item xs={12} style={{ marginTop: 20 }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Priority breakdown</Typography>
//                   <ResponsiveContainer width="100%" height={320}>
//                     <BarChart
//                       data={filteredPriorityChartData}
//                       margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="priority" />
//                       <YAxis allowDecimals={false} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="count" name="Count">
//                         {filteredPriorityChartData.map((entry, index) => (
//                           <Cell
//                             key={cell-priority-${index}}
//                             fill={
//                               PRIORITY_COLORS[entry.priority] ||
//                               COLORS[index % COLORS.length]
//                             }
//                           />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         )}

//         {/* Board View with normalized statuses and safe rendering (uses filteredIssues) */}
//         {tab === 'board' && (
//           <Grid item style={{ marginTop: 16 }}>
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Grid container spacing={2}>
//                 {statuses.map(s => (
//                   <Grid item xs={3} key={s.value}>
//                     <Typography variant="h6" align="center">
//                       {s.label}
//                     </Typography>
//                     <Droppable droppableId={s.value}>
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
//                           {filteredIssues
//                             .filter(
//                               issue =>
//                                 normalizeStatus(issue.status) === s.value,
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

//                                           {/* Assignee (safe) */}
//                                           {issue.assignee && (
//                                             <div style={{ marginTop: 6 }}>
//                                               {renderPersonChip(issue.assignee)}
//                                             </div>
//                                           )}

//                                           {/* Reporter (safe) */}
//                                           {issue.reporter && (
//                                             <div style={{ marginTop: 6 }}>
//                                               <Typography
//                                                 variant="caption"
//                                                 color="textSecondary"
//                                               >
//                                                 Reporter
//                                               </Typography>
//                                               <div style={{ marginTop: 4 }}>
//                                                 {renderPersonChip(
//                                                   issue.reporter,
//                                                 )}
//                                               </div>
//                                             </div>
//                                           )}

//                                           {/* Team (safe) */}
//                                           {issue.team && (
//                                             <div style={{ marginTop: 6 }}>
//                                               <Typography
//                                                 variant="caption"
//                                                 color="textSecondary"
//                                               >
//                                                 Team
//                                               </Typography>
//                                               {renderTeamChips(issue.team)}
//                                             </div>
//                                           )}
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

//         {/* Calendar (uses filteredIssues) */}
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
//                 events={filteredIssues
//                   .filter(issue => issue.start_date || issue.due_date)
//                   .map(issue => ({
//                     id: issue.id.toString(),
//                     title: issue.title,
//                     start: issue.start_date || issue.due_date,
//                     end: issue.due_date || issue.start_date,
//                   }))}
//                 eventClick={(info: EventClickArg) => {
//                   const issue = filteredIssues.find(
//                     i => i.id.toString() === info.event.id,
//                   );
//                   if (issue) {
//                     handleEdit(issue);
//                   }
//                 }}
//               />
//             </div>
//           </Grid>
//         )}

//         {/* Dialog for Creating / Editing Issues (people pickers included) */}
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//           <DialogTitle>
//             {editingIssueId ? 'Edit Issue' : 'Create Issue'}
//           </DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               label="Title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//             <TextField
//               margin="dense"
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={3}
//             />
//             <TextField
//               select
//               margin="dense"
//               label="Type"
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               fullWidth
//             >
//               {issueTypes.map(type => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Assignee picker */}
//             <div style={{ marginTop: 12 }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography style={{ fontWeight: 500 }}>Assignee</Typography>
//                 {formData.assignee && (
//                   <Button
//                     size="small"
//                     onClick={clearAssignee}
//                     style={{ marginLeft: 'auto' }}
//                   >
//                     Clear
//                   </Button>
//                 )}
//               </div>
//               {formData.assignee ? (
//                 <div style={{ marginTop: 8 }}>
//                   {renderPersonChip(formData.assignee)}
//                   <Typography variant="caption" style={{ display: 'block' }}>
//                     {typeof formData.assignee === 'string'
//                       ? formData.assignee
//                       : formData.assignee?.email}
//                   </Typography>
//                 </div>
//               ) : (
//                 <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
//                   <TextField
//                     label="Email"
//                     value={assigneeEmail}
//                     onChange={e => {
//                       setAssigneeEmail(e.target.value);
//                       if (emailRegex.test(e.target.value) && !assigneeName) {
//                         setAssigneeName(nameFromEmail(e.target.value));
//                       }
//                     }}
//                     fullWidth
//                   />
//                   <TextField
//                     label="Name"
//                     value={assigneeName}
//                     onChange={e => setAssigneeName(e.target.value)}
//                     fullWidth
//                   />
//                   <Button
//                     variant="outlined"
//                     onClick={addAssignee}
//                     disabled={!emailRegex.test(assigneeEmail)}
//                   >
//                     Add
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Reporter picker */}
//             <div style={{ marginTop: 16 }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography style={{ fontWeight: 500 }}>Reporter *</Typography>
//                 {formData.reporter && (
//                   <Button
//                     size="small"
//                     onClick={clearReporter}
//                     style={{ marginLeft: 'auto' }}
//                   >
//                     Clear
//                   </Button>
//                 )}
//               </div>
//               {formData.reporter ? (
//                 <div style={{ marginTop: 8 }}>
//                   {renderPersonChip(formData.reporter)}
//                   <Typography variant="caption" style={{ display: 'block' }}>
//                     {typeof formData.reporter === 'string'
//                       ? formData.reporter
//                       : formData.reporter?.email}
//                   </Typography>
//                 </div>
//               ) : (
//                 <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
//                   <TextField
//                     label="Email"
//                     value={reporterEmail}
//                     onChange={e => {
//                       setReporterEmail(e.target.value);
//                       if (emailRegex.test(e.target.value) && !reporterName) {
//                         setReporterName(nameFromEmail(e.target.value));
//                       }
//                     }}
//                     fullWidth
//                     required
//                   />
//                   <TextField
//                     label="Name"
//                     value={reporterName}
//                     onChange={e => setReporterName(e.target.value)}
//                     fullWidth
//                   />
//                   <Button
//                     variant="outlined"
//                     onClick={addReporter}
//                     disabled={!emailRegex.test(reporterEmail)}
//                   >
//                     Add
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Team multi-picker managed via dialog */}
//             <div style={{ marginTop: 16 }}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography style={{ fontWeight: 500 }}>Team</Typography>
//                 <Button
//                   size="small"
//                   onClick={() => setTeamDialogOpen(true)}
//                   style={{ marginLeft: 'auto' }}
//                 >
//                   Manage team…
//                 </Button>
//               </div>
//               <div style={{ marginTop: 8 }}>
//                 {formData.team.length === 0 ? (
//                   <Typography variant="caption" color="textSecondary">
//                     No team members selected
//                   </Typography>
//                 ) : (
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {formData.team.map(member => (
//                       <Chip
//                         key={member.email || member.name}
//                         avatar={
//                           <Avatar>{initialsFromName(member.name)}</Avatar>
//                         }
//                         label={member.name}
//                         onDelete={() =>
//                           removeTeamMember(member.email || member.name)
//                         }
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Divider style={{ marginTop: 16, marginBottom: 8 }} />

//             <TextField
//               margin="dense"
//               label="Parent ID"
//               name="parentId"
//               value={formData.parentId}
//               onChange={handleChange}
//               fullWidth
//             />
//             <TextField
//               margin="dense"
//               label="Start Date"
//               name="start_date"
//               type="date"
//               value={formData.start_date}
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               margin="dense"
//               label="Due Date"
//               name="due_date"
//               type="date"
//               value={formData.due_date}
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               select
//               margin="dense"
//               label="Priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               fullWidth
//             >
//               {priorities.map(p => (
//                 <MenuItem key={p} value={p}>
//                   {p}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               select
//               margin="dense"
//               label="Status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               fullWidth
//             >
//               {statuses.map(s => (
//                 <MenuItem key={s.value} value={s.value}>
//                   {s.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               margin="dense"
//               label="Labels"
//               name="labels"
//               value={formData.labels}
//               onChange={handleChange}
//               fullWidth
//             />
//             <input
//               type="file"
//               style={{ marginTop: '16px' }}
//               onChange={handleFileChange}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleSubmit} color="primary" variant="contained">
//               {editingIssueId ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Team creation / management dialog (inline) */}
//         <Dialog
//           open={teamDialogOpen}
//           onClose={() => setTeamDialogOpen(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle>Manage Team</DialogTitle>
//           <DialogContent>
//             <TextField
//               label="Team Name (optional)"
//               value={teamName}
//               onChange={e => setTeamName(e.target.value)}
//               fullWidth
//               margin="dense"
//             />
//             <Typography variant="subtitle2" style={{ marginTop: 12 }}>
//               Add team members
//             </Typography>
//             <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
//               <TextField
//                 label="Email"
//                 value={teamMemberEmail}
//                 onChange={e => {
//                   setTeamMemberEmail(e.target.value);
//                   if (emailRegex.test(e.target.value) && !teamMemberName) {
//                     setTeamMemberName(nameFromEmail(e.target.value));
//                   }
//                 }}
//                 fullWidth
//               />
//               <TextField
//                 label="Name"
//                 value={teamMemberName}
//                 onChange={e => setTeamMemberName(e.target.value)}
//                 fullWidth
//               />
//               <Button
//                 variant="outlined"
//                 onClick={addTeamMember}
//                 disabled={!emailRegex.test(teamMemberEmail)}
//               >
//                 Add
//               </Button>
//             </div>

//             <div
//               style={{
//                 marginTop: 12,
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: 8,
//               }}
//             >
//               {formData.team.map(member => (
//                 <Chip
//                   key={member.email || member.name}
//                   avatar={<Avatar>{initialsFromName(member.name)}</Avatar>}
//                   label={`${member.name}${
//                     member.email ? ` (${member.email})` : ''
//                   }`}
//                   onDelete={() => removeTeamMember(member.email || member.name)}
//                 />
//               ))}
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setTeamDialogOpen(false)}>Cancel</Button>
//             <Button
//               color="primary"
//               variant="contained"
//               onClick={() => setTeamDialogOpen(false)}
//             >
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Content>
// eslint-disable-next-line no-irregular-whitespace
//     </Page>
// eslint-disable-next-line no-irregular-whitespace
//   );
// eslint-disable-next-line notice/notice
// };
