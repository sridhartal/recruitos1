import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(process.cwd(), 'mock_data');

export interface HiringManager {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  company: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  currentRole: string;
  location: string;
  status: string;
}

export interface JobBoard {
  name: string;
  endpoint: string;
  enabled: boolean;
  simulationDelay: number;
}

export interface JobBoardsConfig {
  [key: string]: JobBoard;
}

class MockDataService {
  private hiringManagers: HiringManager[] | null = null;
  private candidates: Candidate[] | null = null;
  private jobBoardsConfig: JobBoardsConfig | null = null;

  getHiringManagers(): HiringManager[] {
    if (this.hiringManagers) {
      return this.hiringManagers;
    }

    try {
      const filePath = path.join(mockDataPath, 'hiring_managers.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      this.hiringManagers = JSON.parse(fileContents);
      return this.hiringManagers || [];
    } catch (error) {
      console.error('Error loading hiring managers:', error);
      return [];
    }
  }

  getCandidates(): Candidate[] {
    if (this.candidates) {
      return this.candidates;
    }

    try {
      const filePath = path.join(mockDataPath, 'candidates_db.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      this.candidates = JSON.parse(fileContents);
      return this.candidates || [];
    } catch (error) {
      console.error('Error loading candidates:', error);
      return [];
    }
  }

  getJobBoardsConfig(): JobBoardsConfig {
    if (this.jobBoardsConfig) {
      return this.jobBoardsConfig;
    }

    try {
      const filePath = path.join(mockDataPath, 'job_boards_config.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      this.jobBoardsConfig = JSON.parse(fileContents);
      return this.jobBoardsConfig || {};
    } catch (error) {
      console.error('Error loading job boards config:', error);
      return {};
    }
  }

  getConversationLogs(): string {
    try {
      const filePath = path.join(mockDataPath, 'conversation_logs.txt');
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error loading conversation logs:', error);
      return '';
    }
  }

  getOfferTemplate(): string {
    try {
      const filePath = path.join(mockDataPath, 'offer_template.md');
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error loading offer template:', error);
      return '';
    }
  }
}

export const mockDataService = new MockDataService();
