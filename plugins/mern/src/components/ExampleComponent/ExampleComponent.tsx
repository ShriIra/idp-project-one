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


// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
// } from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import {
//   InfoCard,
//   Header,
//   Page,
//   Content,
//   ContentHeader,
//   HeaderLabel,
// } from '@backstage/core-components';

// export const ExampleComponent = () => {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState(1);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [projectName, setProjectName] = useState('');
//   const [projectKey, setProjectKey] = useState('');
//   const [teammates, setTeammates] = useState('');
//   const [editProjectId, setEditProjectId] = useState<string | null>(null);

//   const apiBase = 'http://localhost:7007/api/mern/projects';

//   // Fetch projects from backend
//   const fetchProjects = async () => {
//     try {
//       const res = await fetch(apiBase);
//       const data = await res.json();
//       setProjects(data);
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.error('Error fetching projects:', err);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Step 2 → Create or update project
//   const handleSaveProject = async () => {
//     if (!projectName || !projectKey) return;

//     try {
//       if (editProjectId) {
//         // Update project
//         await fetch(`${apiBase}/${editProjectId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: projectName,
//             project_key: projectKey,
//           }),
//         });
//       } else {
//         // Create project
//         const res = await fetch(apiBase, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: projectName,
//             project_key: projectKey,
//             template: 'kanban',
//           }),
//         });

//         if (!res.ok) throw new Error('Failed to create project');
//       }

//       await fetchProjects();
//       setStep(3);
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.error('Error saving project:', err);
//     }
//   };

//   // Delete project
//   const handleDeleteProject = async (id: string) => {
//     try {
//       await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
//       await fetchProjects();
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.error('Error deleting project:', err);
//     }
//   };

//   // Edit project
//   const handleEditProject = (project: any) => {
//     setEditProjectId(project.id);
//     setProjectName(project.name);
//     setProjectKey(project.project_key);
//     setStep(2);
//     setOpen(true);
//   };

//   // Step 3 → Invite teammates
//   const handleInviteContinue = () => {
//     // TODO: integrate invite API if needed
//     setOpen(false);
//     setStep(1);
//     setProjectName('');
//     setProjectKey('');
//     setTeammates('');
//     setEditProjectId(null);
//   };

//   return (
//     <Page themeId="tool">
//       <Header title="Welcome to mern!" subtitle="Optional subtitle">
//         <HeaderLabel label="Owner" value="Team X" />
//         <HeaderLabel label="Lifecycle" value="Alpha" />
//       </Header>
//       <Content>
//         <ContentHeader title="Projects">
//           <IconButton
//             color="primary"
//             onClick={() => {
//               setOpen(true);
//               setStep(1);
//               setEditProjectId(null);
//             }}
//           >
//             <AddIcon />
//           </IconButton>
//         </ContentHeader>

//         <Grid container spacing={3} direction="column">
//           <Grid item>
//             <InfoCard title="Project List">
//               {projects.length === 0 ? (
//                 <Typography>No projects created yet.</Typography>
//               ) : (
//                 <List>
//                   {projects.map(project => (
//                     <ListItem key={project.id} divider>
//                       <ListItemText
//                         primary={project.name}
//                         secondary={`Key: ${project.project_key}`}
//                       />
//                       <ListItemSecondaryAction>
//                         <IconButton
//                           edge="end"
//                           onClick={() => handleEditProject(project)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton
//                           edge="end"
//                           onClick={() => handleDeleteProject(project.id)}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </ListItemSecondaryAction>
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </InfoCard>
//           </Grid>
//         </Grid>

//         {/* Popup Dialog */}
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           {/* Step 1: Kanban template */}
//           {step === 1 && (
//             <>
//               <DialogTitle>Kanban</DialogTitle>
//               <DialogContent>
//                 <Typography gutterBottom>
//                   Kanban (the Japanese word for "visual signal") is all about
//                   helping teams visualize their work, limit work currently in
//                   progress, and maximize efficiency. Use the Kanban template to
//                   increase planning flexibility, reduce bottlenecks and promote
//                   transparency throughout the development cycle.
//                 </Typography>
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => setStep(2)}
//                 >
//                   Use Template
//                 </Button>
//               </DialogActions>
//             </>
//           )}

//           {/* Step 2: Add / Edit project details */}
//           {step === 2 && (
//             <>
//               <DialogTitle>
//                 {editProjectId ? 'Edit project details' : 'Add project details'}
//               </DialogTitle>
//               <DialogContent>
//                 <TextField
//                   label="Name"
//                   fullWidth
//                   margin="normal"
//                   value={projectName}
//                   onChange={e => setProjectName(e.target.value)}
//                 />
//                 <TextField
//                   label="Key"
//                   fullWidth
//                   margin="normal"
//                   value={projectKey}
//                   onChange={e => setProjectKey(e.target.value)}
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setOpen(false)} color="secondary">
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSaveProject}
//                 >
//                   {editProjectId ? 'Update Project' : 'Create Project'}
//                 </Button>
//               </DialogActions>
//             </>
//           )}

