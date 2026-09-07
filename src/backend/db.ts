import crypto from "crypto";

export const memoryDb = {
  users: [] as any[],
  locations: [] as any[],
  chat_sessions: [] as any[],
  chat_messages: [] as any[],
  weather_alerts: [] as any[],
  weather_queries: [] as any[]
};

export async function getDb() {
  return {
    run: async (query: string, params: any[]) => {
      // Mock insert for locations and chat_messages based on structure
      if (query.includes("INSERT INTO chat_messages")) {
        memoryDb.chat_messages.push({
          id: params[0],
          session_id: params[1],
          role: params[2],
          message: params[3],
          telemetry: params[4],
          created_at: new Date().toISOString()
        });
      } else if (query.includes("INSERT INTO locations")) {
        memoryDb.locations.push({
          id: params[0],
          name: params[1],
          latitude: params[2],
          longitude: params[3],
          country: params[4],
          created_at: new Date().toISOString()
        });
      }
    },
    all: async (query: string) => {
      if (query.includes("FROM locations")) {
        return memoryDb.locations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      return [];
    }
  };
}

export async function initDb() {
  console.log("Memory Database initialized (SQLite replaced due to glibc constraints)");
}
