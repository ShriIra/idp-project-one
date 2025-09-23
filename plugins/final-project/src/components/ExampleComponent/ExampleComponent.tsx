/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */
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

// plugins/final-project/src/components/ExampleComponent.tsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Content,
//   Header,
//   Page,
//   Progress,
//   SupportButton,
//   InfoCard,
// } from '@backstage/core-components';
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Toolbar,
//   AppBar,
//   IconButton,
//   Tooltip,
//   Chip,
//   FormHelperText,
// } from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
// import SearchIcon from '@material-ui/icons/Search';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// type TemplateId = 'kanban' | 'scrum';

// const API_BASE = '/api/final-project'; // adjust if your proxy path differs

// // --- Helpers
// const emailValid = (s: string) =>
//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test(
//     s.trim(),
//   );

// const mapColumnNameToStatus = (name: string) => {
//   const n = name.toLowerCase();
//   if (n.includes('todo') || n.includes('to do') || n.includes('todo')) return 'to do';
//   if (n.includes('progress') || n.includes('in progress')) return 'in progress';
//   if (n.includes('test') || n.includes('testing')) return 'testing';
//   if (n.includes('done') || n.includes('complete')) return 'done';
//   // fallback
//   return name;
// };

// // --- Types (match your backend)
// interface Project {
//   id: number;
//   name: string;
//   key: string;
//   template: TemplateId;
//   created_at: string;
// }

// interface Board {
//   id: number;
//   project_id: number;
//   name: string;
// }

// interface Column {
//   id: number;
//   board_id: number;
//   name: string;
//   position: number;
// }

// interface Issue {
//   id: number;
//   project_id?: number;
//   board_id: number;
//   column_id: number;
//   sprint_id?: number | null;
//   title: string;
//   description?: string;
//   type: string;
//   status: string;
//   assignee?: string | null;
//   reporter?: string | null;
//   team?: string[] | null;
//   labels?: string[] | null;
//   priority?: 'low' | 'medium' | 'high' | 'critical';
//   start_date?: string | null;
//   due_date?: string | null;
//   attachments?: any;
//   created_at?: string;
//   updated_at?: string;
// }

// export const ExampleComponent = () => {
//   // app state
//   const [loading, setLoading] = useState(true);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [templates] = useState([
//     {
//       id: 'kanban' as TemplateId,
//       name: 'Kanban',
//       description:
//         'Track work items in a continuous flow, ideal for operations and support teams.',
//     },
//     {
//       id: 'scrum' as TemplateId,
//       name: 'Scrum',
//       description:
//         'Plan sprints and track progress in iterative cycles, ideal for development teams.',
//     },
//   ]);

//   // UI state
//   const [createProjectOpen, setCreateProjectOpen] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
//   const [projectFormOpen, setProjectFormOpen] = useState(false);
//   const [projectForm, setProjectForm] = useState({ name: '', key: '' });
//   const [currentProject, setCurrentProject] = useState<Project | null>(null);

//   // boards/columns/issues
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
//   const [columns, setColumns] = useState<Column[]>([]);
//   const [issues, setIssues] = useState<Issue[]>([]);

//   // UI: navigation & search
//   const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'backlog' | 'board' | 'calendar' | 'list' | 'allwork'>(
//     'board',
//   );
//   const [searchQuery, setSearchQuery] = useState('');

//   // create issue modal
//   const [createIssueOpen, setCreateIssueOpen] = useState(false);
//   const [issueForm, setIssueForm] = useState<any>({
//     project_id: undefined,
//     board_id: undefined,
//     column_id: undefined,
//     sprint_id: undefined,
//     title: '',
//     description: '',
//     type: 'story',
//     status: 'to do',
//     assignee: '',
//     reporter: '',
//     team: '',
//     labels: '',
//     priority: 'medium',
//     attachments: [] as string[],
//   });
//   const [sprints, setSprints] = useState<any[]>([]);
//   const [formErrors, setFormErrors] = useState<Record<string,string>>({});

//   // initial load: get projects, boards
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE}/projects`);
//         const projs: Project[] = await res.json();
//         setProjects(projs || []);
//         // set default current project if any
//         if (projs && projs.length > 0) {
//           setCurrentProject(projs[0]);
//         }
//         // boards
//         const br = await fetch(`${API_BASE}/boards`);
//         const boardsData: Board[] = await br.json();
//         setBoards(boardsData || []);
//       } catch (e) {
//         // eslint-disable-next-line no-console
//         console.error('Load error', e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // whenever currentProject changes, pick its board (or create one)
//   useEffect(() => {
//     if (!currentProject) return;
//     // find a board for this project
//     const b = boards.find(x => x.project_id === currentProject.id);
//     if (b) {
//       setCurrentBoard(b);
//     } else {
//       // create a board automatically
//       (async () => {
//         try {
//           const res = await fetch(`${API_BASE}/boards`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name: `${currentProject.name} Board`, project_id: currentProject.id }),
//           });
//           const nb: Board = await res.json();
//           setBoards(prev => [...prev, nb]);
//           setCurrentBoard(nb);
//         } catch (err) {
//           // eslint-disable-next-line no-console
//           console.error('Create board failed', err);
//         }
//       })();
//     }
//   }, [currentProject, boards]);

//   // load columns & issues when currentBoard changes
//   useEffect(() => {
//     if (!currentBoard) return;
//     const loadBoard = async () => {
//       try {
//         const cRes = await fetch(`${API_BASE}/boards/${currentBoard.id}/columns`);
//         const cols = await cRes.json();
//         setColumns(cols || []);
//       } catch (e) {
//         // columns endpoint returns 404 if no columns; fallback to empty
//         setColumns([]);
//       }
//       try {
//         const iRes = await fetch(`${API_BASE}/boards/${currentBoard.id}/issues`);
//         const iss = await iRes.json();
//         setIssues(iss || []);
//       } catch (e) {
//         setIssues([]);
//       }
//       // sprints for the project
//       try {
//         const spRes = await fetch(`${API_BASE}/projects/${currentBoard.project_id}/sprints`);
//         const sp = await spRes.json();
//         setSprints(sp || []);
//       } catch (e) {
//         setSprints([]);
//       }
//     };
//     loadBoard();
//   }, [currentBoard]);

//   // Derived: grouped columns -> issues
//   const issuesByColumn = useMemo(() => {
//     const map: Record<number, Issue[]> = {};
//     columns.forEach(c => (map[c.id] = []));
//     (issues || []).forEach(i => {
//       if (i.column_id && map[i.column_id]) {
//         map[i.column_id].push(i);
//       } else {
//         // if column missing, push to first column
//         const first = columns[0];
//         if (first) {
//           map[first.id].push(i);
//         }
//       }
//     });
//     // apply search filter
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       Object.keys(map).forEach(k => {
//         map[+k] = map[+k].filter(it => {
//           return (
//             (it.title || '').toLowerCase().includes(q) ||
//             (it.description || '').toLowerCase().includes(q) ||
//             (it.assignee || '').toLowerCase().includes(q) ||
//             (it.reporter || '').toLowerCase().includes(q) ||
//             (it.labels || []).join(' ').toLowerCase().includes(q)
//           );
//         });
//       });
//     }
//     return map;
//   }, [columns, issues, searchQuery]);

//   // Open Create Project main modal
//   const openCreateProject = () => {
//     setSelectedTemplate(null);
//     setProjectForm({ name: '', key: '' });
//     setCreateProjectOpen(true);
//     setProjectFormOpen(false);
//   };

//   // After picking template proceed to form
//   const onPickTemplate = (t: TemplateId) => {
//     setSelectedTemplate(t);
//     // show form tab
//     setProjectFormOpen(true);
//   };

//   // submit project form
//   const submitProject = async () => {
//     if (!selectedTemplate) return;
//     if (!projectForm.name || !projectForm.key) return;
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/projects`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: projectForm.name,
//           key: projectForm.key,
//           template: selectedTemplate,
//         }),
//       });
//       const proj: Project = await res.json();
//       // update list
//       setProjects(prev => [proj, ...prev]);
//       setCreateProjectOpen(false);
//       setProjectFormOpen(false);
//       setSelectedTemplate(null);
//       // set current project to newly created
//       setCurrentProject(proj);
//       // createBoard is handled by boards effect - but also create explicit board so we can open quickly
//       const bRes = await fetch(`${API_BASE}/boards`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: `${proj.name} Board`, project_id: proj.id }),
//       });
//       const nb: Board = await bRes.json();
//       setBoards(prev => [nb, ...prev]);
//       setCurrentBoard(nb);
//     } catch (e) {
//       // eslint-disable-next-line no-console
//       console.error('Create project failed', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // handle project selection from dropdown
//   const selectProject = (p: Project) => {
//     setCurrentProject(p);
//     // tab default to board
//     setActiveTab('board');
//   };

//   // Create issue: open modal
//   const openCreateIssue = () => {
//     if (!currentProject || !currentBoard) return;
//     setIssueForm({
//       project_id: currentProject.id,
//       board_id: currentBoard.id,
//       column_id: columns[0]?.id,
//       sprint_id: undefined,
//       title: '',
//       description: '',
//       type: currentProject.template === 'scrum' ? 'story' : 'story',
//       status: 'to do',
//       assignee: '',
//       reporter: '',
//       team: '',
//       labels: '',
//       priority: 'medium',
//       attachments: [],
//     });
//     setFormErrors({});
//     setCreateIssueOpen(true);
//   };

//   // issue form change
//   const setIssueField = (key: string, val: any) => {
//     setIssueForm((prev: any) => ({ ...prev, [key]: val }));
//   };

//   // validate issue form
//   const validateIssue = () => {
//     const errs: Record<string,string> = {};
//     if (!issueForm.title || !issueForm.title.trim()) errs.title = 'Summary is required';
//     if (!issueForm.project_id) errs.project_id = 'Project required';
//     // email checks
//     if (issueForm.assignee && !emailValid(issueForm.assignee)) errs.assignee = 'Invalid email';
//     if (issueForm.reporter && !emailValid(issueForm.reporter)) errs.reporter = 'Invalid email';
//     if (issueForm.team) {
//       const parts = issueForm.team.split(',').map((s:string)=>s.trim()).filter(Boolean);
//       for (const p of parts) {
//         if (!emailValid(p)) {
//           errs.team = 'One or more team emails are invalid (comma separated)';
//           break;
//         }
//       }
//     }
//     setFormErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // submit issue to backend
//   const submitIssue = async () => {
//     if (!validateIssue()) return;
//     try {
//       const payload: any = {
//         board_id: issueForm.board_id,
//         column_id: issueForm.column_id,
//         sprint_id: issueForm.sprint_id,
//         title: issueForm.title,
//         description: issueForm.description,
//         type: issueForm.type,
//         status: issueForm.status,
//         assignee: issueForm.assignee || undefined,
//         reporter: issueForm.reporter || undefined,
//         team: issueForm.team ? issueForm.team.split(',').map((s:string)=>s.trim()) : undefined,
//         labels: issueForm.labels ? issueForm.labels.split(',').map((s:string)=>s.trim()) : undefined,
//         priority: issueForm.priority,
//         attachment: issueForm.attachments && issueForm.attachments.length ? JSON.stringify(issueForm.attachments) : undefined,
//       };
//       const res = await fetch(`${API_BASE}/issues`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const created: Issue = await res.json();
//       // refresh issues list
//       const iRes = await fetch(`${API_BASE}/boards/${currentBoard!.id}/issues`);
//       const iss = await iRes.json();
//       setIssues(iss || []);
//       setCreateIssueOpen(false);
//     } catch (e) {
//       // eslint-disable-next-line no-console
//       console.error('Create issue failed', e);
//     }
//   };

//   // Drag and drop handler
//   const onDragEnd = async (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination || !currentBoard) return;
//     if (destination.droppableId === source.droppableId && destination.index === source.index) return;

//     const fromColId = Number(source.droppableId);
//     const toColId = Number(destination.droppableId);
//     const issueId = Number(draggableId);

//     // optimistic reorder locally
//     const newIssues = [...issues];
//     const moving = newIssues.find(i => i.id === issueId);
//     if (!moving) return;
//     moving.column_id = toColId;
//     // map status by column name
//     const toCol = columns.find(c => c.id === toColId);
//     if (toCol) {
//       moving.status = mapColumnNameToStatus(toCol.name);
//     }
//     setIssues(newIssues);

//     // persist
//     try {
//       await fetch(`${API_BASE}/issues/${issueId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ column_id: toColId, status: moving.status }),
//       });
//     } catch (e) {
//       // eslint-disable-next-line no-console
//       console.error('Failed to update issue position', e);
//     }
//   };

//   if (loading) {
//     return <Progress />;
//   }

//   return (
//     <Page themeId="home">
//       <Header title="Final Project - Kanban / Scrum" subtitle="Manage projects like Jira">
//         <SupportButton>Manage your final project board</SupportButton>
//       </Header>
//       <Content>
//         <Grid container spacing={2} style={{ marginBottom: 16, alignItems: 'center' }}>
//           <Grid item>
//             <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreateProject}>
//               Create Project
//             </Button>
//           </Grid>
//           <Grid item>
//             <FormControl variant="outlined" size="small">
//               <InputLabel id="my-projects-label">My Projects</InputLabel>
//               <Select
//                 labelId="my-projects-label"
//                 value={currentProject ? currentProject.id : ''}
//                 onChange={e => {
//                   const pid = Number(e.target.value);
//                   const p = projects.find(x => x.id === pid);
//                   if (p) selectProject(p);
//                 }}
//                 label="My Projects"
//                 style={{ minWidth: 240 }}
//               >
//                 {projects.map(p => (
//                   <MenuItem value={p.id} key={p.id}>
//                     {p.name} ({p.key}) — {p.template}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item style={{ marginLeft: 'auto' }}>
//             <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search this board..."
//               InputProps={{
//                 startAdornment: <SearchIcon style={{ marginRight: 8 }} />,
//               }}
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//             />
//           </Grid>
//         </Grid>

//         {/* Main area */}
//         {!currentProject && (
//           <InfoCard title="No projects yet">
//             Create a project to get started (Kanban or Scrum).
//           </InfoCard>
//         )}

//         {currentProject && (
//           <>
//             <Card variant="outlined" style={{ marginBottom: 12 }}>
//               <CardContent>
//                 <Grid container alignItems="center" spacing={2}>
//                   <Grid item xs>
//                     <Typography variant="h6">{currentProject.name}</Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Template: {currentProject.template.toUpperCase()}
//                     </Typography>
//                   </Grid>

//                   <Grid item>
//                     <Button variant={activeTab === 'summary' ? 'contained' : 'text'} onClick={() => setActiveTab('summary')}>
//                       Summary
//                     </Button>
//                     <Button variant={activeTab === 'timeline' ? 'contained' : 'text'} onClick={() => setActiveTab('timeline')}>
//                       Timeline
//                     </Button>
//                     {currentProject.template === 'scrum' && (
//                       <Button variant={activeTab === 'backlog' ? 'contained' : 'text'} onClick={() => setActiveTab('backlog')}>
//                         Backlog
//                       </Button>
//                     )}
//                     <Button variant={activeTab === 'board' ? 'contained' : 'text'} onClick={() => setActiveTab('board')}>
//                       Board
//                     </Button>
//                     <Button variant={activeTab === 'calendar' ? 'contained' : 'text'} onClick={() => setActiveTab('calendar')}>
//                       Calendar
//                     </Button>
//                     <Button variant={activeTab === 'list' ? 'contained' : 'text'} onClick={() => setActiveTab('list')}>
//                       List
//                     </Button>
//                     <Button variant={activeTab === 'allwork' ? 'contained' : 'text'} onClick={() => setActiveTab('allwork')}>
//                       All work
//                     </Button>
//                   </Grid>

//                   <Grid item>
//                     <Button variant="outlined" color="primary" onClick={openCreateIssue}>
//                       Create Issue
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Tabs content simplified: show board view primary */}
//             {activeTab === 'board' && (
//               <div>
//                 <DragDropContext onDragEnd={onDragEnd}>
//                   <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//                     {columns.map(column => (
//                       <Droppable droppableId={`${column.id}`} key={column.id}>
//                         {(provided, snapshot) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             style={{
//                               minWidth: 280,
//                               background: '#f4f5f7',
//                               padding: 8,
//                               borderRadius: 6,
//                               minHeight: 200,
//                             }}
//                           >
//                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                               <Typography variant="subtitle1">{column.name}</Typography>
//                               <Chip label={issuesByColumn[column.id] ? issuesByColumn[column.id].length : 0} size="small" />
//                             </div>

//                             {(issuesByColumn[column.id] || []).map((issue, idx) => (
//                               <Draggable draggableId={`${issue.id}`} index={idx} key={issue.id}>
//                                 {(prov) => (
//                                   <div
//                                     ref={prov.innerRef}
//                                     {...prov.draggableProps}
//                                     {...prov.dragHandleProps}
//                                     style={{
//                                       padding: 8,
//                                       marginBottom: 8,
//                                       background: '#fff',
//                                       borderRadius: 4,
//                                       boxShadow: '0 1px 0 rgba(9,30,66,.25)',
//                                       ...prov.draggableProps.style,
//                                     }}
//                                   >
//                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                       <div>
//                                         <Typography variant="body1">{issue.title}</Typography>
//                                         <Typography variant="caption" color="textSecondary">
//                                           {issue.type} · {issue.priority}
//                                         </Typography>
//                                       </div>
//                                       <div>
//                                         {issue.assignee && <Chip label={issue.assignee.split('@')[0]} size="small" />}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))}

//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     ))}
//                   </div>
//                 </DragDropContext>
//               </div>
//             )}

//             {activeTab === 'summary' && (
//               <InfoCard title="Summary">
//                 <Typography>Project summary would be shown here (use /reports/projects/:id/summary).</Typography>
//               </InfoCard>
//             )}

//             {activeTab === 'timeline' && (
//               <InfoCard title="Timeline">
//                 <Typography>Timeline placeholder — you can implement timeline/timeline chart later.</Typography>
//               </InfoCard>
//             )}

