import { Category } from "../backend.d";

export function getCategoryGradient(category: Category | string): string {
  switch (category) {
    case Category.silk:
    case "silk":
      return "linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #ec4899 100%)";
    case Category.cotton:
    case "cotton":
      return "linear-gradient(135deg, #0d9488 0%, #059669 50%, #22c55e 100%)";
    case Category.designer:
    case "designer":
      return "linear-gradient(135deg, #d97706 0%, #ea580c 50%, #f97316 100%)";
    case Category.bridal:
    case "bridal":
      return "linear-gradient(135deg, #9f1239 0%, #be123c 50%, #e11d48 100%)";
    case Category.bestSellers:
    case "bestSellers":
      return "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)";
    default:
      return "linear-gradient(135deg, #8A0F3A 0%, #C7A24D 100%)";
  }
}

export function getCategoryLabel(category: Category | string): string {
  switch (category) {
    case Category.silk:
    case "silk":
      return "Silk Sarees";
    case Category.cotton:
    case "cotton":
      return "Cotton Sarees";
    case Category.designer:
    case "designer":
      return "Designer Sarees";
    case Category.bridal:
    case "bridal":
      return "Bridal Collection";
    case Category.bestSellers:
    case "bestSellers":
      return "Best Sellers";
    default:
      return String(category);
  }
}
