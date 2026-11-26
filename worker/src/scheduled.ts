import type { Env } from "./env";
import { scheduleDueSources } from "./modules/discovery";
import { deleteExpiredSessions } from "./modules/auth/sessions";

export const CRON_HOURLY = "0 * * * *";
export const CRON_DAILY_MAINTENANCE = "30 3 * * *";

export async function handleScheduled(controller: ScheduledController, env: Env): Promise<void> {
  switch (controller.cron) {
    case CRON_HOURLY: {
      const queued = await scheduleDueSources(env, controller.scheduledTime);
      console.info("cron_discovery", { queued });
      break;
    }
    case CRON_DAILY_MAINTENANCE: {
      await deleteExpiredSessions(env);
      const cutoff = Date.now() - 400 * 24 * 60 * 60 * 1000; // keep ~13 months of analytics events
      await env.DB_CORE.prepare("DELETE FROM events WHERE created_at < ?").bind(cutoff).run();
      console.info("cron_maintenance_done");
      break;
    }
    default:
      console.warn("cron_unknown", { cron: controller.cron });
  }
}
