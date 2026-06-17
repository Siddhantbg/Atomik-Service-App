import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { COLORS } from '../../constants/colors';
import type { LegalDocument } from '../../constants/legalContent';

interface Props {
  document: LegalDocument;
}

export const LegalDocumentView: React.FC<Props> = ({ document }) => (
  <View style={styles.root}>
    <Card padding={16}>
      <Text style={styles.docTitle}>{document.title}</Text>
      <Text style={styles.updated}>Last updated: {document.lastUpdated}</Text>
      {document.intro?.map((paragraph, index) => (
        <Text key={`intro-${index}`} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </Card>

    {document.sections.map((section, index) => (
      <Card key={`section-${index}`} padding={16} style={styles.sectionCard}>
        {section.heading ? (
          <Text style={styles.sectionHeading}>{section.heading}</Text>
        ) : null}
        {section.paragraphs?.map((paragraph, pIndex) => (
          <Text key={`p-${index}-${pIndex}`} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        {section.bullets?.map((bullet, bIndex) => (
          <View key={`b-${index}-${bIndex}`} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </Card>
    ))}
  </View>
);

const styles = StyleSheet.create({
  root: {
    paddingBottom: 24,
  },
  docTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 6,
  },
  updated: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  sectionCard: {
    marginTop: 12,
  },
  sectionHeading: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 10,
    lineHeight: 20,
  },
  paragraph: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 21,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 4,
  },
  bulletDot: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.red,
    width: 16,
    lineHeight: 21,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 21,
  },
});
