// Pequeno "canal" para outros blocos da página escolherem o serviço no widget de marcação.
export const SELECT_SERVICE_EVENT = "bsl:select-service";

export function selectService(serviceId: string) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: serviceId }));
  document.getElementById("marcar")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
