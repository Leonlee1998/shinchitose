
export enum ProjectStatus {
  PLANNING = '規劃中',
  ONGOING = '進行中',
  COMPLETED = '完成',
  ON_HOLD = '暫停'
}

export enum TaskStatus {
  TODO = 'Todo',
  DOING = 'Doing',
  DONE = 'Done'
}

export enum Priority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高'
}

export enum UserRole {
  OWNER = 'Owner',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

export enum SocialStatus {
  DRAFT = '草稿',
  SCHEDULED = '排程',
  PUBLISHED = '已發布'
}

export enum DocumentType {
  PROPOSAL = '提案',
  SPECIFICATION = '規格',
  PRESENTATION = '簡報'
}

export interface ProjectMember {
  gmail: string;
  role: UserRole;
  status: 'Active' | 'Pending';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  deadline: string; // Due Date
  ownerId: string;
  progress: number;
  members: ProjectMember[];
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assignee?: string;
  meetingId?: string; // Relation to meeting
  relatedDocId?: string; // Relation to document
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  time: string; // meetingDateTime
  duration: string;
  link: string;
  attendees: string[];
  type: string; // meetingType
  remarks: string;
  decisionContent: string;
  decisionReason: string;
  decisionMaker: string;
  decisionTime: string;
  isCompleted: boolean;
}

export interface Document {
  id: string;
  name: string;              // Document Name (required)
  projectId: string;         // Project Id (required)
  documentType?: string;     // Document Type (optional)
  type?: DocumentType;       // Type: "提案" | "規格" | "簡報" (optional)
  fileUrl?: string;          // File Url (optional)
  fileSize?: string;         // File Size (optional)
  uploadedBy?: string;       // Uploaded By (optional)
  version?: string;          // Version (optional)
  relatedTaskIds?: string;   // Related Task Ids (optional)
}

export interface SocialContent {
  id: string;
  projectId: string;
  title: string;
  content: string;
  platform: string;
  status: SocialStatus;
  publishTime: string;
  hashtags: string;
  theme: string;
  materialLink: string;
  budget: number;
  date?: string;
  postLink?: string;
  type?: string;
  collaborator?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  loginMethod: 'email' | 'line';
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  documents: Document[];
  socialContents: SocialContent[];
  currentUser: User | null;
}