//             {activeTab === 'backlog' && (
//               <InfoCard title="Backlog">
//                 <Typography>Your backlog (scrum only). You can manage sprints here.</Typography>
//               </InfoCard>
//             )}

//             {activeTab === 'calendar' && (
//               <InfoCard title="Calendar">
//                 <Typography>Calendar view placeholder (you have FullCalendar in dependencies — integrate events from issues' start/due dates).</Typography>
//               </InfoCard>
//             )}

//             {activeTab === 'list' && (
//               <InfoCard title="List view">
//                 <Typography>List view: tasks with filters/search. (You can extend with table or grid.)</Typography>
//               </InfoCard>
//             )}

//             {activeTab === 'allwork' && (
//               <InfoCard title="All work">
//                 <Typography>All Work view: cross-board list, filters by assignee, priority, status.</Typography>
//               </InfoCard>
//             )}
//           </>
//         )}

//         {/* Create Project modal */}
//         <Dialog open={createProjectOpen} onClose={() => setCreateProjectOpen(false)} maxWidth="md" fullWidth>
//           <DialogTitle>Create Project</DialogTitle>
//           <DialogContent>
//             {!projectFormOpen && (
//               <>
//                 <Typography variant="subtitle1">Choose a template</Typography>
//                 <Grid container spacing={2} style={{ marginTop: 8 }}>
//                   {templates.map(t => (
//                     <Grid item xs={12} md={6} key={t.id}>
//                       <Card variant="outlined">
//                         <CardActionArea onClick={() => onPickTemplate(t.id as TemplateId)}>
//                           <CardContent>
//                             <Typography variant="h6">{t.name}</Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               {t.description}
//                             </Typography>
//                           </CardContent>
//                         </CardActionArea>
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </>
//             )}

//             {projectFormOpen && (
//               <>
//                 <Typography variant="subtitle1">New Project - {selectedTemplate}</Typography>
//                 <Grid container spacing={2} style={{ marginTop: 8 }}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Project name"
//                       fullWidth
//                       value={projectForm.name}
//                       onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       label="Key (unique)"
//                       fullWidth
//                       value={projectForm.key}
//                       onChange={(e) => setProjectForm(prev => ({ ...prev, key: e.target.value }))}
//                     />
//                     <FormHelperText>Short key used to identify the project (must be unique).</FormHelperText>
//                   </Grid>
//                 </Grid>
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => { setCreateProjectOpen(false); setProjectFormOpen(false); setSelectedTemplate(null); }}>
//               Cancel
//             </Button>
//             {projectFormOpen ? (
//               <Button color="primary" variant="contained" onClick={submitProject}>
//                 Create Project
//               </Button>
//             ) : (
//               <Button onClick={() => setCreateProjectOpen(false)}>Close</Button>
//             )}
//           </DialogActions>
//         </Dialog>

//         {/* Create Issue modal */}
//         <Dialog open={createIssueOpen} onClose={() => setCreateIssueOpen(false)} maxWidth="md" fullWidth>
//           <DialogTitle>Create</DialogTitle>
//           <DialogContent>
//             <Typography variant="caption" color="textSecondary">Required fields are marked with an asterisk *</Typography>
//             <Grid container spacing={2} style={{ marginTop: 8 }}>
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Project *</InputLabel>
//                   <Select
//                     value={issueForm.project_id || (currentProject ? currentProject.id : '')}
//                     onChange={(e) => {
//                       const pid = Number(e.target.value);
//                       const p = projects.find(x => x.id === pid);
//                       setIssueField('project_id', pid);
//                       // update board/project if they choose another
//                       if (p) setCurrentProject(p);
//                       // find a board for that project
//                       const b = boards.find(x => x.project_id === pid);
//                       if (b) {
//                         setCurrentBoard(b);
//                         setIssueField('board_id', b.id);
//                       }
//                     }}
//                   >
//                     {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name} ({p.key})</MenuItem>)}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Work type *</InputLabel>
//                   <Select
//                     value={issueForm.type}
//                     onChange={(e) => setIssueField('type', e.target.value)}
//                   >
//                     <MenuItem value="story">Story</MenuItem>
//                     <MenuItem value="task">Task</MenuItem>
//                     <MenuItem value="bug">Bug</MenuItem>
//                     <MenuItem value="epic">Epic</MenuItem>
//                     {currentProject?.template !== 'scrum' && <MenuItem value="feature">Feature</MenuItem>}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Status</InputLabel>
//                   <Select
//                     value={issueForm.status}
//                     onChange={(e) => setIssueField('status', e.target.value)}
//                   >
//                     <MenuItem value="to do">To Do</MenuItem>
//                     <MenuItem value="in progress">In Progress</MenuItem>
//                     <MenuItem value="testing">Testing</MenuItem>
//                     <MenuItem value="done">Done</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={8}>
//                 <TextField
//                   label="Summary *"
//                   fullWidth
//                   value={issueForm.title}
//                   onChange={(e) => setIssueField('title', e.target.value)}
//                   error={!!formErrors.title}
//                   helperText={formErrors.title}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Description"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   value={issueForm.description}
//                   onChange={(e) => setIssueField('description', e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <FormControl fullWidth>
//                   <InputLabel>Priority</InputLabel>
//                   <Select value={issueForm.priority} onChange={(e)=>setIssueField('priority', e.target.value)}>
//                     <MenuItem value="high">High</MenuItem>
//                     <MenuItem value="medium">Medium</MenuItem>
//                     <MenuItem value="low">Low</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Assignee (email)"
//                   fullWidth
//                   value={issueForm.assignee}
//                   onChange={(e)=>setIssueField('assignee', e.target.value)}
//                   error={!!formErrors.assignee}
//                   helperText={formErrors.assignee}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Reporter (email)"
//                   fullWidth
//                   value={issueForm.reporter}
//                   onChange={(e)=>setIssueField('reporter', e.target.value)}
//                   error={!!formErrors.reporter}
//                   helperText={formErrors.reporter}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Team (comma separated emails)"
//                   fullWidth
//                   value={issueForm.team}
//                   onChange={(e)=>setIssueField('team', e.target.value)}
//                   error={!!formErrors.team}
//                   helperText={formErrors.team}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Labels (comma separated)"
//                   fullWidth
//                   value={issueForm.labels}
//                   onChange={(e)=>setIssueField('labels', e.target.value)}
//                 />
//               </Grid>

//               {currentProject?.template === 'scrum' && (
//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth>
//                     <InputLabel>Sprint</InputLabel>
//                     <Select value={issueForm.sprint_id || ''} onChange={(e)=>setIssueField('sprint_id', e.target.value)}>
//                       <MenuItem value="">(none)</MenuItem>
//                       {sprints.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               )}

//               <Grid item xs={12}>
//                 <input
//                   id="attachments"
//                   type="file"
//                   multiple
//                   onChange={(e: any) => {
//                     const files = Array.from(e.target.files as File[] || []).map((f: File) => f.name);
//                     setIssueField('attachments', files);
//                   }}
//                 />
//                 <FormHelperText>Files will be stored as filenames in attachments (backend upload not implemented here).</FormHelperText>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setCreateIssueOpen(false)}>Cancel</Button>
//             <Button color="primary" variant="contained" onClick={submitIssue}>Create</Button>
//           </DialogActions>
//         </Dialog>
//       </Content>
//     </Page>
//   );
// };

// export default ExampleComponent;

// ExampleComponent.tsx
// import React, { useEffect, useMemo, useState, ChangeEvent } from 'react';
// import {
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Tabs,
//   Tab,
//   MenuItem,
//   IconButton,
//   Chip,
//   Divider,
//   Paper,
//   Toolbar,
//   InputAdornment,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Checkbox,
//   Avatar,
//   ListItemText,
//   ListItem,
//   List,
//   Snackbar,
// } from '@material-ui/core';
// import Add from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import SearchIcon from '@material-ui/icons/Search';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import ViewModuleIcon from '@material-ui/icons/ViewModule';
// import { Header, Page, Content, ContentHeader, HeaderLabel, SupportButton } from '@backstage/core-components';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { EventClickArg } from '@fullcalendar/core';
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
// import { differenceInDays } from 'date-fns';
// import { Alert } from '@material-ui/lab';

// /** ---------- API BASE ---------- */
// const API_BASE = '/api/final-project';

// /** ---------- Types ---------- */
// type UserRef = { name: string; email?: string };
// type PersonOrString = UserRef | string | null;
// type TeamField = UserRef[] | string | null;

// type Issue = {
//   id: number | string;
//   title: string;
//   description?: string;
//   type: string;
//   assignee: PersonOrString;
//   reporter: PersonOrString;
//   team: TeamField;
//   parentId: number | null;
//   start_date?: string;
//   due_date?: string;
//   created_at: string;
//   updated_at: string;
//   priority?: string | null;
//   status?: string;
//   labels?: string;
//   attachmentUrl?: string | null;
//   storyPoints?: number | null;
//   sprint?: string | null;
//   board_id?: number | null;
//   column_id?: number | null;
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
//   return (first + (second || '')).slice(0, 2) || '?';
// }
// function formatDate(dateString?: string | null | undefined): string {
//   if (!dateString) return 'N/A';
//   const d = new Date(dateString);
//   if (isNaN(d.getTime())) return 'Invalid Date';
//   return d.toLocaleDateString();
// }
// function parsePersonField(v: any): PersonOrString {
//   if (v === null || v === undefined) return null;
//   if (typeof v === 'object') return v as UserRef;
//   if (typeof v === 'string') {
//     try {
//       const p = JSON.parse(v);
//       if (p && typeof p === 'object') return p as UserRef;
//     } catch {
//       // not JSON
//     }
//     return v;
//   }
//   return null;
// }
// function parseTeamField(v: any): UserRef[] {
//   if (v === null || v === undefined) return [];
//   if (Array.isArray(v)) {
//     return v.map(item =>
//       typeof item === 'string'
//         ? emailRegex.test(item)
//           ? { name: nameFromEmail(item), email: item }
//           : { name: item }
//         : (item as UserRef),
//     );
//   }
//   if (typeof v === 'object') return [v as UserRef];
//   if (typeof v === 'string') {
//     try {
//       const parsed = JSON.parse(v);
//       if (Array.isArray(parsed)) return parsed as UserRef[];
//       if (parsed && typeof parsed === 'object') return [parsed as UserRef];
//     } catch {
//       const parts = v
//         .split(',')
//         .map((s: string) => s.trim())
//         .filter(Boolean);
//       if (parts.length > 1) {
//         return parts.map(p =>
//           emailRegex.test(p) ? { name: nameFromEmail(p), email: p } : { name: p },
//         );
//       }
//       if (emailRegex.test(v)) return [{ name: nameFromEmail(v), email: v }];
//       return [{ name: v }];
//     }
//   }
//   return [];
// }

// /** ---------- Constants ---------- */
// const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
// const statusesList = [
//   { value: 'TODO', label: 'To Do' },
//   { value: 'IN_PROGRESS', label: 'In Progress' },
//   { value: 'TESTING', label: 'Testing' },
//   { value: 'DONE', label: 'Done' },
// ];
// const priorities = ['LOW', 'MEDIUM', 'HIGH'];
// const COLORS = ['#FF8042', '#0088FE', '#FFBB28', '#00C49F'];
// const PRIORITY_COLORS: Record<string, string> = {
//   HIGH: '#ff4d4f',
//   MEDIUM: '#faad14',
//   LOW: '#52c41a',
// };
// const TYPE_COLORS: Record<string, string> = {
//   Epic: '#8e44ad',
//   Feature: '#2980b9',
//   Task: '#27ae60',
//   Story: '#f1c40f',
//   Bug: '#e67e22',
// };

// /** ---------- Utility: status normalization & mapping ---------- */
// function normalizeStatus(status?: string | null): string {
//   if (!status) return 'TODO';
//   const s = String(status).toLowerCase().trim();
//   if (s === 'to do' || s === 'todo' || s === 'to_do' || s === 'to-do') return 'TODO';
//   if (s === 'in progress' || s === 'in_progress' || s === 'inprogress' || s === 'in-progress') return 'IN_PROGRESS';
//   if (s === 'testing') return 'TESTING';
//   if (s === 'done' || s === 'closed' || s === 'finished') return 'DONE';
//   if (s.includes('progress')) return 'IN_PROGRESS';
//   if (s.includes('done') || s.includes('closed')) return 'DONE';
//   if (s.includes('test')) return 'TESTING';
//   return 'TODO';
// }
// function normalizedToDbStatus(normalized: string): string {
//   switch (normalized) {
//     case 'TODO':
//       return 'to do';
//     case 'IN_PROGRESS':
//       return 'in progress';
//     case 'TESTING':
//       return 'testing';
//     case 'DONE':
//       return 'done';
//     default:
//       return normalized.toLowerCase();
//   }
// }

// /** ---------- Component ---------- */
// export const ExampleComponent = () => {
//   const [selectedTemplate, setSelectedTemplate] = useState<null | 'scrum' | 'kanban'>(null);
//   const [showTemplateDialog, setShowTemplateDialog] = useState(false);
//   const [showTemplateSelection, setShowTemplateSelection] = useState(false);
//   const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
//   const [projectName, setProjectName] = useState('');
//   const [projectKey, setProjectKey] = useState('');
//   const [createdProject, setCreatedProject] = useState<{
//     id?: number;
//     name: string;
//     type: 'scrum' | 'kanban';
//   } | null>(null);

//   const [tab, setTab] = useState<
//     | 'summary'
//     | 'board'
//     | 'list'
//     | 'calendar'
//     | 'timeline'
//     | 'allwork'
//     | 'backlog'
//   >('summary');

//   const [showCreateIssueDialog, setShowCreateIssueDialog] = useState(false);
//   const [editingIssueId, setEditingIssueId] = useState<number | string | null>(null);
//   const [issueData, setIssueData] = useState({
//     project: '',
//     workType: '',
//     status: 'TODO',
//     summary: '',
//     description: '',
//     assignee: '',
//     reporter: '',
//     team: [] as string[],
//     startDate: '',
//     dueDate: '',
//     priority: '',
//     sprint: '',
//     storyPoints: '',
//     labels: '',
//     attachment: null as File | null,
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupBy, setGroupBy] = useState<
//     'None' | 'status' | 'assignee' | 'reporter' | 'team' | 'priority' | 'type'
//   >('None');
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     assignee: '',
//     reporter: '',
//     status: [] as string[],
//     priority: '',
//     workType: [] as string[],
//     dueDateStart: '',
//     dueDateEnd: '',
//     labels: '',
//   });

//   const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
//   const [projectsList, setProjectsList] = useState<Array<any>>([]);
//   const [boardsList, setBoardsList] = useState<Array<any>>([]);
//   const [columnsMap, setColumnsMap] = useState<Record<string, any[]>>({});
//   const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

//   const [backlogSprint, setBacklogSprint] = useState<Issue[]>([]);
//   const [backlogList, setBacklogList] = useState<Issue[]>([]);
//   const [showBacklogForm, setShowBacklogForm] = useState(false);
//   const [newBacklogItem, setNewBacklogItem] = useState({
//     workType: 'Story',
//     title: '',
//     dueDate: '',
//     assignee: '',
//   });
//   const [scrumCounter, setScrumCounter] = useState(1);

//   const [summary, setSummary] = useState<IssueSummary | null>(null);

//   const workTypesScrum = ['Story', 'Task', 'Bug', 'Epic'];
//   const workTypesKanban = ['Story', 'Task', 'Bug', 'Epic', 'Feature'];
//   const sprints = ['Sprint 1', 'Sprint 2'];

//   /** ---------- Snackbar ---------- */
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
//     open: false,
//     message: '',
//     severity: 'info',
//   });
//   const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
//     setSnackbar({ open: true, message, severity });
//   };
//   const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

//   const now = new Date();
//   const last7Days = createdIssues.filter(i => differenceInDays(now, new Date(i.created_at)) <= 7);
//   const updated7Days = createdIssues.filter(i => differenceInDays(now, new Date(i.updated_at)) <= 7);
//   const completed7Days = createdIssues.filter(i => normalizeStatus(i.status) === 'DONE' && differenceInDays(now, new Date(i.updated_at)) <= 7);
//   const dueSoon = createdIssues.filter(i => i.due_date && (() => { const diff = differenceInDays(new Date(i.due_date as string), now); return diff >= 0 && diff <= 7; })());

//   const statusCounts = statusesList.map(s => ({ name: s.label, value: createdIssues.filter(i => normalizeStatus(i.status) === s.value).length }));
//   const typeChartData = issueTypes.map(t => ({ type: t, count: createdIssues.filter(i => i.type === t).length }));
//   const priorityChartData = ['HIGH', 'MEDIUM', 'LOW'].map(p => ({ priority: p, count: createdIssues.filter(i => String(i.priority).toUpperCase() === p).length }));

//   /** ---------- API helpers ---------- */
//   async function loadProjects() {
//     try {
//       const res = await fetch(${API_BASE}/projects);
//       if (!res.ok) {
//         showSnackbar(Failed to load projects (${res.status}), 'error');
//         return;
//       }
//       const json = await res.json();
//       setProjectsList(json);
//       if (!createdProject && json.length > 0) {
//         const p = json[0];
//         setCreatedProject({ id: p.id, name: p.name, type: p.template });
//       }
//     } catch (err) {
//       showSnackbar('Error loading projects', 'error');
//     }
//   }

//   async function createProjectApi(name: string, key: string, template: 'kanban' | 'scrum') {
//     try {
//       const res = await fetch(${API_BASE}/projects, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, key, template }),
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         showSnackbar(Create project failed (${res.status}) ${text}, 'error');
//         return;
//       }
//       const project = await res.json();
//       setCreatedProject({ id: project.id, name: project.name, type: project.template });
//       await loadProjects();