//           Step 3: Invite teammates
//           {step === 3 && (
//             <>
//               <DialogTitle>Bring the team with you</DialogTitle>
//               <DialogContent>
//                 <Typography gutterBottom>
//                   Invite teammates to your project.
//                 </Typography>
//                 <TextField
//                   label="Enter names or emails (comma separated)"
//                   fullWidth
//                   margin="normal"
//                   value={teammates}
//                   onChange={e => setTeammates(e.target.value)}
//                 />
//               </DialogContent>
//               <Divider />
//               <DialogActions>
//                 <Button onClick={handleInviteContinue}>Skip</Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleInviteContinue}
//                 >
//                   Invite & Continue
//                 </Button>
//               </DialogActions>
//             </>
//           )}
//         </Dialog>
//       </Content>
//     </Page>
//   );
// };

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
} from '@backstage/core-components';

export const ExampleComponent = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [teammates, setTeammates] = useState<{ name_or_email: string; role: string }[]>([]);
  const [inviteInput, setInviteInput] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:7007/api/mern/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create project
  const handleCreateProject = async () => {
    if (!projectName || !projectKey) return;

    try {
      const res = await fetch('http://localhost:7007/api/mern/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          project_key: projectKey,
          template: 'kanban',
        }),
      });

      if (!res.ok) throw new Error('Failed to create project');

      const newProject = await res.json();
      setProjects(prev => [newProject, ...prev]);
      setStep(3);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error creating project:', err);
    }
  };

  // Update project
  const handleUpdateProject = async (id: string) => {
    try {
      // eslint-disable-next-line no-alert
      const updatedName = prompt('Enter new project name:');
      if (!updatedName) return;

      const res = await fetch(`http://localhost:7007/api/mern/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedName }),
      });

      if (!res.ok) throw new Error('Failed to update project');
      await fetchProjects();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating project:', err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`http://localhost:7007/api/mern/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error deleting project:', err);
    }
  };

  // Add teammate locally
  const handleAddTeammate = () => {
    if (!inviteInput.trim()) return;
    setTeammates(prev => [...prev, { name_or_email: inviteInput.trim(), role: inviteRole }]);
    setInviteInput('');
    setInviteRole('Member');
  };

  // Invite teammates
  const handleInviteContinue = async () => {
    try {
      if (teammates.length > 0 && projects.length > 0) {
        await fetch(
          `http://localhost:7007/api/mern/projects/${projects[0].id}/invite`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teammates }),
          },
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error inviting teammates:', err);
    } finally {
      setOpen(false);
      setStep(1);
      setProjectName('');
      setProjectKey('');
      setTeammates([]);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Welcome to mern!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Projects">
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </ContentHeader>

        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Project List">
              {projects.length === 0 ? (
                <Typography>No projects created yet.</Typography>
              ) : (
                <List>
                  {projects.map(proj => (
                    <ListItem key={proj.id} divider>
                      <ListItemText
                        primary={proj.name}
                        secondary={`Key: ${proj.project_key}`}
                      />
                      <Tooltip title="Update Project">
                        <IconButton color="primary" onClick={() => handleUpdateProject(proj.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Project">
                        <IconButton color="secondary" onClick={() => handleDeleteProject(proj.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              )}
            </InfoCard>
          </Grid>
        </Grid>

        {/* Popup Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          {/* Step 1: Template */}
          {step === 1 && (
            <>
              <DialogTitle>Kanban</DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                  Kanban (the Japanese word for "visual signal") helps teams visualize work,
                  reduce bottlenecks, and promote transparency.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={() => setStep(2)}>
                  Use Template
                </Button>
              </DialogActions>
            </>
          )}

          {/* Step 2: Project details */}
          {step === 2 && (
            <>
              <DialogTitle>Add project details</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  fullWidth
                  margin="normal"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                />
                <TextField
                  label="Key"
                  fullWidth
                  margin="normal"
                  value={projectKey}
                  onChange={e => setProjectKey(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleCreateProject}>
                  Create Project
                </Button>
              </DialogActions>
            </>
          )}

          {/* Step 3: Invite teammates */}
          {step === 3 && (
            <>
              <DialogTitle>Bring the team with you</DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                  Invite teammates to your project and collaborate together.
                </Typography>

                {/* Input for name/email */}
                <TextField
                  label="Enter Names or Email"
                  fullWidth
                  margin="normal"
                  value={inviteInput}
                  onChange={e => setInviteInput(e.target.value)}
                />

                {/* Role dropdown */}
                <TextField
                  select
                  label="Role"
                  fullWidth
                  margin="normal"
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                >
                  <MenuItem value="Administrator">Administrator</MenuItem>
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Viewer">Viewer</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddTeammate}
                  style={{ marginTop: '10px' }}
                >
                  Add Teammate
                </Button>

                {/* Teammates List */}
                {teammates.length > 0 && (
                  <List>
                    {teammates.map((tm, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={tm.name_or_email}
                          secondary={`Role: ${tm.role}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </DialogContent>
              <Divider />
              <DialogActions>
                <Button onClick={handleInviteContinue}>Skip</Button>
                <Button variant="contained" color="primary" onClick={handleInviteContinue}>
                  Invite & Continue
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Content>
    </Page>
  );
};
