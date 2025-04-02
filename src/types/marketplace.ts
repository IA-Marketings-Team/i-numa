
import { ElementType } from 'react';

export interface OfferCategory {
  icon: ElementType;
  label: string;
  description: string;
  offerings: {
    title: string;
    price: string;
    setupFee?: string;
    features: {
      title: string;
      items: string[];
    }[];
  }[];
}

export interface CartItem {
  id: string;
  category: string;
  title: string;
  price: string;
  setupFee?: string;
  quantity: number;
  offreId: string;
  nom?: string;
  description?: string;
  type?: string;
  prix?: number;
  prixMensuel?: string;
  fraisCreation?: string;
}