//       // create board for project
//       try {
//         const boardRes = await fetch(${API_BASE}/boards, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: ${project.name} Board, project_id: project.id }),
//         });
//         if (boardRes.ok) {
//           const board = await boardRes.json();
//           await loadBoards();
//           await loadColumns(board.id);
//           setSelectedBoardId(board.id);
//           await loadIssuesForBoard(board.id);
//           showSnackbar('Project and board created', 'success');
//         } else {
//           await loadBoards();
//         }
//       } catch (err) {
//         showSnackbar('Board creation error', 'warning');
//       }
//     } catch (err) {
//       showSnackbar('Error creating project', 'error');
//     }
//   }

//   async function loadBoards() {
//     try {
//       const res = await fetch(${API_BASE}/boards);
//       if (!res.ok) {
//         showSnackbar(Failed to load boards (${res.status}), 'error');
//         return;
//       }
//       const json = await res.json();
//       setBoardsList(json);
//       if (!selectedBoardId && json.length > 0) {
//         const defaultBoard = json[0];
//         setSelectedBoardId(defaultBoard.id);
//         await loadColumns(defaultBoard.id);
//         await loadIssuesForBoard(defaultBoard.id);
//       }
//     } catch (err) {
//       showSnackbar('Error loading boards', 'error');
//     }
//   }

//   async function loadColumns(boardId: number) {
//     try {
//       const res = await fetch(${API_BASE}/boards/${boardId}/columns);
//       if (!res.ok) {
//         if (res.status === 404) {
//           // no columns yet
//           setColumnsMap(prev => ({ ...prev, [String(boardId)]: [] }));
//           return;
//         }
//         showSnackbar(Failed to load columns for board ${boardId} (${res.status}), 'error');
//         return;
//       }
//       const cols = await res.json();
//       setColumnsMap(prev => ({ ...prev, [String(boardId)]: cols }));
//     } catch (err) {
//       showSnackbar('Error loading columns', 'error');
//     }
//   }

//   function parseIssueFromServer(raw: any): Issue {
//     return {
//       id: raw.id,
//       title: raw.title,
//       description: raw.description,
//       type: raw.type ? (String(raw.type).charAt(0).toUpperCase() + String(raw.type).slice(1)) : 'Task',
//       assignee: parsePersonField(raw.assignee),
//       reporter: parsePersonField(raw.reporter),
//       team: parseTeamField(raw.team),
//       parentId: raw.parent_id ?? null,
//       start_date: raw.start_date ?? '',
//       due_date: raw.due_date ?? '',
//       created_at: raw.created_at ?? new Date().toISOString(),
//       updated_at: raw.updated_at ?? new Date().toISOString(),
//       priority: raw.priority ? String(raw.priority).toUpperCase() : '',
//       status: normalizeStatus(raw.status),
//       labels: Array.isArray(raw.labels) ? raw.labels.join(', ') : (typeof raw.labels === 'string' ? raw.labels : ''),
//       attachmentUrl: raw.attachments ? JSON.stringify(raw.attachments) : null,
//       storyPoints: raw.story_points ?? raw.storyPoints ?? null,
//       sprint: raw.sprint_id ? Sprint-${raw.sprint_id} : raw.sprint ?? null,
//       board_id: raw.board_id ?? null,
//       column_id: raw.column_id ?? null,
//     };
//   }

//   async function loadIssuesForBoard(boardId: number) {
//     try {
//       const res = await fetch(${API_BASE}/boards/${boardId}/issues);
//       if (res.ok) {
//         const rows = await res.json();
//         const parsed = rows.map((r: any) => parseIssueFromServer(r));
//         setCreatedIssues(parsed);
//         setBacklogList(parsed.filter((i: Issue) => !i.sprint));
//         setBacklogSprint(parsed.filter((i: Issue) => !!i.sprint));
//       } else {
//         await loadAllIssuesFallback();
//       }
//     } catch (err) {
//       await loadAllIssuesFallback();
//       showSnackbar('Error loading issues for board', 'error');
//     }
//   }

//   async function loadAllIssuesFallback() {
//     try {
//       const res = await fetch(${API_BASE}/issues);
//       if (!res.ok) {
//         const collected: Issue[] = [];
//         for (const b of boardsList) {
//           try {
//             const r = await fetch(${API_BASE}/boards/${b.id}/issues);
//             if (r.ok) {
//               const rows = await r.json();
//               rows.forEach((rr: any) => collected.push(parseIssueFromServer(rr)));
//             }
//           } catch {
//             // ignore
//           }
//         }
//         setCreatedIssues(collected);
//         setBacklogList(collected.filter(i => !i.sprint));
//         setBacklogSprint(collected.filter(i => !!i.sprint));
//         return;
//       }
//       const json = await res.json();
//       const parsed = json.map((r: any) => parseIssueFromServer(r));
//       setCreatedIssues(parsed);
//       setBacklogList(parsed.filter((i: Issue) => !i.sprint));
//       setBacklogSprint(parsed.filter((i: Issue) => !!i.sprint));
//     } catch (err) {
//       showSnackbar('Error loading all issues', 'error');
//     }
//   }

//   async function createIssueApi(data: typeof issueData) {
//     try {
//       let boardId = selectedBoardId;
//       if (!boardId && createdProject?.id) {
//         const b = boardsList.find(bb => bb.project_id === createdProject.id);
//         if (b) boardId = b.id;
//       }
//       if (!boardId) {
//         showSnackbar('No board selected or available. Create a board first.', 'warning');
//         return;
//       }
//       const normalized = normalizeStatus(data.status);
//       const columnId = findColumnIdForStatus(boardId, normalized);

//       const payload: any = {
//         board_id: boardId,
//         column_id: columnId,
//         title: data.summary,
//         description: data.description,
//         type: String(data.workType || 'task').toLowerCase(),
//         status: normalizedToDbStatus(normalized),
//         assignee: data.assignee || null,
//         reporter: data.reporter || null,
//         team: data.team && data.team.length > 0 ? data.team : null,
//         labels: data.labels ? data.labels.split(',').map(s => s.trim()).filter(Boolean) : null,
//         priority: data.priority ? String(data.priority).toLowerCase() : null,
//         start_date: data.startDate || null,
//         due_date: data.dueDate || null,
//         attachment: data.attachment ? { filename: data.attachment.name } : null,
//       };

//       const res = await fetch(${API_BASE}/issues, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text();
//         showSnackbar(Create issue failed (${res.status}) ${txt}, 'error');
//         return;
//       }
//       const created = await res.json();
//       const parsed = parseIssueFromServer(created);
//       if (boardId) {
//         await loadIssuesForBoard(boardId);
//       } else {
//         await loadAllIssuesFallback();
//       }
//       showSnackbar('Issue created', 'success');
//       return parsed;
//     } catch (err) {
//       showSnackbar('Error creating issue', 'error');
//     }
//   }

//   async function updateIssueApi(payloadInput: { id: number | string; [k: string]: any }) {
//     try {
//       const { id, ...updates } = payloadInput;
//       let finalUpdates: any = { ...updates };
//       if (updates.status) {
//         const normalized = normalizeStatus(updates.status);
//         finalUpdates.status = normalizedToDbStatus(normalized);
//         const issue = createdIssues.find(i => String(i.id) === String(id));
//         const boardId = issue?.board_id ?? selectedBoardId;
//         if (boardId) {
//           const colId = findColumnIdForStatus(boardId, normalized);
//           if (colId) finalUpdates.column_id = colId;
//         }
//       }
//       if (finalUpdates.type) finalUpdates.type = String(finalUpdates.type).toLowerCase();
//       if (finalUpdates.priority) finalUpdates.priority = String(finalUpdates.priority).toLowerCase();

//       const res = await fetch(${API_BASE}/issues/${id}, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(finalUpdates),
//       });
//       if (!res.ok) {
//         const txt = await res.text();
//         showSnackbar(Update issue failed (${res.status}) ${txt}, 'error');
//         return;
//       }
//       const updated = await res.json();
//       const parsed = parseIssueFromServer(updated);
//       if (parsed.board_id) {
//         await loadIssuesForBoard(parsed.board_id);
//       } else if (selectedBoardId) {
//         await loadIssuesForBoard(selectedBoardId);
//       } else {
//         await loadAllIssuesFallback();
//       }
//       showSnackbar('Issue updated', 'success');
//       return parsed;
//     } catch (err) {
//       showSnackbar('Error updating issue', 'error');
//     }
//   }

//   async function deleteIssueApi(id: number | string) {
//     try {
//       const res = await fetch(${API_BASE}/issues/${id}, { method: 'DELETE' });
//       if (!res.ok) {
//         showSnackbar(Delete failed (${res.status}), 'error');
//         return;
//       }
//       if (selectedBoardId) await loadIssuesForBoard(selectedBoardId);
//       else await loadAllIssuesFallback();
//       showSnackbar('Issue deleted', 'success');
//     } catch (err) {
//       showSnackbar('Error deleting issue', 'error');
//     }
//   }

//   function findColumnIdForStatus(boardId: number | string, normalizedStatus: string) {
//     const cols = columnsMap[String(boardId)] || [];
//     const tryNames = [
//       normalizedStatus,
//       normalizedStatus.replace('_', ' '),
//       normalizedStatus.replace('_', ' ').toUpperCase(),
//       normalizedStatus.toUpperCase(),
//     ];
//     for (const c of cols) {
//       const name = String(c.name || '').toUpperCase().trim();
//       const normalizedName = name.replace(/\s+/g, '_');
//       if (tryNames.includes(name) || tryNames.includes(normalizedName) || tryNames.includes(String(c.name))) {
//         return c.id;
//       }
//     }
//     return cols.length ? cols[0].id : null;
//   }

//   async function fetchProjectSummary(projectId: number) {
//     try {
//       const res = await fetch(${API_BASE}/reports/projects/${projectId}/summary);
//       if (!res.ok) {
//         showSnackbar(Failed to fetch project summary (${res.status}), 'warning');
//         return null;
//       }
//       return await res.json();
//     } catch (err) {
//       showSnackbar('Error fetching project summary', 'error');
//       return null;
//     }
//   }

//   /** ---------- Create / Edit / Delete UI handlers ---------- */
//   const resetIssueForm = () => {
//     setEditingIssueId(null);
//     setIssueData({
//       project: createdProject?.name || '',
//       workType: '',
//       status: 'TODO',
//       summary: '',
//       description: '',
//       assignee: '',
//       reporter: '',
//       team: [],
//       startDate: '',
//       dueDate: '',
//       priority: '',
//       sprint: '',
//       storyPoints: '',
//       labels: '',
//       attachment: null,
//     });
//   };

//   const handleTemplateSelect = (type: 'scrum' | 'kanban') => {
//     setSelectedTemplate(type);
//     setShowTemplateDialog(true);
//   };
//   const handleUseTemplate = () => {
//     setShowTemplateDialog(false);
//     setShowCreateProjectDialog(true);
//   };

//   const handleCreateProject = async () => {
//     if (projectName && selectedTemplate) {
//       const keyToSend = projectKey || ${projectName.split(/\s+/).map(s => s[0]).join('').toUpperCase()}.slice(0, 6);
//       await createProjectApi(projectName, keyToSend, selectedTemplate);
//       setShowCreateProjectDialog(false);
//       setIssueData(prev => ({ ...prev, project: projectName }));
//       setProjectName('');
//       setProjectKey('');
//     } else {
//       showSnackbar('Provide project name and template', 'warning');
//     }
//   };

//   const handleIssueFieldChange = (field: string, value: any) => {
//     setIssueData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleOpenCreateIssue = () => {
//     resetIssueForm();
//     setShowCreateIssueDialog(true);
//   };

//   const handleSubmitIssue = async () => {
//     if (!issueData.summary) {
//       showSnackbar('Summary required', 'warning');
//       return;
//     }

//     if (editingIssueId !== null) {
//       const updates: any = {
//         title: issueData.summary,
//         description: issueData.description,
//         type: issueData.workType ? String(issueData.workType).toLowerCase() : undefined,
//         status: issueData.status,
//         assignee: issueData.assignee || null,
//         reporter: issueData.reporter || null,
//         team: issueData.team && issueData.team.length ? issueData.team : null,
//         start_date: issueData.startDate || null,
//         due_date: issueData.dueDate || null,
//         labels: issueData.labels ? issueData.labels.split(',').map(s => s.trim()).filter(Boolean) : null,
//         priority: issueData.priority ? issueData.priority.toLowerCase() : null,
//         sprint: issueData.sprint || null,
//         story_points: issueData.storyPoints ? Number(issueData.storyPoints) : null,
//         attachment: issueData.attachment ? { filename: issueData.attachment.name } : null,
//       };
//       await updateIssueApi({ id: editingIssueId, ...updates });
//       setShowCreateIssueDialog(false);
//       resetIssueForm();
//       return;
//     }

//     const created = await createIssueApi(issueData);
//     if (created) {
//       setShowCreateIssueDialog(false);
//       resetIssueForm();
//     }
//   };

//   const handleDelete = async (id: number | string) => {
//     if (!window.confirm('Are you sure you want to delete this issue?')) return;
//     await deleteIssueApi(id);
//   };

//   /** ---------- Drag & drop for board + backlog ---------- */
//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;
//     const { source, destination, draggableId } = result;

//     const isBacklogDrag =
//       source.droppableId === 'sprint' ||
//       source.droppableId === 'backlog' ||
//       destination.droppableId === 'sprint' ||
//       destination.droppableId === 'backlog';

//     if (isBacklogDrag) {
//       const getList = (id: string) =>
//         id === 'sprint' ? Array.from(backlogSprint) : Array.from(backlogList);

//       const sourceList = getList(source.droppableId);
//       const destList = getList(destination.droppableId);

//       const [moved] = sourceList.splice(source.index, 1);
//       destList.splice(destination.index, 0, moved);

//       if (source.droppableId === 'sprint') setBacklogSprint(sourceList);
//       else setBacklogList(sourceList);

//       if (destination.droppableId === 'sprint') {
//         setBacklogSprint(destList);
//         updateIssueApi({ id: moved.id, sprint: 'Sprint 1' }).then(() => {
//           if (selectedBoardId) loadIssuesForBoard(selectedBoardId);
//           else loadAllIssuesFallback();
//         });
//       } else {
//         setBacklogList(destList);
//         updateIssueApi({ id: moved.id, sprint: null }).then(() => {
//           if (selectedBoardId) loadIssuesForBoard(selectedBoardId);
//           else loadAllIssuesFallback();
//         });
//       }
//       return;
//     }

//     const destStatus = destination.droppableId;
//     const normalized = normalizeStatus(destStatus);
//     const issueId = draggableId;
//     const boardId = selectedBoardId;
//     const column_id = boardId ? findColumnIdForStatus(boardId, normalized) : null;

//     updateIssueApi({ id: issueId, status: normalized, column_id }).then(() => {
//       if (selectedBoardId) loadIssuesForBoard(selectedBoardId);
//       else loadAllIssuesFallback();
//     });
//   };

//   /** ---------- Filter & grouping logic ---------- */
//   const handleFilterChange = (field: string, value: any) => {
//     setFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const handleStatusFilterChange = (status: string) => {
//     setFilters(prev => {
//       const newStatus = prev.status.includes(status) ? prev.status.filter(s => s !== status) : [...prev.status, status];
//       return { ...prev, status: newStatus };
//     });
//   };

//   const handleWorkTypeFilterChange = (workType: string) => {
//     setFilters(prev => {
//       const newWorkType = prev.workType.includes(workType) ? prev.workType.filter(t => t !== workType) : [...prev.workType, workType];
//       return { ...prev, workType: newWorkType };
//     });
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       assignee: '',
//       reporter: '',
//       status: [],
//       priority: '',
//       workType: [],
//       dueDateStart: '',
//       dueDateEnd: '',
//       labels: '',
//     });
//     setSearchTerm('');
//   };

//   const handleClearGroup = () => {
//     setGroupBy('None');
//   };

//   const filteredIssues = createdIssues.filter(issue => {
//     const searchTermMatch =
//       !searchTerm ||
//       issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (issue.description || '').toLowerCase().includes(searchTerm.toLowerCase());
//     const assigneeMatch = filters.assignee
//       ? typeof issue.assignee === 'string'
//         ? issue.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
//         : (issue.assignee?.name || '').toLowerCase().includes(filters.assignee.toLowerCase())
//       : true;
//     const reporterMatch = filters.reporter
//       ? typeof issue.reporter === 'string'
//         ? issue.reporter.toLowerCase().includes(filters.reporter.toLowerCase())
//         : (issue.reporter?.name || '').toLowerCase().includes(filters.reporter.toLowerCase())
//       : true;
//     const statusMatch = filters.status.length > 0 ? filters.status.includes(normalizeStatus(issue.status)) : true;
//     const workTypeMatch = filters.workType.length > 0 ? filters.workType.includes(issue.type) : true;
//     const labelsMatch = filters.labels ? (issue.labels || '').toLowerCase().includes(filters.labels.toLowerCase()) : true;
//     const dueDateStartMatch = filters.dueDateStart ? issue.due_date ? new Date(issue.due_date) >= new Date(filters.dueDateStart) : false : true;
//     const dueDateEndMatch = filters.dueDateEnd ? issue.due_date ? new Date(issue.due_date) <= new Date(filters.dueDateEnd) : false : true;

//     return searchTermMatch && assigneeMatch && reporterMatch && statusMatch && workTypeMatch && labelsMatch && dueDateStartMatch && dueDateEndMatch;
//   });

//   const groupIssues = (issues: Issue[], key: string) => {
//     if (key === 'None') return { 'All Issues': issues };
//     return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
//       let groupName = 'Unassigned';
//       if (key === 'status') groupName = normalizeStatus(issue.status);
//       else if (key === 'priority') groupName = issue.priority || 'Unassigned';
//       else if (key === 'type') groupName = issue.type || 'Unassigned';
//       else if (key === 'assignee') {
//         const a = parsePersonField(issue.assignee);
//         groupName = typeof a === 'string' ? a : a?.name || 'Unassigned';
//       } else if (key === 'reporter') {
//         const r = parsePersonField(issue.reporter);
//         groupName = typeof r === 'string' ? r : r?.name || 'Unassigned';
//       } else if (key === 'team') {
//         const t = parseTeamField(issue.team);
//         groupName = t.length > 0 ? t.map(m => m.name).join(', ') : 'Unassigned';
//       }

