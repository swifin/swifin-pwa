// apps/frontend/types/jspdf-autotable.d.ts
import 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
  }
}
