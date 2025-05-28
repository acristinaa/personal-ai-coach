export interface CoachingSession {
    userId: string;
    goals: string[];
    currentFocus: string;
    lastCheckIn: Date;
    streakDays: number;
  }
  
  export class CoachingService {
    // In production, replace with database operations
    private static sessions = new Map<string, CoachingSession>();
  
    static getSession(userId: string): CoachingSession | null {
      return this.sessions.get(userId) || null;
    }
  
    static createSession(userId: string, initialGoal: string): CoachingSession {
      const session: CoachingSession = {
        userId,
        goals: [initialGoal],
        currentFocus: initialGoal,
        lastCheckIn: new Date(),
        streakDays: 0,
      };
      this.sessions.set(userId, session);
      return session;
    }
  
    static updateSession(userId: string, updates: Partial<CoachingSession>): void {
      const session = this.sessions.get(userId);
      if (session) {
        Object.assign(session, updates);
        this.sessions.set(userId, session);
      }
    }
  
    static generateContextualPrompt(session: CoachingSession | null, message: string): string {
      if (!session) {
        return `New user asking: "${message}". Help them get started with goal setting.`;
      }
  
      return `User with goals: ${session.goals.join(', ')}. 
      Current focus: ${session.currentFocus}. 
      Streak: ${session.streakDays} days. 
      They said: "${message}". 
      Provide relevant coaching advice.`;
    }
  }