//       if (!acc[groupName]) acc[groupName] = [];
//       acc[groupName].push(issue);
//       return acc;
//     }, {});
//   };

//   const groupedIssues = groupIssues(filteredIssues, groupBy);

//   const calendarEvents = createdIssues.filter(i => i.due_date || i.start_date).map(i => ({ id: String(i.id), title: i.title, start: i.start_date || i.due_date, end: i.due_date || i.start_date }));
//   const timelineResources = createdIssues.map(i => ({ id: String(i.id), title: i.title }));

//   useEffect(() => {
//     const total = createdIssues.length;
//     const open = createdIssues.filter(i => normalizeStatus(i.status) !== 'DONE').length;
//     const closed = total - open;
//     const highPriority = createdIssues.filter(i => String(i.priority).toUpperCase() === 'HIGH').length;
//     const types = issueTypes.map(t => ({ type: t, count: createdIssues.filter(i => i.type === t).length }));
//     const prioritiesAgg = ['HIGH', 'MEDIUM', 'LOW'].map(p => ({ priority: p, count: createdIssues.filter(i => String(i.priority).toUpperCase() === p).length }));

//     setSummary({ total, open, closed, highPriority, types, priorities: prioritiesAgg });
//   }, [createdIssues]);

//   const renderPersonChip = (field: PersonOrString) => {
//     if (!field) return null;
//     if (typeof field === 'string') {
//       return <Chip avatar={<Avatar>{String(field)[0]?.toUpperCase() || '?'}</Avatar>} label={field} size="small" />;
//     }
//     return <Chip avatar={<Avatar>{initialsFromName(field.name)}</Avatar>} label={field.name} size="small" />;
//   };

//   const renderTeamChips = (teamField: TeamField) => {
//     if (!teamField) return null;
//     if (typeof teamField === 'string') {
//       return <Chip avatar={<Avatar>{teamField[0]?.toUpperCase()}</Avatar>} label={teamField} size="small" />;
//     }
//     return <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>{(teamField as UserRef[]).map(member => <Chip key={member.email || member.name} avatar={<Avatar>{initialsFromName(member.name)}</Avatar>} label={member.name} size="small" />)}</div>;
//   };

//   function handleEdit(issue: Issue): void {
//     setEditingIssueId(issue.id);
//     setIssueData({
//       project: createdProject?.name || '',
//       workType: issue.type || '',
//       status: issue.status || 'TODO',
//       summary: issue.title || '',
//       description: issue.description || '',
//       assignee: typeof issue.assignee === 'object' ? (issue.assignee as UserRef).email || (issue.assignee as UserRef).name : (issue.assignee as string) || '',
//       reporter: typeof issue.reporter === 'object' ? (issue.reporter as UserRef).email || (issue.reporter as UserRef).name : (issue.reporter as string) || '',
//       team: Array.isArray(issue.team) && issue.team.length > 0 ? (issue.team as UserRef[]).map(t => t.email || t.name) : typeof issue.team === 'string' && issue.team ? [issue.team] : [],
//       startDate: issue.start_date || '',
//       dueDate: issue.due_date || '',
//       priority: issue.priority || '',
//       sprint: issue.sprint || '',
//       storyPoints: issue.storyPoints ? String(issue.storyPoints) : '',
//       labels: issue.labels || '',
//       attachment: null,
//     });
//     setShowCreateIssueDialog(true);
//   }

//   /** ---------- Backlog create handler (persists to backend) ---------- */
//   const handleBacklogCreate = async () => {
//     if (!newBacklogItem.title) {
//       showSnackbar('Title required', 'warning');
//       return;
//     }
//     const payload = {
//       project: createdProject?.name || '',
//       workType: newBacklogItem.workType,
//       status: 'TODO',
//       summary: newBacklogItem.title,
//       description: '',
//       assignee: newBacklogItem.assignee || '',
//       reporter: '',
//       team: [],
//       startDate: '',
//       dueDate: newBacklogItem.dueDate || '',
//       priority: '',
//       sprint: '',
//       storyPoints: '',
//       labels: '',
//       attachment: null,
//     };
//     const created = await createIssueApi(payload as any);
//     if (created) {
//       setNewBacklogItem({ workType: 'Story', title: '', dueDate: '', assignee: '' });
//       setShowBacklogForm(false);
//       setScrumCounter(prev => prev + 1);
//     } else {
//       showSnackbar('Failed to create backlog item', 'error');
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       await loadProjects();
//       await loadBoards();
//       if (selectedBoardId) {
//         await loadColumns(selectedBoardId);
//         await loadIssuesForBoard(selectedBoardId);
//       } else {
//         await loadAllIssuesFallback();
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!selectedBoardId) return;
//     loadColumns(selectedBoardId);
//     loadIssuesForBoard(selectedBoardId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedBoardId]);

//   useEffect(() => {
//     (async () => {
//       if (createdProject?.id) {
//         const s = await fetchProjectSummary(createdProject.id);
//         if (s) {
//           setSummary(prev => ({
//             total: s.total ?? (prev?.total ?? 0),
//             open: s.total - (s.completed ?? 0),
//             closed: s.completed ?? (prev?.closed ?? 0),
//             highPriority: prev?.highPriority ?? 0,
//             types: s.byType?.map((r: any) => ({ type: r.type, count: Number(r.count) })) ?? prev?.types ?? [],
//             priorities: prev?.priorities ?? [],
//           }));
//         }
//       }
//     })();
//   }, [createdProject]);

//   /** ---------- Render ---------- */
//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to Jira-like Project!" subtitle="Backstage plugin demo">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>

//       <Content>
//         <ContentHeader title="">
//           <Button variant="contained" color="primary" onClick={() => setShowTemplateSelection(true)}>
//             Project Templates
//           </Button>
//           <SupportButton>Click to choose a project template.</SupportButton>
//         </ContentHeader>

//         {!createdProject && (
//           <Grid container spacing={3}>
//             <Grid item xs={6}>
//               <Card>
//                 <CardActionArea onClick={() => { setSelectedTemplate('scrum'); setShowTemplateDialog(true); }}>
//                   <CardContent>
//                     <Typography variant="h6">Scrum Template</Typography>
//                     <Typography variant="body2">For iterative, sprint-based work.</Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//             <Grid item xs={6}>
//               <Card>
//                 <CardActionArea onClick={() => { setSelectedTemplate('kanban'); setShowTemplateDialog(true); }}>
//                   <CardContent>
//                     <Typography variant="h6">Kanban Template</Typography>
//                     <Typography variant="body2">For continuous work tracking.</Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//           </Grid>
//         )}

//         {createdProject && (
//           <>
//             <ContentHeader title={createdProject.name}>
//               <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                 <TextField select label="Board" size="small" value={selectedBoardId ?? ''} onChange={e => setSelectedBoardId(Number(e.target.value))}>
//                   <MenuItem value="">Select board</MenuItem>
//                   {boardsList.filter(b => b.project_id === createdProject.id).map(b => (
//                     <MenuItem key={b.id} value={b.id}>
//                       {b.name}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <IconButton onClick={handleOpenCreateIssue}>
//                   <Add /> +Create
//                 </IconButton>
//               </div>
//             </ContentHeader>

//             <Tabs value={tab} onChange={(_, v) => setTab(v as any)} indicatorColor="primary" textColor="primary">
//               <Tab value="summary" label="Summary View" />
//               <Tab value="timeline" label="Timeline" />
//               {createdProject.type === 'scrum' && <Tab value="backlog" label="Backlog" />}
//               <Tab value="board" label="Board View" />
//               <Tab value="calendar" label="Calendar" />
//               <Tab value="list" label="List View" />
//               <Tab value="allwork" label="All Work" />
//             </Tabs>

//             {tab === 'summary' && (
//               <Grid container spacing={2} style={{ marginTop: 16 }}>
//                 <Grid item xs={12}>
//                   <Typography variant="h6">Summary (server + local)</Typography>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>📊 {summary?.total ?? 0} total</strong>
//                         <br />
//                         All issues
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>🟡 {summary?.open ?? 0} open</strong>
//                         <br />
//                         Not done yet
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>✅ {summary?.closed ?? 0} closed</strong>
//                         <br />
//                         Done
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Card>
//                     <CardContent>
//                       <Typography>
//                         <strong>🔥 {summary?.highPriority ?? 0} high priority</strong>
//                         <br />
//                         Priority = HIGH
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12} style={{ marginTop: 12 }}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6">Status overview</Typography>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie data={statusCounts} dataKey="value" nameKey="name" outerRadius={100} label>
//                             {statusCounts.map((_entry, index) => <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]} />)}
//                           </Pie>
//                           <Tooltip />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12} style={{ marginTop: 12 }}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6">Types of work</Typography>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie data={typeChartData} dataKey="count" nameKey="type" outerRadius={100} label>
//                             {typeChartData.map((_entry, index) => <Cell key={cell-type-${index}} fill={TYPE_COLORS[_entry.type] || COLORS[index % COLORS.length]} />)}
//                           </Pie>
//                           <Tooltip />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 <Grid item xs={12} style={{ marginTop: 12 }}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6">Priority breakdown</Typography>
//                       <ResponsiveContainer width="100%" height={320}>
//                         <BarChart data={priorityChartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="priority" />
//                           <YAxis allowDecimals={false} />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="count" name="Count">
//                             {priorityChartData.map((_entry, index) => <Cell key={cell-priority-${index}} fill={PRIORITY_COLORS[_entry.priority] || COLORS[index % COLORS.length]} />)}
//                           </Bar>
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             )}

//              {tab === 'board' && (
//               <Grid container spacing={2} style={{ marginTop: 16 }}>
//                 <DragDropContext onDragEnd={handleDragEnd}>
//                   {statusesList.map(status => (
//                     <Grid item xs={12} sm={6} md={3} key={status.value}>
//                       <Paper elevation={3} style={{ padding: 16 }}>
//                         <Typography variant="h6" style={{ marginBottom: 12, textAlign: 'center' }}>
//                           {status.label} ({createdIssues.filter(i => normalizeStatus(i.status) === status.value).length})
//                         </Typography>
//                         <Droppable droppableId={status.value}>
//                           {(provided, snapshot) => (
//                             <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: snapshot.isDraggingOver ? 'lightgray' : '#f4f5f7', padding: 8, borderRadius: 4, minHeight: 300 }}>
//                               {createdIssues.filter(i => normalizeStatus(i.status) === status.value).map((issue, index) => (
//                                 <Draggable key={String(issue.id)} draggableId={String(issue.id)} index={index}>
//                                   {prov => (
//                                     <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={{ marginBottom: 8, cursor: 'pointer', ...prov.draggableProps.style }} onClick={() => handleEdit(issue)}>
//                                       <CardContent>
//                                         <Grid container justifyContent="space-between" alignItems="center">
//                                           <Grid item>
//                                             <Typography variant="body2" color="textSecondary">{issue.type}</Typography>
//                                           </Grid>
//                                           <Grid item>
//                                             <Chip label={issue.priority || 'N/A'} size="small" style={{ backgroundColor: PRIORITY_COLORS[issue.priority?.toUpperCase() || 'LOW'] || 'gray', color: 'white' }} />
//                                           </Grid>
//                                         </Grid>
//                                         <Typography variant="h6" component="h2" noWrap>{issue.title}</Typography>
//                                         <Typography variant="body2" color="textSecondary" noWrap>Due: {formatDate(issue.due_date)}</Typography>
//                                         <div style={{ marginTop: 8 }}>{renderPersonChip(issue.assignee)}</div>
//                                       </CardContent>
//                                     </Card>
//                                   )}
//                                 </Draggable>
//                               ))}
//                               {provided.placeholder}
//                             </div>
//                           )}
//                         </Droppable>
//                       </Paper>
//                     </Grid>
//                   ))}
//                 </DragDropContext>
//               </Grid>
//             )}

//             {tab === 'backlog' && createdProject?.type === 'scrum' && (
//               <Grid container spacing={2} style={{ marginTop: 16 }}>
//                 <DragDropContext onDragEnd={handleDragEnd}>
//                   <Grid item xs={12} md={6}>
//                     <Paper elevation={3} style={{ padding: 16 }}>
//                       <Grid container alignItems="center" justifyContent="space-between">
//                         <Grid item><Typography variant="h6">Sprint</Typography></Grid>
//                         <Grid item><Typography variant="caption" color="textSecondary">(drag items here to include in sprint)</Typography></Grid>
//                       </Grid>

//                       <Droppable droppableId="sprint">
//                         {(provided, snapshot) => (
//                           <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: snapshot.isDraggingOver ? 'lightgray' : '#f4f5f7', padding: 8, minHeight: 360, marginTop: 12 }}>
//                             {backlogSprint.map((issue, index) => (
//                               <Draggable key={String(issue.id)} draggableId={String(issue.id)} index={index}>
//                                 {prov => (
//                                   <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={{ marginBottom: 8, cursor: 'grab', ...prov.draggableProps.style }}>
//                                     <CardContent>
//                                       <Typography variant="body2" color="textSecondary">{issue.type} — {String(issue.id)}</Typography>
//                                       <Typography variant="h6" noWrap>{issue.title}</Typography>
//                                       <Typography variant="body2" color="textSecondary" noWrap>Due: {formatDate(issue.due_date)}</Typography>
//                                       <div style={{ marginTop: 8 }}>{renderPersonChip(issue.assignee)}</div>
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     </Paper>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Paper elevation={3} style={{ padding: 16 }}>
//                       <Grid container alignItems="center" justifyContent="space-between">
//                         <Grid item><Typography variant="h6">Backlog</Typography></Grid>
//                         <Grid item>
//                           <Button variant="outlined" startIcon={<Add />} onClick={() => setShowBacklogForm(prev => !prev)} size="small">Create</Button>
//                         </Grid>
//                       </Grid>

//                       {showBacklogForm && (
//                         <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
//                           <TextField select label="Work Type" value={newBacklogItem.workType} onChange={e => setNewBacklogItem(prev => ({ ...prev, workType: e.target.value }))} size="small" style={{ minWidth: 140 }}>
//                             {workTypesScrum.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
//                           </TextField>

//                           <TextField label="Title" value={newBacklogItem.title} onChange={e => setNewBacklogItem(prev => ({ ...prev, title: e.target.value }))} size="small" style={{ minWidth: 220 }} />

//                           <TextField type="date" label="Due" InputLabelProps={{ shrink: true }} value={newBacklogItem.dueDate} onChange={e => setNewBacklogItem(prev => ({ ...prev, dueDate: e.target.value }))} size="small" />

//                           <TextField label="Assignee" value={newBacklogItem.assignee} onChange={e => setNewBacklogItem(prev => ({ ...prev, assignee: e.target.value }))} size="small" placeholder="name or email" style={{ minWidth: 160 }} />

//                           <div>
//                             <Button color="primary" variant="contained" onClick={handleBacklogCreate} size="small">Create</Button>
//                             <Button style={{ marginLeft: 8 }} onClick={() => { setShowBacklogForm(false); setNewBacklogItem({ workType: 'Story', title: '', dueDate: '', assignee: '' }); }} size="small">Cancel</Button>
//                           </div>
//                         </div>
//                       )}

//                       <Droppable droppableId="backlog">
//                         {(provided, snapshot) => (
//                           <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: snapshot.isDraggingOver ? 'lightgray' : '#f4f5f7', padding: 8, minHeight: 360, marginTop: 12 }}>
//                             {backlogList.map((issue, index) => (
//                               <Draggable key={String(issue.id)} draggableId={String(issue.id)} index={index}>
//                                 {prov => (
//                                   <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={{ marginBottom: 8, cursor: 'grab', ...prov.draggableProps.style }}>
//                                     <CardContent>
//                                       <Typography variant="body2" color="textSecondary">{issue.type} — {String(issue.id)}</Typography>
//                                       <Typography variant="h6" noWrap>{issue.title}</Typography>
//                                       <Typography variant="body2" color="textSecondary" noWrap>Due: {formatDate(issue.due_date)}</Typography>
//                                       <div style={{ marginTop: 8 }}>{renderPersonChip(issue.assignee)}</div>
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     </Paper>
//                   </Grid>
//                 </DragDropContext>
//               </Grid>
//             )}

//             {tab === 'list' && (
//               <Grid container spacing={2} style={{ marginTop: 16 }}>
//                 {showFilters && (
//                   <Grid item xs={12} sm={3}>
//                     <Paper elevation={3} style={{ padding: 16 }}>
//                       <Typography variant="h6" gutterBottom>Filters</Typography>
//                       <Divider style={{ margin: '8px 0' }} />
//                       <Typography variant="subtitle2" gutterBottom>Status</Typography>
//                       <Grid container spacing={1}>
//                         {statusesList.map(s => (
//                           <Grid item key={s.value}>
//                             <Chip label={s.label} clickable onClick={() => handleStatusFilterChange(s.value)} color={filters.status.includes(s.value) ? 'primary' : 'default'} />
//                           </Grid>
//                         ))}
//                       </Grid>

//                       <Divider style={{ margin: '12px 0' }} />
//                       <Typography variant="subtitle2">Due Date</Typography>
//                       <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={filters.dueDateStart} onChange={e => handleFilterChange('dueDateStart', e.target.value)} style={{ marginBottom: 8 }} />
//                       <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={filters.dueDateEnd} onChange={e => handleFilterChange('dueDateEnd', e.target.value)} />

//                       <Divider style={{ margin: '12px 0' }} />
//                       <Typography variant="subtitle2">Assignee</Typography>
//                       <TextField placeholder="Search by name or email" fullWidth value={filters.assignee} onChange={e => handleFilterChange('assignee', e.target.value)} />

//                       <Divider style={{ margin: '12px 0' }} />
//                       <Typography variant="subtitle2">Reporter</Typography>
//                       <TextField placeholder="Search by name or email" fullWidth value={filters.reporter} onChange={e => handleFilterChange('reporter', e.target.value)} />

