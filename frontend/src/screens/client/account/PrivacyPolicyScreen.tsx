import React from 'react';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { LegalDocumentView } from '../../../components/common/LegalDocumentView';
import { PRIVACY_POLICY } from '../../../constants/legalContent';

export const PrivacyPolicyScreen: React.FC = () => (
  <AccountScreenLayout title="Privacy Policy">
    <LegalDocumentView document={PRIVACY_POLICY} />
  </AccountScreenLayout>
);
