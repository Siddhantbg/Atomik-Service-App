import React from 'react';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { LegalDocumentView } from '../../../components/common/LegalDocumentView';
import { TERMS_CONDITIONS } from '../../../constants/legalContent';

export const TermsConditionsScreen: React.FC = () => (
  <AccountScreenLayout title="Terms & Conditions">
    <LegalDocumentView document={TERMS_CONDITIONS} />
  </AccountScreenLayout>
);