//                       <Divider style={{ margin: '12px 0' }} />
//                       <Typography variant="subtitle2">Work Type</Typography>
//                       <Grid container spacing={1}>
//                         {issueTypes.map(t => (
//                           <Grid item key={t}>
//                             <Chip label={t} clickable onClick={() => handleWorkTypeFilterChange(t)} color={filters.workType.includes(t) ? 'primary' : 'default'} />
//                           </Grid>
//                         ))}
//                       </Grid>

//                       <Divider style={{ margin: '12px 0' }} />
//                       <Typography variant="subtitle2">Labels</Typography>
//                       <TextField placeholder="Search labels" fullWidth value={filters.labels} onChange={e => handleFilterChange('labels', e.target.value)} />
//                     </Paper>
//                   </Grid>
//                 )}

//                 <Grid item xs={12} sm={showFilters ? 9 : 12}>
//                   <Paper elevation={3}>
//                     <Toolbar>
//                       <TextField variant="outlined" size="small" placeholder="Search issues" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginRight: 16 }} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
//                       <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setShowFilters(prev => !prev)}>Filter</Button>
//                       <Button variant="outlined" onClick={handleClearFilters} style={{ marginLeft: 8 }}>Clear</Button>
//                       <div style={{ flexGrow: 1 }} />
//                       <TextField select value={groupBy} onChange={e => setGroupBy(e.target.value as any)} variant="outlined" size="small" label="Group by" style={{ width: 160 }}>
//                         <MenuItem value="None">None</MenuItem>
//                         <MenuItem value="status">Status</MenuItem>
//                         <MenuItem value="assignee">Assignee</MenuItem>
//                         <MenuItem value="reporter">Reporter</MenuItem>
//                         <MenuItem value="team">Team</MenuItem>
//                         <MenuItem value="priority">Priority</MenuItem>
//                         <MenuItem value="type">Type</MenuItem>
//                       </TextField>
//                       <Button variant="outlined" onClick={handleClearGroup} style={{ marginLeft: 8 }}>Clear</Button>
//                     </Toolbar>

//                     <TableContainer>
//                       <Table stickyHeader>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell />
//                             <TableCell>Key</TableCell>
//                             <TableCell>Summary</TableCell>
//                             <TableCell>Type</TableCell>
//                             <TableCell>Status</TableCell>
//                             <TableCell>Priority</TableCell>
//                             <TableCell>Reporter</TableCell>
//                             <TableCell>Assignee</TableCell>
//                             <TableCell>Team</TableCell>
//                             <TableCell>Due Date</TableCell>
//                             <TableCell>Comments</TableCell>
//                             <TableCell align="right">Actions</TableCell>
//                           </TableRow>
//                         </TableHead>

//                         {groupBy === 'None' ? (
//                           <TableBody>
//                             {filteredIssues.map(issue => (
//                               <TableRow key={String(issue.id)} hover>
//                                 <TableCell><Checkbox /></TableCell>
//                                 <TableCell>{`PROJ-${String(issue.id)}`}</TableCell>
//                                 <TableCell>
//                                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                                     <Chip label={issue.type} size="small" />
//                                     <Typography variant="body2" noWrap>{issue.title}</Typography>
//                                   </div>
//                                 </TableCell>
//                                 <TableCell>{issue.type}</TableCell>
//                                 <TableCell>
//                                   <Chip label={statusesList.find(s => s.value === normalizeStatus(issue.status))?.label || normalizeStatus(issue.status)} size="small" style={{ backgroundColor: normalizeStatus(issue.status) === 'DONE' ? '#52c41a' : normalizeStatus(issue.status) === 'IN_PROGRESS' ? '#1890ff' : 'lightgray', color: 'white' }} />
//                                 </TableCell>
//                                 <TableCell><Chip label={issue.priority || 'N/A'} size="small" style={{ backgroundColor: PRIORITY_COLORS[issue.priority?.toUpperCase() || 'LOW'] || 'gray', color: 'white' }} /></TableCell>
//                                 <TableCell>{renderPersonChip(issue.reporter)}</TableCell>
//                                 <TableCell>{renderPersonChip(issue.assignee)}</TableCell>
//                                 <TableCell>{renderTeamChips(issue.team)}</TableCell>
//                                 <TableCell>{formatDate(issue.due_date)}</TableCell>
//                                 <TableCell><Button size="small" variant="outlined">Add Comment</Button></TableCell>
//                                 <TableCell align="right">
//                                   <IconButton onClick={() => handleEdit(issue)}><EditIcon fontSize="small" /></IconButton>
//                                   <IconButton onClick={() => handleDelete(issue.id)}><DeleteIcon fontSize="small" /></IconButton>
//                                   <IconButton><MoreHorizIcon fontSize="small" /></IconButton>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         ) : (
//                           Object.keys(groupedIssues).map(groupName => (
//                             <TableBody key={groupName}>
//                               <TableRow>
//                                 <TableCell colSpan={12} style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>{groupName} ({groupedIssues[groupName].length})</TableCell>
//                               </TableRow>
//                               {groupedIssues[groupName].map(issue => (
//                                 <TableRow key={String(issue.id)} hover>
//                                   <TableCell><Checkbox /></TableCell>
//                                   <TableCell>{`PROJ-${String(issue.id)}`}</TableCell>
//                                   <TableCell>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                                       <Chip label={issue.type} size="small" />
//                                       <Typography variant="body2" noWrap>{issue.title}</Typography>
//                                     </div>
//                                   </TableCell>
//                                   <TableCell>{issue.type}</TableCell>
//                                   <TableCell><Chip label={statusesList.find(s => s.value === normalizeStatus(issue.status))?.label || normalizeStatus(issue.status)} size="small" style={{ backgroundColor: normalizeStatus(issue.status) === 'DONE' ? '#52c41a' : normalizeStatus(issue.status) === 'IN_PROGRESS' ? '#1890ff' : 'lightgray', color: 'white' }} /></TableCell>
//                                   <TableCell><Chip label={issue.priority || 'N/A'} size="small" style={{ backgroundColor: PRIORITY_COLORS[issue.priority?.toUpperCase() || 'LOW'] || 'gray', color: 'white' }} /></TableCell>
//                                   <TableCell>{renderPersonChip(issue.reporter)}</TableCell>
//                                   <TableCell>{renderPersonChip(issue.assignee)}</TableCell>
//                                   <TableCell>{renderTeamChips(issue.team)}</TableCell>
//                                   <TableCell>{formatDate(issue.due_date)}</TableCell>
//                                   <TableCell><Button size="small" variant="outlined">Add Comment</Button></TableCell>
//                                   <TableCell align="right">
//                                     <IconButton onClick={() => handleEdit(issue)}><EditIcon fontSize="small" /></IconButton>
//                                     <IconButton onClick={() => handleDelete(issue.id)}><DeleteIcon fontSize="small" /></IconButton>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           ))
//                         )}
//                       </Table>
//                     </TableContainer>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             )}

//             {tab === 'allwork' && (
//               <Grid container spacing={2} style={{ marginTop: 16 }}>
//                 <Grid item xs={12}>
//                   <Paper style={{ padding: 16, borderRadius: 8 }}>
//                     <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
//                       <TextField variant="outlined" size="small" placeholder="Search all work" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} style={{ marginRight: 16, width: 320 }} />
//                       <div style={{ flexGrow: 1 }} />
//                       <TextField select variant="outlined" size="small" value={groupBy} onChange={e => setGroupBy(e.target.value as any)} label="Group by" style={{ marginRight: 8 }}>
//                         <MenuItem value="None">None</MenuItem>
//                         <MenuItem value="status">Status</MenuItem>
//                         <MenuItem value="assignee">Assignee</MenuItem>
//                         <MenuItem value="reporter">Reporter</MenuItem>
//                         <MenuItem value="team">Team</MenuItem>
//                         <MenuItem value="priority">Priority</MenuItem>
//                         <MenuItem value="type">Type</MenuItem>
//                       </TextField>
//                     </Toolbar>

//                     <TableContainer>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>All Work</TableCell>
//                             <TableCell>Status</TableCell>
//                             <TableCell>Priority</TableCell>
//                             <TableCell>Reporter</TableCell>
//                             <TableCell>Assignee</TableCell>
//                             <TableCell>Team</TableCell>
//                             <TableCell>Due Date</TableCell>
//                             <TableCell>Created At</TableCell>
//                             <TableCell>Updated At</TableCell>
//                             <TableCell>Comments</TableCell>
//                             <TableCell align="right">Actions</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {Object.entries(groupedIssues).map(([groupName, issues]) => (
//                             <React.Fragment key={groupName}>
//                               <TableRow>
//                                 <TableCell colSpan={11} style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>{groupName} ({issues.length})</TableCell>
//                               </TableRow>
//                               {issues.map(issue => (
//                                 <TableRow key={String(issue.id)}>
//                                   <TableCell>
//                                     <Grid container spacing={1} alignItems="center">
//                                       <Grid item><Typography variant="body2" style={{ fontWeight: 'bold' }}>{`PROJECT-${String(issue.id)}`}</Typography></Grid>
//                                       <Grid item xs><Typography variant="body2">{issue.title}</Typography></Grid>
//                                     </Grid>
//                                   </TableCell>
//                                   <TableCell><Button variant="contained" style={{ backgroundColor: '#f4f5f7', color: 'black' }}>{issue.status}</Button></TableCell>
//                                   <TableCell><Chip label={issue.priority || 'N/A'} style={{ backgroundColor: PRIORITY_COLORS[issue.priority?.toUpperCase() || 'LOW'], color: 'white' }} /></TableCell>
//                                   <TableCell>{renderPersonChip(issue.reporter)}</TableCell>
//                                   <TableCell>{renderPersonChip(issue.assignee)}</TableCell>
//                                   <TableCell>{renderTeamChips(issue.team)}</TableCell>
//                                   <TableCell>{formatDate(issue.due_date)}</TableCell>
//                                   <TableCell>{formatDate(issue.created_at)}</TableCell>
//                                   <TableCell>{formatDate(issue.updated_at)}</TableCell>
//                                   <TableCell><Button startIcon={<Add />} onClick={() => alert('Open comment UI (not implemented)')}>Add comment</Button></TableCell>
//                                   <TableCell align="right"><div style={{ display: 'flex', justifyContent: 'flex-end' }}><IconButton onClick={() => handleEdit(issue)}><EditIcon fontSize="small" /></IconButton><IconButton onClick={() => handleDelete(issue.id)}><DeleteIcon fontSize="small" /></IconButton></div></TableCell>
//                                 </TableRow>
//                               ))}
//                             </React.Fragment>
//                           ))}
//                           <TableRow>
//                             <TableCell colSpan={11} style={{ borderBottom: 'none' }}>
//                               <Button onClick={handleOpenCreateIssue} color="primary" startIcon={<Add />}>Create</Button>
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             )}

//             {tab === 'calendar' && (
//               <Grid item style={{ marginTop: 16 }}>
//                 <Typography variant="h6" style={{ marginBottom: 16 }}>Calendar View</Typography>
//                 <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
//                   <FullCalendar plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]} initialView="dayGridMonth" headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }} events={calendarEvents} eventClick={(info: EventClickArg) => { const issue = createdIssues.find(i => String(i.id) === info.event.id); if (issue) handleEdit(issue); }} height="auto" />
//                 </div>
//               </Grid>
//             )}

//             {tab === 'timeline' && (
//               <Grid item style={{ marginTop: 16 }}>
//                 <Typography variant="h6" style={{ marginBottom: 16 }}>Timeline View</Typography>
//                 <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
//                   <FullCalendar {...({ plugins: [resourceTimelinePlugin, interactionPlugin], initialView: 'resourceTimelineMonth', schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', headerToolbar: { left: 'prev,next today', center: 'title', right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth' }, resources: timelineResources, events: createdIssues.filter(issue => issue.start_date && issue.due_date).map(issue => ({ id: issue.id.toString(), resourceId: issue.id.toString(), title: `${issue.title} (${typeof issue.assignee === 'object' ? (issue.assignee as UserRef).name : issue.assignee})`, start: issue.start_date, end: issue.due_date })), eventClick: (info: EventClickArg) => { const issue = createdIssues.find(i => i.id.toString() === info.event.id); if (issue) handleEdit(issue); }, height: '80vh' } as any)} />
//                 </div>
//               </Grid>
//             )}
//           </>
//         )}
//       </Content>

//       {/* Template Selection Dialog (NEW) */}
//       <Dialog open={showTemplateSelection} onClose={() => setShowTemplateSelection(false)}>
//         <DialogTitle>Select a Project Template</DialogTitle>
//         <DialogContent>
//           <List>
//             <ListItem button onClick={() => { setSelectedTemplate('scrum'); setShowTemplateSelection(false); setShowTemplateDialog(true); }}>
//               <ListItemText primary="Scrum" secondary="Plan sprints and track progress in iterations" />
//             </ListItem>
//             <ListItem button onClick={() => { setSelectedTemplate('kanban'); setShowTemplateSelection(false); setShowTemplateDialog(true); }}>
//               <ListItemText primary="Kanban" secondary="Track work items in a continuous flow" />
//             </ListItem>
//             <ListItem button onClick={() => { setSelectedTemplate('kanban'); setShowTemplateSelection(false); setShowTemplateDialog(true); }}>
//               <ListItemText primary="Bug Tracking (Kanban)" secondary="Focused Kanban board for bug triage" />
//             </ListItem>
//             <ListItem button onClick={() => { setSelectedTemplate('kanban'); setShowTemplateSelection(false); setShowTemplateDialog(true); }}>
//               <ListItemText primary="Custom" secondary="Customize your board and workflow" />
//             </ListItem>
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowTemplateSelection(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Template info dialog (kept) */}
//       <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)}>
//         <DialogTitle>{selectedTemplate === 'scrum' ? 'Scrum Template' : 'Kanban Template'}</DialogTitle>
//         <DialogContent>
//           <Typography>
//             {selectedTemplate === 'scrum'
//               ? 'Scrum is an agile methodology for iterative, sprint-based development.'
//               : 'Kanban is a continuous workflow methodology for work tracking.'}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
//           <Button color="primary" onClick={handleUseTemplate}>
//             Use Template
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create project dialog */}
//       <Dialog open={showCreateProjectDialog} onClose={() => setShowCreateProjectDialog(false)}>
//         <DialogTitle>Create Project</DialogTitle>
//         <DialogContent>
//           <TextField label="Project Name" fullWidth margin="normal" value={projectName} onChange={e => setProjectName(e.target.value)} />
//           <TextField label="Project Key" fullWidth margin="normal" value={projectKey} onChange={e => setProjectKey(e.target.value)} />
//           <TextField select label="Template" fullWidth margin="normal" value={selectedTemplate ?? ''} onChange={e => setSelectedTemplate(e.target.value as any)}>
//             <MenuItem value="scrum">Scrum</MenuItem>
//             <MenuItem value="kanban">Kanban</MenuItem>
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowCreateProjectDialog(false)}>Cancel</Button>
//           <Button color="primary" onClick={handleCreateProject}>Create Project</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Create/Edit Issue dialog */}
//       <Dialog open={showCreateIssueDialog} onClose={() => { setShowCreateIssueDialog(false); resetIssueForm(); }} fullWidth maxWidth="sm">
//         <DialogTitle>{editingIssueId ? 'Edit Issue' : 'Create Issue'}</DialogTitle>
//         <DialogContent>
//           <TextField select label="Project" fullWidth margin="normal" value={issueData.project} onChange={e => handleIssueFieldChange('project', e.target.value)}>
//             {projectsList.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
//           </TextField>

//           <TextField select label="Work Type" fullWidth margin="normal" value={issueData.workType} onChange={e => handleIssueFieldChange('workType', e.target.value)}>
//             {(createdProject?.type === 'kanban' ? workTypesKanban : workTypesScrum).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
//           </TextField>

//           <TextField select label="Status" fullWidth margin="normal" value={issueData.status} onChange={e => handleIssueFieldChange('status', e.target.value)}>
//             {statusesList.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
//           </TextField>

//           <TextField label="Summary" fullWidth margin="normal" value={issueData.summary} onChange={e => handleIssueFieldChange('summary', e.target.value)} />
//           <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={issueData.description} onChange={e => handleIssueFieldChange('description', e.target.value)} />
//           <TextField label="Assignee (email)" fullWidth margin="normal" value={issueData.assignee} onChange={e => handleIssueFieldChange('assignee', e.target.value)} />
//           <TextField label="Reporter (email)" fullWidth margin="normal" value={issueData.reporter} onChange={e => handleIssueFieldChange('reporter', e.target.value)} />
//           <TextField label="Team (comma separated emails)" fullWidth margin="normal" value={issueData.team.join(', ')} onChange={e => handleIssueFieldChange('team', e.target.value.split(',').map((s: string) => s.trim()))} />
//           <TextField type="date" label="Start Date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={issueData.startDate} onChange={e => handleIssueFieldChange('startDate', e.target.value)} />
//           <TextField type="date" label="Due Date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={issueData.dueDate} onChange={e => handleIssueFieldChange('dueDate', e.target.value)} />
//           {createdProject?.type === 'scrum' && <TextField select label="Sprint" fullWidth margin="normal" value={issueData.sprint} onChange={e => handleIssueFieldChange('sprint', e.target.value)}>{sprints.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField>}
//           <TextField label="Story Point Estimate" fullWidth margin="normal" value={issueData.storyPoints} onChange={e => handleIssueFieldChange('storyPoints', e.target.value)} />
//           <TextField label="Labels (priority or freeform)" fullWidth margin="normal" value={issueData.labels} onChange={e => handleIssueFieldChange('labels', e.target.value)} />
//           <input type="file" style={{ marginTop: 12 }} onChange={e => handleIssueFieldChange('attachment', e.target.files ? e.target.files[0] : null)} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setShowCreateIssueDialog(false); resetIssueForm(); }}>Cancel</Button>
//           <Button color="primary" onClick={handleSubmitIssue}>{editingIssueId ? 'Update' : 'Create'}</Button>
//         </DialogActions>
//       </Dialog>
//     </Page>
//   );
// }

