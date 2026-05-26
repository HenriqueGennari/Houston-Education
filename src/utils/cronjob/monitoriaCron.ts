import cron from "node-cron";
import MonitoriaPrismaRepository from "../../repositories/Prisma/MonitoriaPrismaRepository.js";

export function monitoriasCron() {
  // roda a cada 2 horas
  cron.schedule("0 */2 * * *", async () => {
    try {
      const repo = new MonitoriaPrismaRepository();
      await repo.marcarExpiradas();
      console.log("[CRON] Monitorias expiradas verificadas");
    } catch (err) {
      console.error("[CRON] Erro ao marcar expiradas:", err);
    }
  });
}