// 1

// ExampleComponent.tsx
// ExampleComponent.tsx
// ExampleComponent.tsx

// ExampleComponent.tsx
import React, { useEffect, useMemo, useState, ChangeEvent } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  MenuItem,
  IconButton,
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
  Avatar,
  ListItemText,
  ListItem,
  List,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
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
import { differenceInDays } from 'date-fns';

/** ---------- API BASE ---------- */
const API_BASE = 'http://localhost:7007/api/final-project';

/** ---------- Types ---------- */
type UserRef = { name: string; email?: string };
type PersonOrString = UserRef | string | null;
type TeamField = UserRef[] | string | null;

type Issue = {
  id: number | string;
  title: string;
  description?: string;
  type: string;
  assignee: PersonOrString;
  reporter: PersonOrString;
  team: TeamField;
  parentId: number | null;
  start_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  priority?: string | null;
  status?: string;
  labels?: string;
  attachmentUrl?: string | null;
  storyPoints?: number | null;
  sprint?: string | null;
  board_id?: number | null;
  column_id?: number | null;
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
  return (first + (second || '')).slice(0, 2) || '?';
}
function formatDate(dateString?: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString();
}
function parsePersonField(v: any): PersonOrString {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') return v as UserRef;
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      if (p && typeof p === 'object') return p as UserRef;
    } catch {
      // not JSON
    }
    return v;
  }
  return null;
}
function parseTeamField(v: any): UserRef[] {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) {
    return v.map(item =>
      typeof item === 'string'
        ? emailRegex.test(item)
          ? { name: nameFromEmail(item), email: item }
          : { name: item }
        : (item as UserRef),
    );
  }
  if (typeof v === 'object') return [v as UserRef];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed as UserRef[];
      if (parsed && typeof parsed === 'object') return [parsed as UserRef];
    } catch {
      const parts = v
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (parts.length > 1) {
        return parts.map(p =>
          emailRegex.test(p)
            ? { name: nameFromEmail(p), email: p }
            : { name: p },
        );
      }
      if (emailRegex.test(v)) return [{ name: nameFromEmail(v), email: v }];
      return [{ name: v }];
    }
  }
  return [];
}

/** ---------- Constants ---------- */
const issueTypes = ['Epic', 'Feature', 'Task', 'Story', 'Bug'];
const statusesList = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'TESTING', label: 'Testing' },
  { value: 'DONE', label: 'Done' },
];
const priorities = ['LOW', 'MEDIUM', 'HIGH'];
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

/** ---------- Utility: status normalization & mapping ---------- */
function normalizeStatus(status?: string | null): string {
  if (!status) return 'TODO';
  const s = String(status).toLowerCase().trim();
  if (s === 'to do' || s === 'todo' || s === 'to_do' || s === 'to-do')
    return 'TODO';
  if (
    s === 'in progress' ||
    s === 'in_progress' ||
    s === 'inprogress' ||
    s === 'in-progress'
  )
    return 'IN_PROGRESS';
  if (s === 'testing') return 'TESTING';
  if (s === 'done' || s === 'closed' || s === 'finished') return 'DONE';
  if (s.includes('progress')) return 'IN_PROGRESS';
  if (s.includes('done') || s.includes('closed')) return 'DONE';
  if (s.includes('test')) return 'TESTING';
  return 'TODO';
}
function normalizedToDbStatus(normalized: string): string {
  switch (normalized) {
    case 'TODO':
      return 'to do';
    case 'IN_PROGRESS':
      return 'in progress';
    case 'TESTING':
      return 'testing';
    case 'DONE':
      return 'done';
    default:
      return normalized.toLowerCase();
  }
}

/** ---------- Component ---------- */
export const ExampleComponent = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    null | 'scrum' | 'kanban'
  >(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false); // NEW: selection dialog state
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [createdProject, setCreatedProject] = useState<{
    id?: number;
    name: string;
    type: 'scrum' | 'kanban';
  } | null>(null);

  const [tab, setTab] = useState<
    | 'summary'
    | 'board'
    | 'list'
    | 'calendar'
    | 'timeline'
    | 'allwork'
    | 'backlog'
  >('summary');

  const [showCreateIssueDialog, setShowCreateIssueDialog] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<number | string | null>(
    null,
  );
  const [issueData, setIssueData] = useState({
    project: '',
    workType: '',
    status: 'TODO',
    summary: '',
    description: '',
    assignee: '',
    reporter: '',
    team: [] as string[],
    startDate: '',
    dueDate: '',
    priority: '',
    sprint: '',
    storyPoints: '',
    labels: '',
    attachment: null as File | null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<
    'None' | 'status' | 'assignee' | 'reporter' | 'team' | 'priority' | 'type'
  >('None');
  const [showFilters, setShowFilters] = useState(false);
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

  const [createdIssues, setCreatedIssues] = useState<Issue[]>([]);
  const [projectsList, setProjectsList] = useState<Array<any>>([]);
  const [boardsList, setBoardsList] = useState<Array<any>>([]);
  const [columnsMap, setColumnsMap] = useState<Record<string, any[]>>({});
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  const [backlogSprint, setBacklogSprint] = useState<Issue[]>([]);
  const [backlogList, setBacklogList] = useState<Issue[]>([]);
  const [showBacklogForm, setShowBacklogForm] = useState(false);
  const [newBacklogItem, setNewBacklogItem] = useState({
    workType: 'Story',
    title: '',
    dueDate: '',
    assignee: '',
  });
  const [scrumCounter, setScrumCounter] = useState(1);

  const [summary, setSummary] = useState<IssueSummary | null>(null);

  const workTypesScrum = ['Story', 'Task', 'Bug', 'Epic'];
  const workTypesKanban = ['Story', 'Task', 'Bug', 'Epic', 'Feature'];
  const sprints = ['Sprint 1', 'Sprint 2'];

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
      (() => {
        const diff = differenceInDays(new Date(i.due_date as string), now);
        return diff >= 0 && diff <= 7;
      })(),
  );

  const statusCounts = statusesList.map(s => ({
    name: s.label,
    value: createdIssues.filter(i => normalizeStatus(i.status) === s.value)
      .length,
  }));
  const typeChartData = issueTypes.map(t => ({
    type: t,
    count: createdIssues.filter(i => i.type === t).length,
  }));
  const priorityChartData = ['HIGH', 'MEDIUM', 'LOW'].map(p => ({
    priority: p,
    count: createdIssues.filter(i => String(i.priority).toUpperCase() === p)
      .length,
  }));

  /** ---------- API helpers ---------- */
  async function loadProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to load projects', res.status);
        return;
      }
      const json = await res.json();
      setProjectsList(json);
      if (!createdProject && json.length > 0) {
        const p = json[0];
        setCreatedProject({ id: p.id, name: p.name, type: p.template });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading projects', err);
    }
  }

  async function createProjectApi(
    name: string,
    key: string,
    template: 'kanban' | 'scrum',
  ) {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, key, template }),
      });
      if (!res.ok) {
        const text = await res.text();
        // eslint-disable-next-line no-console
        console.error('Create project failed', res.status, text);
        alert('Failed to create project');
        return;
      }
      const project = await res.json();
      setCreatedProject({
        id: project.id,
        name: project.name,
        type: project.template,
      });
      await loadProjects();
      try {
        const boardRes = await fetch(`${API_BASE}/boards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${project.name} Board`,
            project_id: project.id,
          }),
        });
        if (boardRes.ok) {
          const board = await boardRes.json();
          await loadBoards();
          await loadColumns(board.id);
          setSelectedBoardId(board.id);
          await loadIssuesForBoard(board.id);
        } else {
          await loadBoards();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Board creation error', err);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error creating project', err);
      alert('Error creating project');
    }
  }

  async function loadBoards() {
    try {
      const res = await fetch(`${API_BASE}/boards`);
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to load boards', res.status);
        return;
      }
      const json = await res.json();
      setBoardsList(json);
      if (!selectedBoardId && json.length > 0) {
        const defaultBoard = json[0];
        setSelectedBoardId(defaultBoard.id);
        await loadColumns(defaultBoard.id);
        await loadIssuesForBoard(defaultBoard.id);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading boards', err);
    }
  }

  async function loadColumns(boardId: number) {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}/columns`);
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to load columns for board', boardId, res.status);
        return;
      }
      const cols = await res.json();
      setColumnsMap(prev => ({ ...prev, [String(boardId)]: cols }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading columns', err);
    }
  }

  function parseIssueFromServer(raw: any): Issue {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      type: raw.type
        ? String(raw.type).charAt(0).toUpperCase() + String(raw.type).slice(1)
        : 'Task',
      assignee: parsePersonField(raw.assignee),
      reporter: parsePersonField(raw.reporter),
      team: parseTeamField(raw.team),
      parentId: raw.parent_id ?? null,
      start_date: raw.start_date ?? '',
      due_date: raw.due_date ?? '',
      created_at: raw.created_at ?? new Date().toISOString(),
      updated_at: raw.updated_at ?? new Date().toISOString(),
      priority: raw.priority ? String(raw.priority).toUpperCase() : '',
      status: normalizeStatus(raw.status),
      labels: Array.isArray(raw.labels)
        ? raw.labels.join(', ')
        : typeof raw.labels === 'string'
        ? raw.labels
        : '',
      attachmentUrl: raw.attachments ? JSON.stringify(raw.attachments) : null,
      storyPoints: raw.story_points ?? raw.storyPoints ?? null,
      sprint: raw.sprint_id ? `Sprint-${raw.sprint_id}` : raw.sprint ?? null,
      board_id: raw.board_id ?? null,
      column_id: raw.column_id ?? null,
    };
  }

  async function loadIssuesForBoard(boardId: number) {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}/issues`);
      if (res.ok) {
        const rows = await res.json();
        const parsed = rows.map((r: any) => parseIssueFromServer(r));
        setCreatedIssues(parsed);
        setBacklogList(parsed.filter((i: Issue) => !i.sprint));
        setBacklogSprint(parsed.filter((i: Issue) => !!i.sprint));
      } else {
        await loadAllIssuesFallback();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading issues for board', err);
      await loadAllIssuesFallback();
    }
  }

  async function loadAllIssuesFallback() {
    try {
      const res = await fetch(`${API_BASE}/issues`);
      if (!res.ok) {
        const collected: Issue[] = [];
        for (const b of boardsList) {
          try {
            const r = await fetch(`${API_BASE}/boards/${b.id}/issues`);
            if (r.ok) {
              const rows = await r.json();
              rows.forEach((rr: any) =>
                collected.push(parseIssueFromServer(rr)),
              );
            }
          } catch {
            // ignore
          }
        }
        setCreatedIssues(collected);
        setBacklogList(collected.filter(i => !i.sprint));
        setBacklogSprint(collected.filter(i => !!i.sprint));
        return;
      }
      const json = await res.json();
      const parsed = json.map((r: any) => parseIssueFromServer(r));
      setCreatedIssues(parsed);
      setBacklogList(parsed.filter((i: Issue) => !i.sprint));
      setBacklogSprint(parsed.filter((i: Issue) => !!i.sprint));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading all issues', err);
    }
  }

  async function createIssueApi(data: typeof issueData) {
    try {
      let boardId = selectedBoardId;
      if (!boardId && createdProject?.id) {
        const b = boardsList.find(bb => bb.project_id === createdProject.id);
        if (b) boardId = b.id;
      }
      if (!boardId) {
        alert('No board selected or available. Create a board first.');
        return;
      }
      const normalized = normalizeStatus(data.status);
      const columnId = findColumnIdForStatus(boardId, normalized);

      const payload: any = {
        board_id: boardId,
        column_id: columnId,
        title: data.summary,
        description: data.description,
        type: String(data.workType || 'task').toLowerCase(),
        status: normalizedToDbStatus(normalized),
        assignee: data.assignee || null,
        reporter: data.reporter || null,
        team: data.team && data.team.length > 0 ? data.team : null,
        labels: data.labels
          ? data.labels
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : null,
        priority: data.priority ? String(data.priority).toLowerCase() : null,
        start_date: data.startDate || null,
        due_date: data.dueDate || null,
        attachments: data.attachment
          ? { filename: data.attachment.name }
          : null,
      };

      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        // eslint-disable-next-line no-console
        console.error('Create issue failed', res.status, txt);
        alert('Failed to create issue');
        return;
      }
      const created = await res.json();
      const parsed = parseIssueFromServer(created);
      if (boardId) {
        await loadIssuesForBoard(boardId);
      } else {
        await loadAllIssuesFallback();
      }
      alert('Issue created');
      // eslint-disable-next-line consistent-return
      return parsed;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error creating issue', err);
      alert('Error creating issue');
    }
  }

  async function updateIssueApi(payloadInput: {
    id: number | string;
    [k: string]: any;
  }) {
    try {
      const { id, ...updates } = payloadInput;
      // eslint-disable-next-line prefer-const
      let finalUpdates: any = { ...updates };
      if (updates.status) {
        const normalized = normalizeStatus(updates.status);
        finalUpdates.status = normalizedToDbStatus(normalized);
        const issue = createdIssues.find(i => String(i.id) === String(id));
        const boardId = issue?.board_id ?? selectedBoardId;
        if (boardId) {
          const colId = findColumnIdForStatus(boardId, normalized);
          if (colId) finalUpdates.column_id = colId;
        }
      }
      if (finalUpdates.type)
        finalUpdates.type = String(finalUpdates.type).toLowerCase();
      if (finalUpdates.priority)
        finalUpdates.priority = String(finalUpdates.priority).toLowerCase();

      const res = await fetch(`${API_BASE}/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUpdates),
      });
      if (!res.ok) {
        const txt = await res.text();
        // eslint-disable-next-line no-console
        console.error('Update issue failed', res.status, txt);
        alert('Failed to update issue');
        return;
      }
      const updated = await res.json();
      const parsed = parseIssueFromServer(updated);
      if (parsed.board_id) {
        await loadIssuesForBoard(parsed.board_id);
      } else if (selectedBoardId) {
        await loadIssuesForBoard(selectedBoardId);
      } else {
        await loadAllIssuesFallback();
      }
      alert('Issue updated');
      // eslint-disable-next-line consistent-return
      return parsed;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating issue', err);
      alert('Error updating issue');
    }
  }

  async function deleteIssueApi(id: number | string) {
    try {
      const res = await fetch(`${API_BASE}/issues/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Delete failed', res.status);
        alert('Failed to delete issue');
        return;
      }
      if (selectedBoardId) await loadIssuesForBoard(selectedBoardId);
      else await loadAllIssuesFallback();
      alert('Issue deleted');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting issue', err);
      alert('Error deleting issue');
    }
  }

  function findColumnIdForStatus(
    boardId: number | string,
    normalizedStatus: string,
  ) {
    const cols = columnsMap[String(boardId)] || [];
    const tryNames = [
      normalizedStatus,
      normalizedStatus.replace('_', ' '),
      normalizedStatus.replace('_', ' ').toUpperCase(),
      normalizedStatus.toUpperCase(),
    ];
    for (const c of cols) {
      const name = String(c.name || '')
        .toUpperCase()
        .trim();
      const normalizedName = name.replace(/\s+/g, '_');
      if (
        tryNames.includes(name) ||
        tryNames.includes(normalizedName) ||
        tryNames.includes(String(c.name))
      ) {
        return c.id;
      }
    }
    return cols.length ? cols[0].id : null;
  }

  async function fetchProjectSummary(projectId: number) {
    try {
      const res = await fetch(
        `${API_BASE}/reports/projects/${projectId}/summary`,
      );
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.warn('Failed to fetch project summary', res.status);
        return null;
      }
      return await res.json();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching project summary', err);
      return null;
    }
  }

  /** ---------- Create / Edit / Delete UI handlers ---------- */
  const resetIssueForm = () => {
    setEditingIssueId(null);
    setIssueData({
      project: createdProject?.name || '',
      workType: '',
      status: 'TODO',
      summary: '',
      description: '',
      assignee: '',
      reporter: '',
      team: [],
      startDate: '',
      dueDate: '',
      priority: '',
      sprint: '',
      storyPoints: '',
      labels: '',
      attachment: null,
    });
  };

  const handleTemplateSelect = (type: 'scrum' | 'kanban') => {
    setSelectedTemplate(type);
    setShowTemplateDialog(true);
  };
  const handleUseTemplate = () => {
    setShowTemplateDialog(false);
    setShowCreateProjectDialog(true);
  };

  const handleCreateProject = async () => {
    if (projectName && selectedTemplate) {
      const keyToSend =
        projectKey ||
        `${projectName
          .split(/\s+/)
          .map(s => s[0])
          .join('')
          .toUpperCase()}`.slice(0, 6);
      await createProjectApi(projectName, keyToSend, selectedTemplate);
      setShowCreateProjectDialog(false);
      setIssueData(prev => ({ ...prev, project: projectName }));
      setProjectName('');
      setProjectKey('');
    } else {
      alert('Provide project name and template');
    }
  };

  const handleIssueFieldChange = (field: string, value: any) => {
    setIssueData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenCreateIssue = () => {
    resetIssueForm();
    setShowCreateIssueDialog(true);
  };

  const handleSubmitIssue = () => {
    // basic validation
    if (!issueData.summary) {
      alert('Summary required');
      return;
    }
    const nowIso = new Date().toISOString();
    const parsedTeam = (issueData.team || []).map((t: string) =>
      emailRegex.test(t) ? { name: nameFromEmail(t), email: t } : { name: t },
    );

    if (editingIssueId !== null) {
      setCreatedIssues(prev =>
        prev.map(issue =>
          String(issue.id) === String(editingIssueId)
            ? ({
                ...issue,
                title: issueData.summary,
                description: issueData.description,
                type: issueData.workType,
                assignee: emailRegex.test(issueData.assignee)
                  ? {
                      name: nameFromEmail(issueData.assignee),
                      email: issueData.assignee,
                    }
                  : issueData.assignee || '',
                reporter: emailRegex.test(issueData.reporter)
                  ? {
                      name: nameFromEmail(issueData.reporter),
                      email: issueData.reporter,
                    }
                  : issueData.reporter || '',
                team: parsedTeam,
                start_date: issueData.startDate || '',
                due_date: issueData.dueDate || '',
                priority: issueData.labels || '',
                status: normalizeStatus(issueData.status),
                labels: issueData.labels || '',
                attachmentUrl: issueData.attachment
                  ? issueData.attachment.name
                  : '',
                storyPoints: issueData.storyPoints
                  ? Number(issueData.storyPoints)
                  : 0,
                sprint: issueData.sprint || '',
                updated_at: nowIso,
              } as Issue)
            : issue,
        ),
      );
      alert('Issue updated');
    } else {
      const newIssue: Issue = {
        id: Date.now(),
        title: issueData.summary,
        description: issueData.description,
        type: issueData.workType || 'Task',
        assignee: issueData.assignee
          ? emailRegex.test(issueData.assignee)
            ? {
                name: nameFromEmail(issueData.assignee),
                email: issueData.assignee,
              }
            : issueData.assignee
          : '',
        reporter: issueData.reporter
          ? emailRegex.test(issueData.reporter)
            ? {
                name: nameFromEmail(issueData.reporter),
                email: issueData.reporter,
              }
            : issueData.reporter
          : '',
        team: parsedTeam,
        parentId: null,
        start_date: issueData.startDate || '',
        due_date: issueData.dueDate || '',
        created_at: nowIso,
        updated_at: nowIso,
        priority: issueData.labels || '',
        status: normalizeStatus(issueData.status),
        labels: issueData.labels || '',
        attachmentUrl: issueData.attachment ? issueData.attachment.name : '',
        storyPoints: issueData.storyPoints ? Number(issueData.storyPoints) : 0,
        sprint: issueData.sprint || '',
      };
      setCreatedIssues(prev => [...prev, newIssue]);
      alert('Issue created');
    }
  };

  // const handleSubmitIssue = async () => {
  //   if (!issueData.summary) {
  //     alert('Summary required');
  //     return;
  //   }

  //   if (editingIssueId !== null) {
  //     const updates: any = {
  //       title: issueData.summary,
  //       description: issueData.description,
  //       type: issueData.workType
  //         ? String(issueData.workType).toLowerCase()
  //         : undefined,
  //       status: issueData.status,
  //       assignee: issueData.assignee || null,
  //       reporter: issueData.reporter || null,
  //       team: issueData.team && issueData.team.length ? issueData.team : null,
  //       start_date: issueData.startDate || null,
  //       due_date: issueData.dueDate || null,
  //       labels: issueData.labels
  //         ? issueData.labels
  //             .split(',')
  //             .map(s => s.trim())
  //             .filter(Boolean)
  //         : null,
  //       priority: issueData.priority ? issueData.priority.toLowerCase() : null,
  //       sprint: issueData.sprint || null,
  //       story_points: issueData.storyPoints
  //         ? Number(issueData.storyPoints)
  //         : null,
  //       attachments: issueData.attachment
  //         ? { filename: issueData.attachment.name }
  //         : null,
  //     };
  //     await updateIssueApi({ id: editingIssueId, ...updates });
  //     setShowCreateIssueDialog(false);
  //     resetIssueForm();
  //     return;
  //   }

  //   const created = await createIssueApi(issueData);
  //   if (created) {
  //     setShowCreateIssueDialog(false);
  //     resetIssueForm();
  //   }
  // };

  // const handleDelete = async (id: number | string) => {
  //   if (!window.confirm('Are you sure you want to delete this issue?')) return;
  //   await deleteIssueApi(id);
  // };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this issue?')) return;
    await deleteIssueApi(id);
    setBacklogList(prev => prev.filter(i => i.id !== id));
    setScrumCounter(prev => prev + 1); // re-fetch trigger
  };

  /** ---------- Drag & drop for board + backlog ---------- */
  // const handleDragEnd = (result: DropResult) => {
  //   if (!result.destination) return;
  //   const { source, destination, draggableId } = result;

  //   const isSprintOrBacklog = (id: string) =>
  //     id === 'sprint' || id === 'backlog';
  //   const isBacklogDrag =
  //     isSprintOrBacklog(source.droppableId) &&
  //     isSprintOrBacklog(destination.droppableId);

  //   // --- Sprint <-> Backlog handling (including same-list reorders) ---
  //   if (isBacklogDrag) {
  //     // same list reorder
  //     if (source.droppableId === destination.droppableId) {
  //       if (source.droppableId === 'sprint') {
  //         const newSprint = Array.from(backlogSprint);
  //         const [moved] = newSprint.splice(source.index, 1);
  //         newSprint.splice(destination.index, 0, moved);
  //         setBacklogSprint(newSprint);
  //       } else {
  //         const newBacklog = Array.from(backlogList);
  //         const [moved] = newBacklog.splice(source.index, 1);
  //         newBacklog.splice(destination.index, 0, moved);
  //         setBacklogList(newBacklog);
  //       }
  //       return;
  //     }

  //     // moving between sprint <-> backlog
  //     const sourceList =
  //       source.droppableId === 'sprint'
  //         ? Array.from(backlogSprint)
  //         : Array.from(backlogList);
  //     const destList =
  //       destination.droppableId === 'sprint'
  //         ? Array.from(backlogSprint)
  //         : Array.from(backlogList);

  //     const [moved] = sourceList.splice(source.index, 1);
  //     destList.splice(destination.index, 0, moved);

  //     // persist state locally first
  //     if (source.droppableId === 'sprint') setBacklogSprint(sourceList);
  //     else setBacklogList(sourceList);

  //     if (destination.droppableId === 'sprint') setBacklogSprint(destList);
  //     else setBacklogList(destList);

  //     // persist sprint change to backend
  //     const sprintVal =
  //       destination.droppableId === 'sprint' ? 'Sprint 1' : null;
  //     updateIssueApi({ id: moved?.id ?? draggableId, sprint: sprintVal })
  //       .then(() => {
  //         if (selectedBoardId) {
  //           loadIssuesForBoard(selectedBoardId);
  //         } else {
  //           loadAllIssuesFallback();
  //         }
  //       })
  //       .catch(err => {
  //         // eslint-disable-next-line no-console
  //         console.error('Failed to persist sprint change', err);
  //       });

  //     return;
  //   }

  //   // --- Normal board column drag ---
  //   const destStatus = destination.droppableId;
  //   const normalized = normalizeStatus(destStatus);
  //   const issueId = draggableId;
  //   const boardId = selectedBoardId;
  //   const column_id = boardId
  //     ? findColumnIdForStatus(boardId, normalized)
  //     : null;

  //   updateIssueApi({ id: issueId, status: normalized, column_id })
  //     .then(() => {
  //       if (selectedBoardId) {
  //         loadIssuesForBoard(selectedBoardId);
  //       } else {
  //         loadAllIssuesFallback();
  //       }
  //     })
  //     .catch(err => {
  //       // eslint-disable-next-line no-console
  //       console.error('Failed to update status', err);
  //     });
  // };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // BACKLOG drag handling: droppableIds 'sprint' and 'backlog'
    const isBacklogDrag =
      source.droppableId === 'sprint' ||
      source.droppableId === 'backlog' ||
      destination.droppableId === 'sprint' ||
      destination.droppableId === 'backlog';

    if (isBacklogDrag) {
      const getList = (id: string) =>
        id === 'sprint' ? Array.from(backlogSprint) : Array.from(backlogList);

      const sourceList = getList(source.droppableId);
      const destList = getList(destination.droppableId);

      const [moved] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, moved);

      if (source.droppableId === 'sprint') setBacklogSprint(sourceList);
      else setBacklogList(sourceList);

      if (destination.droppableId === 'sprint') {
        setBacklogSprint(destList);
        // mark sprint on the underlying issue too
        setCreatedIssues(prev =>
          prev.map(i =>
            String(i.id) === String(moved.id)
              ? {
                  ...i,
                  sprint: 'Sprint 1',
                  updated_at: new Date().toISOString(),
                }
              : i,
          ),
        );
      } else {
        setBacklogList(destList);
        setCreatedIssues(prev =>
          prev.map(i =>
            String(i.id) === String(moved.id)
              ? { ...i, sprint: null, updated_at: new Date().toISOString() }
              : i,
          ),
        );
      }
      return;
    }

    // BOARD drag handling: change status based on droppableId (status lanes)
    const destStatus = result.destination.droppableId;
    setCreatedIssues(prev =>
      prev.map(i =>
        String(i.id) === draggableId
          ? { ...i, status: destStatus, updated_at: new Date().toISOString() }
          : i,
      ),
    );
  };

  /** ---------- Filter & grouping logic ---------- */
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

  const filteredIssues = createdIssues.filter(issue => {
    const searchTermMatch =
      !searchTerm ||
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const assigneeMatch = filters.assignee
      ? typeof issue.assignee === 'string'
        ? issue.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
        : (issue.assignee?.name || '')
            .toLowerCase()
            .includes(filters.assignee.toLowerCase())
      : true;
    const reporterMatch = filters.reporter
      ? typeof issue.reporter === 'string'
        ? issue.reporter.toLowerCase().includes(filters.reporter.toLowerCase())
        : (issue.reporter?.name || '')
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
      ? (issue.labels || '')
          .toLowerCase()
          .includes(filters.labels.toLowerCase())
      : true;
    const dueDateStartMatch = filters.dueDateStart
      ? issue.due_date
        ? new Date(issue.due_date) >= new Date(filters.dueDateStart)
        : false
      : true;
    const dueDateEndMatch = filters.dueDateEnd
      ? issue.due_date
        ? new Date(issue.due_date) <= new Date(filters.dueDateEnd)
        : false
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

  const groupIssues = (issues: Issue[], key: string) => {
    if (key === 'None') return { 'All Issues': issues };
    return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
      let groupName = 'Unassigned';
      if (key === 'status') groupName = normalizeStatus(issue.status);
      else if (key === 'priority') groupName = issue.priority || 'Unassigned';
      else if (key === 'type') groupName = issue.type || 'Unassigned';
      else if (key === 'assignee') {
        const a = parsePersonField(issue.assignee);
        groupName = typeof a === 'string' ? a : a?.name || 'Unassigned';
      } else if (key === 'reporter') {
        const r = parsePersonField(issue.reporter);
        groupName = typeof r === 'string' ? r : r?.name || 'Unassigned';
      } else if (key === 'team') {
        const t = parseTeamField(issue.team);
        groupName = t.length > 0 ? t.map(m => m.name).join(', ') : 'Unassigned';
      }

      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(issue);
      return acc;
    }, {});
  };

  const groupedIssues = groupIssues(filteredIssues, groupBy);

  const calendarEvents = createdIssues
    .filter(i => i.due_date || i.start_date)
    .map(i => ({
      id: String(i.id),
      title: i.title,
      start: i.start_date || i.due_date,
      end: i.due_date || i.start_date,
    }));
  const timelineResources = createdIssues.map(i => ({
    id: String(i.id),
    title: i.title,
  }));

  useEffect(() => {
    const total = createdIssues.length;
    const open = createdIssues.filter(
      i => normalizeStatus(i.status) !== 'DONE',
    ).length;
    const closed = total - open;
    const highPriority = createdIssues.filter(
      i => String(i.priority).toUpperCase() === 'HIGH',
    ).length;
    const types = issueTypes.map(t => ({
      type: t,
      count: createdIssues.filter(i => i.type === t).length,
    }));
    const prioritiesAgg = ['HIGH', 'MEDIUM', 'LOW'].map(p => ({
      priority: p,
      count: createdIssues.filter(i => String(i.priority).toUpperCase() === p)
        .length,
    }));

    setSummary({
      total,
      open,
      closed,
      highPriority,
      types,
      priorities: prioritiesAgg,
    });
  }, [createdIssues]);

  const renderPersonChip = (field: PersonOrString) => {
    if (!field) return null;
    if (typeof field === 'string') {
      return (
        <Chip
          avatar={<Avatar>{String(field)[0]?.toUpperCase() || '?'}</Avatar>}
          label={field}
          size="small"
        />
      );
    }
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
      return (
        <Chip
          avatar={<Avatar>{teamField[0]?.toUpperCase()}</Avatar>}
          label={teamField}
          size="small"
        />
      );
    }
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        {(teamField as UserRef[]).map(member => (
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

  const handleEdit = (issue: Issue): void => {
    setEditingIssueId(issue.id);

    const personToString = (p: any) => {
      if (!p) return '';
      if (typeof p === 'string') return p;
      // object-like (guard null)
      return (p?.email || p?.name || '') as string;
    };

    const teamToArray = (t: any) => {
      if (!t) return [];
      if (Array.isArray(t))
        return (t as any[])
          .filter(Boolean)
          .map(m => m?.email || m?.name || '')
          .filter(Boolean);
      if (typeof t === 'string') return [t];
      return [];
    };

    setIssueData({
      project: createdProject?.name || '',
      workType: issue.type || '',
      status: issue.status || 'TODO',
      summary: issue.title || '',
      description: issue.description || '',
      assignee: personToString(issue.assignee),
      reporter: personToString(issue.reporter),
      team: teamToArray(issue.team),
      startDate: issue.start_date || '',
      dueDate: issue.due_date || '',
      priority: issue.priority || '',
      sprint: issue.sprint || '',
      storyPoints: issue.storyPoints ? String(issue.storyPoints) : '',
      labels: issue.labels || '',
      attachment: null,
    });

    setShowCreateIssueDialog(true);
  };

  /** ---------- Backlog create handler (NOW persists to backend) ---------- */
  const handleBacklogCreate = async () => {
    if (!newBacklogItem.title) {
      alert('Title required');
      return;
    }
    const payload = {
      project: createdProject?.name || '',
      workType: newBacklogItem.workType,
      status: 'TODO',
      summary: newBacklogItem.title,
      description: '',
      assignee: newBacklogItem.assignee || '',
      reporter: '',
      team: [],
      startDate: '',
      dueDate: newBacklogItem.dueDate || '',
      priority: '',
      sprint: '',
      storyPoints: '',
      labels: '',
      attachment: null,
    };
    const created = await createIssueApi(payload as any);
    if (created) {
      setNewBacklogItem({
        workType: 'Story',
        title: '',
        dueDate: '',
        assignee: '',
      });
      setShowBacklogForm(false);
      setScrumCounter(prev => prev + 1);
    } else {
      alert('Failed to create backlog item');
    }
  };

  useEffect(() => {
    (async () => {
      await loadProjects();
      await loadBoards();
      if (selectedBoardId) {
        await loadColumns(selectedBoardId);
        await loadIssuesForBoard(selectedBoardId);
      } else {
        await loadAllIssuesFallback();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedBoardId) return;
    loadColumns(selectedBoardId);
    loadIssuesForBoard(selectedBoardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoardId]);

  useEffect(() => {
    (async () => {
      if (createdProject?.id) {
        const s = await fetchProjectSummary(createdProject.id);
        if (s) {
          setSummary(prev => ({
            total: s.total ?? prev?.total ?? 0,
            open: s.total - (s.completed ?? 0),
            closed: s.completed ?? prev?.closed ?? 0,
            highPriority: prev?.highPriority ?? 0,
            types:
              s.byType?.map((r: any) => ({
                type: r.type,
                count: Number(r.count),
              })) ??
              prev?.types ??
              [],
            priorities: prev?.priorities ?? [],
          }));
        }
      }
    })();
  }, [createdProject]);

  return (
    <Page themeId="tool">
      <Header
        title="Welcome to Jira-like Project!"
        subtitle="Backstage plugin demo"
      >
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>

      <Content>
        {/* REPLACED static title with a button that opens Template Selection */}
        <ContentHeader title="">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowTemplateSelection(true)}
          >
            Project Templates
          </Button>
          <SupportButton>Click to choose a project template.</SupportButton>
        </ContentHeader>

        {!createdProject && (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    setSelectedTemplate('scrum');
                    setShowTemplateDialog(true);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">Scrum Template</Typography>
                    <Typography variant="body2">
                      For iterative, sprint-based work.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    setSelectedTemplate('kanban');
                    setShowTemplateDialog(true);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">Kanban Template</Typography>
                    <Typography variant="body2">
                      For continuous work tracking.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        )}

        {createdProject && (
          <>
            <ContentHeader title={createdProject.name}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <TextField
                  select
                  label="Board"
                  size="small"
                  value={selectedBoardId ?? ''}
                  onChange={e => setSelectedBoardId(Number(e.target.value))}
                >
                  <MenuItem value="">Select board</MenuItem>
                  {boardsList
                    .filter(b => b.project_id === createdProject.id)
                    .map(b => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.name}
                      </MenuItem>
                    ))}
                </TextField>

                <IconButton onClick={handleOpenCreateIssue}>
                  <Add /> +Create
                </IconButton>
              </div>
            </ContentHeader>

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v as any)}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab value="summary" label="Summary View" />
              <Tab value="timeline" label="Timeline" />
              {createdProject.type === 'scrum' && (
                <Tab value="backlog" label="Backlog" />
              )}
              <Tab value="board" label="Board View" />
              <Tab value="calendar" label="Calendar" />
              <Tab value="list" label="List View" />
              <Tab value="allwork" label="All Work" />
            </Tabs>

            {tab === 'summary' && (
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">Summary (server + local)</Typography>
                </Grid>

                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>📊 {summary?.total ?? 0} total</strong>
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
                        <strong>🟡 {summary?.open ?? 0} open</strong>
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
                        <strong>✅ {summary?.closed ?? 0} closed</strong>
                        <br />
                        Done
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <strong>
                          🔥 {summary?.highPriority ?? 0} high priority
                        </strong>
                        <br />
                        Priority = HIGH
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} style={{ marginTop: 12 }}>
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

                <Grid item xs={12} style={{ marginTop: 12 }}>
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

                <Grid item xs={12} style={{ marginTop: 12 }}>
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
              </Grid>
            )}

            {tab === 'board' && (
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  {statusesList.map(status => (
                    <Grid item xs={12} sm={6} md={3} key={status.value}>
                      <Paper elevation={3} style={{ padding: 16 }}>
                        <Typography
                          variant="h6"
                          style={{ marginBottom: 12, textAlign: 'center' }}
                        >
                          {status.label} (
                          {
                            createdIssues.filter(
                              i => normalizeStatus(i.status) === status.value,
                            ).length
                          }
                          )
                        </Typography>
                        <Droppable droppableId={status.value}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                background: snapshot.isDraggingOver
                                  ? 'lightgray'
                                  : '#f4f5f7',
                                padding: 8,
                                borderRadius: 4,
                                minHeight: 300,
                              }}
                            >
                              {createdIssues
                                .filter(
                                  i =>
                                    normalizeStatus(i.status) === status.value,
                                )
                                .map((issue, index) => (
                                  <Draggable
                                    key={String(issue.id)}
                                    draggableId={String(issue.id)}
                                    index={index}
                                  >
                                    {prov => (
                                      <Card
                                        ref={prov.innerRef}
                                        {...prov.draggableProps}
                                        {...prov.dragHandleProps}
                                        style={{
                                          marginBottom: 8,
                                          cursor: 'pointer',
                                          ...prov.draggableProps.style,
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
                                                label={issue.priority || 'N/A'}
                                                size="small"
                                                style={{
                                                  backgroundColor:
                                                    PRIORITY_COLORS[
                                                      issue.priority?.toUpperCase() ||
                                                        'LOW'
                                                    ] || 'gray',
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

            {tab === 'backlog' && createdProject?.type === 'scrum' && (
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  {/* ----------------- Sprint Column ----------------- */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <Typography variant="h6">Sprint</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="caption" color="textSecondary">
                            (drag items here to include in sprint)
                          </Typography>
                        </Grid>
                      </Grid>

                      <Droppable droppableId="sprint">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              background: snapshot.isDraggingOver
                                ? 'lightgray'
                                : '#f4f5f7',
                              padding: 8,
                              minHeight: 360,
                              marginTop: 12,
                            }}
                          >
                            {backlogSprint.map((issue, index) => (
                              <Draggable
                                key={String(issue.id)}
                                draggableId={String(issue.id)}
                                index={index}
                              >
                                {prov => (
                                  <Card
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                    style={{
                                      marginBottom: 8,
                                      cursor: 'grab',
                                      ...prov.draggableProps.style,
                                    }}
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        {issue.type} — {String(issue.id)}
                                      </Typography>
                                      <Typography variant="h6" noWrap>
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

                  {/* ----------------- Backlog Column ----------------- */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <Typography variant="h6">Backlog</Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setShowBacklogForm(prev => !prev)}
                            size="small"
                          >
                            Create
                          </Button>
                        </Grid>
                      </Grid>

                      {/* --- Backlog Create Form --- */}
                      {showBacklogForm && (
                        <div
                          style={{
                            marginTop: 12,
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <TextField
                            select
                            label="Work Type"
                            value={newBacklogItem.workType}
                            onChange={e =>
                              setNewBacklogItem(prev => ({
                                ...prev,
                                workType: e.target.value,
                              }))
                            }
                            size="small"
                            style={{ minWidth: 140 }}
                          >
                            {workTypesScrum.map(t => (
                              <MenuItem key={t} value={t}>
                                {t}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            label="Title"
                            value={newBacklogItem.title}
                            onChange={e =>
                              setNewBacklogItem(prev => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            size="small"
                            style={{ minWidth: 220 }}
                          />

                          <TextField
                            type="date"
                            label="Due"
                            InputLabelProps={{ shrink: true }}
                            value={newBacklogItem.dueDate}
                            onChange={e =>
                              setNewBacklogItem(prev => ({
                                ...prev,
                                dueDate: e.target.value,
                              }))
                            }
                            size="small"
                          />

                          <TextField
                            label="Assignee"
                            value={newBacklogItem.assignee}
                            onChange={e =>
                              setNewBacklogItem(prev => ({
                                ...prev,
                                assignee: e.target.value,
                              }))
                            }
                            size="small"
                            placeholder="name or email"
                            style={{ minWidth: 160 }}
                          />

                          <div>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleBacklogCreate}
                              size="small"
                            >
                              Create
                            </Button>
                            <Button
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                setShowBacklogForm(false);
                                setNewBacklogItem({
                                  workType: 'Story',
                                  title: '',
                                  dueDate: '',
                                  assignee: '',
                                });
                              }}
                              size="small"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* --- Backlog List --- */}
                      <Droppable droppableId="backlog">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              background: snapshot.isDraggingOver
                                ? 'lightgray'
                                : '#f4f5f7',
                              padding: 8,
                              minHeight: 360,
                              marginTop: 12,
                            }}
                          >
                            {backlogList.map((issue, index) => (
                              <Draggable
                                key={String(issue.id)}
                                draggableId={String(issue.id)}
                                index={index}
                              >
                                {prov => (
                                  <Card
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                    style={{
                                      marginBottom: 8,
                                      cursor: 'grab',
                                      ...prov.draggableProps.style,
                                    }}
                                  >
                                    <CardContent>
                                      <Grid
                                        container
                                        alignItems="center"
                                        justifyContent="space-between"
                                      >
                                        <Grid item xs>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {issue.type} — {String(issue.id)}
                                          </Typography>
                                          <Typography variant="h6" noWrap>
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
                                        </Grid>
                                        <Grid item>
                                          <IconButton
                                            size="small"
                                            onClick={() => handleEdit(issue)}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleDelete(String(issue.id))
                                            }
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
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
                </DragDropContext>
              </Grid>
            )}

            {tab === 'list' && (
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                {showFilters && (
                  <Grid item xs={12} sm={3}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                      <Typography variant="h6" gutterBottom>
                        Filters
                      </Typography>
                      <Divider style={{ margin: '8px 0' }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <Grid container spacing={1}>
                        {statusesList.map(s => (
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

                      <Divider style={{ margin: '12px 0' }} />
                      <Typography variant="subtitle2">Due Date</Typography>
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

                      <Divider style={{ margin: '12px 0' }} />
                      <Typography variant="subtitle2">Assignee</Typography>
                      <TextField
                        placeholder="Search by name or email"
                        fullWidth
                        value={filters.assignee}
                        onChange={e =>
                          handleFilterChange('assignee', e.target.value)
                        }
                      />

                      <Divider style={{ margin: '12px 0' }} />
                      <Typography variant="subtitle2">Reporter</Typography>
                      <TextField
                        placeholder="Search by name or email"
                        fullWidth
                        value={filters.reporter}
                        onChange={e =>
                          handleFilterChange('reporter', e.target.value)
                        }
                      />

                      <Divider style={{ margin: '12px 0' }} />
                      <Typography variant="subtitle2">Work Type</Typography>
                      <Grid container spacing={1}>
                        {issueTypes.map(t => (
                          <Grid item key={t}>
                            <Chip
                              label={t}
                              clickable
                              onClick={() => handleWorkTypeFilterChange(t)}
                              color={
                                filters.workType.includes(t)
                                  ? 'primary'
                                  : 'default'
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>

                      <Divider style={{ margin: '12px 0' }} />
                      <Typography variant="subtitle2">Labels</Typography>
                      <TextField
                        placeholder="Search labels"
                        fullWidth
                        value={filters.labels}
                        onChange={e =>
                          handleFilterChange('labels', e.target.value)
                        }
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
                        onClick={() => setShowFilters(prev => !prev)}
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
                        onChange={e => setGroupBy(e.target.value as any)}
                        variant="outlined"
                        size="small"
                        label="Group by"
                        style={{ width: 160 }}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="assignee">Assignee</MenuItem>
                        <MenuItem value="reporter">Reporter</MenuItem>
                        <MenuItem value="team">Team</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="type">Type</MenuItem>
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
                            <TableCell />
                            <TableCell>Key</TableCell>
                            <TableCell>Summary</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Reporter</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>

                        {groupBy === 'None' ? (
                          <TableBody>
                            {filteredIssues.map(issue => (
                              <TableRow key={String(issue.id)} hover>
                                <TableCell>
                                  <Checkbox />
                                </TableCell>
                                <TableCell>{`PROJ-${String(
                                  issue.id,
                                )}`}</TableCell>
                                <TableCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
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
                                      statusesList.find(
                                        s =>
                                          s.value ===
                                          normalizeStatus(issue.status),
                                      )?.label || normalizeStatus(issue.status)
                                    }
                                    size="small"
                                    style={{
                                      backgroundColor:
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
                                      backgroundColor:
                                        PRIORITY_COLORS[
                                          issue.priority?.toUpperCase() || 'LOW'
                                        ] || 'gray',
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
                                  <Button size="small" variant="outlined">
                                    Add Comment
                                  </Button>
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton onClick={() => handleEdit(issue)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleDelete(String(issue.id))
                                    }
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
                          Object.keys(groupedIssues).map(groupName => (
                            <TableBody key={groupName}>
                              <TableRow>
                                <TableCell
                                  colSpan={12}
                                  style={{
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {groupName} ({groupedIssues[groupName].length}
                                  )
                                </TableCell>
                              </TableRow>
                              {groupedIssues[groupName].map(issue => (
                                <TableRow key={String(issue.id)} hover>
                                  <TableCell>
                                    <Checkbox />
                                  </TableCell>
                                  <TableCell>{`PROJ-${String(
                                    issue.id,
                                  )}`}</TableCell>
                                  <TableCell>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
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
                                        statusesList.find(
                                          s =>
                                            s.value ===
                                            normalizeStatus(issue.status),
                                        )?.label ||
                                        normalizeStatus(issue.status)
                                      }
                                      size="small"
                                      style={{
                                        backgroundColor:
                                          normalizeStatus(issue.status) ===
                                          'DONE'
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
                                        backgroundColor:
                                          PRIORITY_COLORS[
                                            issue.priority?.toUpperCase() ||
                                              'LOW'
                                          ] || 'gray',
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
                                    <Button size="small" variant="outlined">
                                      Add Comment
                                    </Button>
                                  </TableCell>
                                  <TableCell align="right">
                                    <IconButton
                                      onClick={() => handleEdit(issue)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        handleDelete(String(issue.id))
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
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

            {tab === 'allwork' && (
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={12}>
                  <Paper style={{ padding: 16, borderRadius: 8 }}>
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
                        style={{ marginRight: 16, width: 320 }}
                      />
                      <div style={{ flexGrow: 1 }} />
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={groupBy}
                        onChange={e => setGroupBy(e.target.value as any)}
                        label="Group by"
                        style={{ marginRight: 8 }}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="assignee">Assignee</MenuItem>
                        <MenuItem value="reporter">Reporter</MenuItem>
                        <MenuItem value="team">Team</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="type">Type</MenuItem>
                      </TextField>
                    </Toolbar>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>All Work</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Reporter</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(groupedIssues).map(
                            ([groupName, issues]) => (
                              <React.Fragment key={groupName}>
                                <TableRow>
                                  <TableCell
                                    colSpan={11}
                                    style={{
                                      backgroundColor: '#f5f5f5',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {groupName} ({issues.length})
                                  </TableCell>
                                </TableRow>
                                {issues.map(issue => (
                                  <TableRow key={String(issue.id)}>
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
                                          >{`PROJECT-${String(
                                            issue.id,
                                          )}`}</Typography>
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
                                          backgroundColor:
                                            PRIORITY_COLORS[
                                              issue.priority?.toUpperCase() ||
                                                'LOW'
                                            ],
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
                                        startIcon={<Add />}
                                        onClick={() =>
                                          alert(
                                            'Open comment UI (not implemented)',
                                          )
                                        }
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
                                          onClick={() =>
                                            handleDelete(String(issue.id))
                                          }
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
                              colSpan={11}
                              style={{ borderBottom: 'none' }}
                            >
                              <Button
                                onClick={handleOpenCreateIssue}
                                color="primary"
                                startIcon={<Add />}
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

            {tab === 'calendar' && (
              <Grid item style={{ marginTop: 16 }}>
                <Typography variant="h6" style={{ marginBottom: 16 }}>
                  Calendar View
                </Typography>
                <div
                  style={{ background: 'white', padding: 16, borderRadius: 8 }}
                >
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={calendarEvents}
                    eventClick={(info: EventClickArg) => {
                      const issue = createdIssues.find(
                        i => String(i.id) === info.event.id,
                      );
                      if (issue) handleEdit(issue);
                    }}
                    height="auto"
                  />
                </div>
              </Grid>
            )}

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
                      resources: timelineResources,
                      events: createdIssues
                        .filter(issue => issue.start_date && issue.due_date)
                        .map(issue => ({
                          id: issue.id.toString(),
                          resourceId: issue.id.toString(),
                          title: `${issue.title} (${
                            typeof issue.assignee === 'object'
                              ? (issue.assignee as UserRef).name
                              : issue.assignee
                          })`,
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
          </>
        )}
      </Content>

      {/* Template Selection Dialog (NEW) */}
      <Dialog
        open={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
      >
        <DialogTitle>Select a Project Template</DialogTitle>
        <DialogContent>
          <List>
            <ListItem
              button
              onClick={() => {
                setSelectedTemplate('scrum');
                setShowTemplateSelection(false);
                setShowTemplateDialog(true);
              }}
            >
              <ListItemText
                primary="Scrum"
                secondary="Plan sprints and track progress in iterations"
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setSelectedTemplate('kanban');
                setShowTemplateSelection(false);
                setShowTemplateDialog(true);
              }}
            >
              <ListItemText
                primary="Kanban"
                secondary="Track work items in a continuous flow"
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setSelectedTemplate('kanban');
                setShowTemplateSelection(false);
                setShowTemplateDialog(true);
              }}
            >
              <ListItemText
                primary="Bug Tracking (Kanban)"
                secondary="Focused Kanban board for bug triage"
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setSelectedTemplate('kanban');
                setShowTemplateSelection(false);
                setShowTemplateDialog(true);
              }}
            >
              <ListItemText
                primary="Custom"
                secondary="Customize your board and workflow"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplateSelection(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template info dialog (kept) */}
      <Dialog
        open={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
      >
        <DialogTitle>
          {selectedTemplate === 'scrum' ? 'Scrum Template' : 'Kanban Template'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedTemplate === 'scrum'
              ? 'Scrum is an agile methodology for iterative, sprint-based development.'
              : 'Kanban is a continuous workflow methodology for work tracking.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
          <Button color="primary" onClick={handleUseTemplate}>
            Use Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create project dialog */}
      <Dialog
        open={showCreateProjectDialog}
        onClose={() => setShowCreateProjectDialog(false)}
      >
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
          <TextField
            label="Project Key"
            fullWidth
            margin="normal"
            value={projectKey}
            onChange={e => setProjectKey(e.target.value)}
          />
          <TextField
            select
            label="Template"
            fullWidth
            margin="normal"
            value={selectedTemplate ?? ''}
            onChange={e => setSelectedTemplate(e.target.value as any)}
          >
            <MenuItem value="scrum">Scrum</MenuItem>
            <MenuItem value="kanban">Kanban</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateProjectDialog(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Issue dialog */}
      <Dialog
        open={showCreateIssueDialog}
        onClose={() => {
          setShowCreateIssueDialog(false);
          resetIssueForm();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingIssueId ? 'Edit Issue' : 'Create Issue'}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Project"
            fullWidth
            margin="normal"
            value={issueData.project}
            onChange={e => handleIssueFieldChange('project', e.target.value)}
          >
            {projectsList.map(p => (
              <MenuItem key={p.id} value={p.name}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Work Type"
            fullWidth
            margin="normal"
            value={issueData.workType}
            onChange={e => handleIssueFieldChange('workType', e.target.value)}
          >
            {(createdProject?.type === 'kanban'
              ? workTypesKanban
              : workTypesScrum
            ).map(t => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={issueData.status}
            onChange={e => handleIssueFieldChange('status', e.target.value)}
          >
            {statusesList.map(s => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Summary"
            fullWidth
            margin="normal"
            value={issueData.summary}
            onChange={e => handleIssueFieldChange('summary', e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={issueData.description}
            onChange={e =>
              handleIssueFieldChange('description', e.target.value)
            }
          />
          <TextField
            label="Assignee (email)"
            fullWidth
            margin="normal"
            value={issueData.assignee}
            onChange={e => handleIssueFieldChange('assignee', e.target.value)}
          />
          <TextField
            label="Reporter (email)"
            fullWidth
            margin="normal"
            value={issueData.reporter}
            onChange={e => handleIssueFieldChange('reporter', e.target.value)}
          />
          <TextField
            label="Team (comma separated emails)"
            fullWidth
            margin="normal"
            value={issueData.team.join(', ')}
            onChange={e =>
              handleIssueFieldChange(
                'team',
                e.target.value.split(',').map((s: string) => s.trim()),
              )
            }
          />
          <TextField
            type="date"
            label="Start Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={issueData.startDate}
            onChange={e => handleIssueFieldChange('startDate', e.target.value)}
          />
          <TextField
            type="date"
            label="Due Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={issueData.dueDate}
            onChange={e => handleIssueFieldChange('dueDate', e.target.value)}
          />
          {createdProject?.type === 'scrum' && (
            <TextField
              select
              label="Sprint"
              fullWidth
              margin="normal"
              value={issueData.sprint}
              onChange={e => handleIssueFieldChange('sprint', e.target.value)}
            >
              {sprints.map(s => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            label="Story Point Estimate"
            fullWidth
            margin="normal"
            value={issueData.storyPoints}
            onChange={e =>
              handleIssueFieldChange('storyPoints', e.target.value)
            }
          />
          <TextField
            label="Labels (priority or freeform)"
            fullWidth
            margin="normal"
            value={issueData.labels}
            onChange={e => handleIssueFieldChange('labels', e.target.value)}
          />
          <input
            type="file"
            style={{ marginTop: 12 }}
            onChange={e =>
              handleIssueFieldChange(
                'attachment',
                e.target.files ? e.target.files[0] : null,
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowCreateIssueDialog(false);
              resetIssueForm();
            }}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmitIssue}>
            {editingIssueId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};
